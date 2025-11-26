import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Order, User } from '@/lib/models';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('Authorization') || '');
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    const orders = await Order.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Error fetching orders: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = extractTokenFromHeader(req.headers.get('Authorization') || '');
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { items, totalAmount, shippingAddress } = await req.json();

    if (!items || !totalAmount) {
      return NextResponse.json(
        { message: 'Items and total amount are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const order = new Order({
      userId: decoded.userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
    });

    await order.save();

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Error creating order: ' + error.message },
      { status: 500 }
    );
  }
}
