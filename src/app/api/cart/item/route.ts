import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.json({
    message: 'Cart item updated',
  });
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({
    message: 'Cart item removed',
  });
}
