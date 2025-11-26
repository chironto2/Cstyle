import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { FeaturedBanner } from '@/lib/models';
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
    const banner = await FeaturedBanner.findOne({ isActive: true }).lean();
    return NextResponse.json(banner || {});
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching featured banner' },
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

    // Only one active banner
    if (data.isActive) {
      await FeaturedBanner.updateMany({}, { isActive: false });
    }

    const banner = new FeaturedBanner(data);
    await banner.save();

    return NextResponse.json(
      { message: 'Featured banner created', banner },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error creating featured banner' },
      { status: 500 }
    );
  }
}
