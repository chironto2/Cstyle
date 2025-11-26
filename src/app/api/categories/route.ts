import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).lean();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { message: 'Error fetching categories: ' + error.message },
      { status: 500 }
    );
  }
}
