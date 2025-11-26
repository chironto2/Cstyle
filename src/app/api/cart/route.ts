import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Cart is stored in localStorage on client, no server-side cart storage
  return NextResponse.json({
    message: 'Cart is managed client-side',
  });
}

export async function POST(req: NextRequest) {
  // Cart items are managed client-side via localStorage
  return NextResponse.json({
    message: 'Cart updated client-side',
  });
}
