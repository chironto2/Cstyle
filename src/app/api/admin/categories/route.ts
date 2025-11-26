import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

async function checkAdminAccess(req: NextRequest) {
  const token = extractTokenFromHeader(req.headers.get('Authorization') || '');
  if (!token) {
    return { authorized: false };
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== 'admin') {
    return { authorized: false };
  }

  return { authorized: true };
}

export async function GET(req: NextRequest) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const categories = await Category.find().lean();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching categories' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await connectDB();

    const category = new Category(data);
    await category.save();

    return NextResponse.json(
      { message: 'Category created', category },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error creating category: ' + error.message },
      { status: 500 }
    );
  }
}
