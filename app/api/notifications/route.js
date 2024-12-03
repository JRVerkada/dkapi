import { NextResponse } from 'next/server';

// Temporary in-memory notification storage
let notifications = [];

export async function GET() {    
  return NextResponse.json(notifications);
}

export async function POST(request) {
  const body = await request.json();
  console.log(body);
  notifications.push(body);

  return NextResponse.json({ message: 'Notification added'});
}