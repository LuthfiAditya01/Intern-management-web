import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { Assessment, Intern } from "../../../models/index.js";

export async function POST(req) {
    try {
        await connectPostgreSQL();
        const body = await req.json();

        const newAssessment = await Assessment.create(body);
        return NextResponse.json({ success: true, assessment: newAssessment });
    } catch (err) {
        console.error("POST assessment error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectPostgreSQL();
        const { searchParams } = new URL(request.url);
        const internId = searchParams.get("internId");

        const assessments = internId
            ? await Assessment.findAll({
                where: { internId },
                include: [
                    {
                        model: Intern,
                        as: 'intern',
                        attributes: ['nama', 'nim', 'divisi']
                    }
                ]
            })
            : await Assessment.findAll({
                include: [
                    {
                        model: Intern,
                        as: 'intern',
                        attributes: ['nama', 'nim', 'divisi']
                    }
                ]
            });

        return NextResponse.json({ success: true, assessments });
    } catch (err) {
        console.error("GET assessment error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}

// DELETE: Hapus assessment berdasarkan ID
export async function DELETE(request) {
    try {
        await connectPostgreSQL();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "ID harus disediakan untuk menghapus penilaian." },
                { status: 400 }
            );
        }

        const assessment = await Assessment.findByPk(id);
        if (!assessment) {
            return NextResponse.json(
                { success: false, message: "Penilaian tidak ditemukan." },
                { status: 404 }
            );
        }

        await assessment.destroy();
        return NextResponse.json({ success: true, message: "Penilaian berhasil dihapus." });
    } catch (err) {
        console.error("DELETE assessment error:", err);
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 }
        );
    }
}
