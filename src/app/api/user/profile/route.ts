import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(
      req.headers.get('Authorization') || ''
    );
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(decoded.userId).select('-password').lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(
      req.headers.get('Authorization') || ''
    );
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { name, phone } = await req.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { name, phone },
      { new: true }
    )
      .select('-password')
      .lean();

    return NextResponse.json({
      message: 'Profile updated',
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error updating profile' },
      { status: 500 }
    );
  }
}
