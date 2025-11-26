import { connectDB } from '../db';
import { HeroSlide } from '../models';
import type { HeroSlide as HeroSlideType } from '@/types';

export async function getActiveHeroSlides(): Promise<HeroSlideType[]> {
  try {
    await connectDB();
    const slides = await HeroSlide.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean()
      .exec();
    return slides as HeroSlideType[];
  } catch (error: any) {
    console.error('Error fetching hero slides:', error.message);
    return [];
  }
}

export async function getHeroSlideById(
  id: string
): Promise<HeroSlideType | null> {
  try {
    await connectDB();
    const slide = await HeroSlide.findById(id).lean().exec();
    return slide as HeroSlideType;
  } catch (error: any) {
    console.error('Error fetching hero slide:', error.message);
    return null;
  }
}

export async function createHeroSlide(
  data: Partial<HeroSlideType>
): Promise<HeroSlideType> {
  try {
    await connectDB();
    const slide = new HeroSlide(data);
    await slide.save();
    return slide.toObject() as HeroSlideType;
  } catch (error: any) {
    console.error('Error creating hero slide:', error.message);
    throw error;
  }
}

export async function updateHeroSlide(
  id: string,
  data: Partial<HeroSlideType>
): Promise<HeroSlideType | null> {
  try {
    await connectDB();
    const slide = await HeroSlide.findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec();
    return slide as HeroSlideType;
  } catch (error: any) {
    console.error('Error updating hero slide:', error.message);
    return null;
  }
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await HeroSlide.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error: any) {
    console.error('Error deleting hero slide:', error.message);
    return false;
  }
}
