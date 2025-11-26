import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

async function checkAdminAccess(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('Authorization') || '');
  if (!token) {
    return { authorized: false, decoded: null };
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return { authorized: false, decoded: null };
  }

  return { authorized: true, decoded };
}

export async function GET(req: NextRequest) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const products = await Product.find().lean();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  try {
    const data = await req.json();
    await connectDB();

    const product = new Product(data);
    await product.save();

    return NextResponse.json(
      { message: 'Product created', product },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Error creating product: ' + error.message },
      { status: 500 }
    );
  }
}
