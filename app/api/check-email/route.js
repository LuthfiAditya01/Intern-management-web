import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { User } from "../../../models/index.js";

export async function GET(request) {
  try {
    await connectPostgreSQL();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    const user = await User.findOne({
      where: { email: email }
    });

    return NextResponse.json({ 
      exists: !!user,
      message: user ? "Email sudah terdaftar" : "Email tersedia"
    });

  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ 
      error: "Terjadi kesalahan saat mengecek email",
      details: error.message 
    }, { status: 500 });
  }
}