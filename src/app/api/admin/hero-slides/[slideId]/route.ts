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

export async function PUT(
  req: NextRequest,
  { params }: { params: { slideId: string } }
) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    await connectDB();

    const slide = await HeroSlide.findByIdAndUpdate(params.slideId, data, {
      new: true,
    }).lean();

    return NextResponse.json({
      message: 'Hero slide updated',
      slide,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error updating hero slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slideId: string } }
) {
  const { authorized } = await checkAdminAccess(req);
  if (!authorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    await HeroSlide.findByIdAndDelete(params.slideId);

    return NextResponse.json({
      message: 'Hero slide deleted',
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error deleting hero slide' },
      { status: 500 }
    );
  }
}
