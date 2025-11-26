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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await connectDB();

    const product = await Product.findByIdAndUpdate(params.id, data, {
      new: true,
    }).lean();

    return NextResponse.json({
      message: 'Product updated',
      product,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error updating product: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Product deleted',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}
