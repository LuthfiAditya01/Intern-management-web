// app/api/template/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Template from '../../../models/Template';

export async function GET() {
  try {
    await connectDB();
    const templates = await Template.find({});
    return NextResponse.json(templates);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const template = await Template.create(data);
    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
