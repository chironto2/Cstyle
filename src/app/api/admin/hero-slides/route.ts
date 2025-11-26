import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { HeroSlide } from '@/lib/models';
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
  try {
    await connectDB();
    const slides = await HeroSlide.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean();
    return NextResponse.json(slides);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching hero slides' },
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

    const slide = new HeroSlide(data);
    await slide.save();

    return NextResponse.json(
      { message: 'Hero slide created', slide },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error creating hero slide' },
      { status: 500 }
    );
  }
}
