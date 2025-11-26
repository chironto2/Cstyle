import { connectDB } from '../db';
import { Product } from '../models';
import type { Product as ProductType } from '@/types';

export async function getPublicProducts(
  limit?: number
): Promise<ProductType[]> {
  try {
    await connectDB();
    const query = Product.find({ isActive: true })
      .lean()
      .sort({ createdAt: -1 });

    if (limit) {
      query.limit(limit);
    }

    const products = await query.exec();
    return products as ProductType[];
  } catch (error: any) {
    console.error('Error fetching public products:', error.message);
    return [];
  }
}

export async function getProductById(id: string): Promise<ProductType | null> {
  try {
    await connectDB();
    const product = await Product.findById(id).lean().exec();
    return product as ProductType;
  } catch (error: any) {
    console.error('Error fetching product by ID:', error.message);
    return null;
  }
}

export async function createProduct(
  data: Partial<ProductType>
): Promise<ProductType> {
  try {
    await connectDB();
    const product = new Product(data);
    await product.save();
    return product.toObject() as ProductType;
  } catch (error: any) {
    console.error('Error creating product:', error.message);
    throw error;
  }
}

export async function updateProduct(
  id: string,
  data: Partial<ProductType>
): Promise<ProductType | null> {
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    return product as ProductType;
  } catch (error: any) {
    console.error('Error updating product:', error.message);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await Product.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error: any) {
    console.error('Error deleting product:', error.message);
    return false;
  }
}

export async function searchProducts(query: string): Promise<ProductType[]> {
  try {
    await connectDB();
    const products = await Product.find(
      {
        $text: { $search: query },
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .lean()
      .exec();

    return products as ProductType[];
  } catch (error: any) {
    console.error('Error searching products:', error.message);
    return [];
  }
}
