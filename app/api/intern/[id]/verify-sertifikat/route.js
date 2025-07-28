import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Intern from "@/models/internInfo";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }
    
    await connectMongoDB();
    
    const intern = await Intern.findById(id);
    
    if (!intern) {
      return NextResponse.json(
        { success: false, message: "Intern not found" },
        { status: 404 }
      );
    }
    
    // Update the verification status
    intern.isSertifikatVerified = true;
    await intern.save();
    
    return NextResponse.json({
      success: true,
      message: "Certificate verification status updated successfully"
    });
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}