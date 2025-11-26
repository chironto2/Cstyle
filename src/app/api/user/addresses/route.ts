import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Address } from '@/lib/models';
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

    const addresses = await Address.find({ userId: decoded.userId }).lean();

    return NextResponse.json(addresses);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error fetching addresses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const data = await req.json();

    await connectDB();

    const address = new Address({
      userId: decoded.userId,
      ...data,
    });

    await address.save();

    return NextResponse.json(
      { message: 'Address created', address },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Error creating address' },
      { status: 500 }
    );
  }
}
