import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    await connectDB();

    if (id) {
      const product = await Product.findById(id).lean();
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    }

    if (category) {
      const products = await Product.find({ category, isActive: true }).lean();
      return NextResponse.json(products);
    }

    const products = await Product.find({ isActive: true }).lean();
    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Error fetching products: ' + error.message },
      { status: 500 }
    );
  }
}
