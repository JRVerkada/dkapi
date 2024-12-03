import { NextResponse } from 'next/server';
import {AddNotification} from "@/components/NotificationList"

export async function GET()
{
    return NextResponse.json({ message: 'SEND POST'});
}

export async function POST(request: { json: () => any; }) {
    // Parsing the incoming request body
    const body = await request.json();
    await AddNotification(body);
    return NextResponse.json({ message: 'Data received', data: body });
  }