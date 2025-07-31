import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../../../libs/postgresql.js";
import { Intern, User } from "../../../../../models/index.js";
import { sequelize } from "../../../../../libs/postgresql.js";

export async function PUT(request, { params }) {
    // Inisialisasi transaction
    let transaction;
    
    try {
        console.log("FINALIZE-REGISTER request received");
        await connectPostgreSQL();
        console.log("Database connected");
        
        const { id } = params;
        if (!id) {
            return NextResponse.json({ message: "ID intern diperlukan" }, { status: 400 });
        }

        const body = await request.json();
        console.log("Request body:", body);
        const { firebaseUid, isTemporary } = body;

        if (!firebaseUid) {
            return NextResponse.json({ message: "Firebase UID diperlukan" }, { status: 400 });
        }

        // Mulai transaction
        transaction = await sequelize.transaction();

        // 1. Cari intern dengan ID yang diberikan
        const intern = await Intern.findByPk(id, { transaction });
        if (!intern) {
            await transaction.rollback();
            return NextResponse.json({ message: "Data intern tidak ditemukan" }, { status: 404 });
        }

        if (!intern.isTemporary) {
            await transaction.rollback();
            return NextResponse.json({ message: "Data intern sudah difinalisasi" }, { status: 400 });
        }

        // 2. Cari user terkait
        const user = await User.findByPk(intern.userId, { transaction });
        if (!user) {
            await transaction.rollback();
            return NextResponse.json({ message: "Data user tidak ditemukan" }, { status: 404 });
        }

        // 3. Update user dengan Firebase UID yang sebenarnya
        await user.update({
            firebaseUid: firebaseUid,
            isTemporary: false
        }, { transaction });

        // 4. Update intern untuk menandai sudah tidak temporary
        await intern.update({
            isTemporary: false
        }, { transaction });

        // Commit transaction
        await transaction.commit();
        
        return NextResponse.json({
            message: "Registrasi berhasil difinalisasi",
            intern: intern
        }, { status: 200 });

    } catch (error) {
        // Rollback transaction jika ada error
        if (transaction) await transaction.rollback();
        
        console.error("FINALIZE-REGISTER Error details:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({
          message: "Terjadi kesalahan pada server.",
          error: error.message
        }, { status: 500 });
    }
}