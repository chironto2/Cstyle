import { connectDB } from '../db';
import { Category } from '../models';
import type { Category as CategoryType } from '@/types';

export async function getCategories(): Promise<CategoryType[]> {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).lean().exec();
    return categories as CategoryType[];
  } catch (error: any) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
}

export async function getCategoryById(
  id: string
): Promise<CategoryType | null> {
  try {
    await connectDB();
    const category = await Category.findById(id).lean().exec();
    return category as CategoryType;
  } catch (error: any) {
    console.error('Error fetching category by ID:', error.message);
    return null;
  }
}

export async function createCategory(
  data: Partial<CategoryType>
): Promise<CategoryType> {
  try {
    await connectDB();
    const category = new Category(data);
    await category.save();
    return category.toObject() as CategoryType;
  } catch (error: any) {
    console.error('Error creating category:', error.message);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryType>
): Promise<CategoryType | null> {
  try {
    await connectDB();
    const category = await Category.findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    return category as CategoryType;
  } catch (error: any) {
    console.error('Error updating category:', error.message);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await Category.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error: any) {
    console.error('Error deleting category:', error.message);
    return false;
  }
}
