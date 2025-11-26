import { connectDB } from '../db';
import { FeaturedBanner } from '../models';
import type { FeaturedBanner as FeaturedBannerType } from '@/types';

export async function getHomePageFeaturedBanner(): Promise<FeaturedBannerType | null> {
  try {
    await connectDB();
    const banner = await FeaturedBanner.findOne({ isActive: true })
      .lean()
      .exec();
    return banner as FeaturedBannerType;
  } catch (error: any) {
    console.error('Error fetching featured banner:', error.message);
    return null;
  }
}

export async function getAllFeaturedBanners(): Promise<FeaturedBannerType[]> {
  try {
    await connectDB();
    const banners = await FeaturedBanner.find().lean().exec();
    return banners as FeaturedBannerType[];
  } catch (error: any) {
    console.error('Error fetching featured banners:', error.message);
    return [];
  }
}

export async function createFeaturedBanner(
  data: Partial<FeaturedBannerType>
): Promise<FeaturedBannerType> {
  try {
    await connectDB();
    // Only one active banner at a time
    if (data.isActive) {
      await FeaturedBanner.updateMany({}, { isActive: false });
    }
    const banner = new FeaturedBanner(data);
    await banner.save();
    return banner.toObject() as FeaturedBannerType;
  } catch (error: any) {
    console.error('Error creating featured banner:', error.message);
    throw error;
  }
}

export async function updateFeaturedBanner(
  id: string,
  data: Partial<FeaturedBannerType>
): Promise<FeaturedBannerType | null> {
  try {
    await connectDB();
    // Only one active banner at a time
    if (data.isActive) {
      await FeaturedBanner.updateMany(
        { _id: { $ne: id } },
        { isActive: false }
      );
    }
    const banner = await FeaturedBanner.findByIdAndUpdate(id, data, {
      new: true,
    })
      .lean()
      .exec();
    return banner as FeaturedBannerType;
  } catch (error: any) {
    console.error('Error updating featured banner:', error.message);
    return null;
  }
}

export async function deleteFeaturedBanner(id: string): Promise<boolean> {
  try {
    await connectDB();
    const result = await FeaturedBanner.findByIdAndDelete(id).exec();
    return !!result;
  } catch (error: any) {
    console.error('Error deleting featured banner:', error.message);
    return false;
  }
}
