// app/api/template/reset/route.js
import { NextResponse } from "next/server";
import connectMongoDB from "../../../../lib/mongodb";
import Template from "../../../../models/Template";

// Reset template positions to original values
export async function GET() {
  try {
    await connectMongoDB();
    
    const templates = await Template.find({});
    
    if (!templates || templates.length === 0) {
      return NextResponse.json({ message: "No templates found to reset" });
    }
    
    // Default positions
    const defaultPositions = {
      "Judul": 47,
      "SERTIFIKAT": 47,
      "Nomor": 80,
      "Sub Judul": 122,
      "diberikan kepada:": 122,
      "Nama Peserta": 145,
      "Nama": 145, 
      "Deskripsi": 194,
      "Tanggal": 277,
      "Jabatan": 312,
      "Nama Penandatangan": 410
    };
    
    const updatePromises = templates.map(async (template) => {
      // Fix each element position
      const updatedElements = template.elements.map(el => {
        // Determine the correct position for this element
        let newTop = defaultPositions[el.label] || el.top;
        
        return {
          ...el,
          top: newTop
        };
      });
      
      // Update template with fixed element positions
      return Template.findByIdAndUpdate(
        template._id,
        { ...template.toObject(), elements: updatedElements },
        { new: true }
      );
    });
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ 
      success: true, 
      message: `Reset ${templates.length} templates successfully` 
    });
  } catch (error) {
    console.error("Error resetting templates:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to reset templates" 
    }, { status: 500 });
  }
} 