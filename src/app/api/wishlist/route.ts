import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Wishlist } from '@/lib/models';
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

    let wishlist = await Wishlist.findOne({ userId: decoded.userId }).lean();
    if (!wishlist) {
      wishlist = await new Wishlist({
        userId: decoded.userId,
        items: [],
      }).save();
    }

    return NextResponse.json(wishlist);
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { message: 'Error fetching wishlist' },
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

    const { productId } = await req.json();

    await connectDB();

    let wishlist = await Wishlist.findOne({ userId: decoded.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: decoded.userId, items: [] });
    }

    const itemIndex = wishlist.items.findIndex(
      (item: any) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      wishlist.items.splice(itemIndex, 1);
    } else {
      wishlist.items.push({ productId });
    }

    await wishlist.save();

    return NextResponse.json({
      message: 'Wishlist updated',
      wishlist,
    });
  } catch (error: any) {
    console.error('Error updating wishlist:', error);
    return NextResponse.json(
      { message: 'Error updating wishlist' },
      { status: 500 }
    );
  }
}
