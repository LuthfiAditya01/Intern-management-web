import { NextResponse } from "next/server";
import { connectPostgreSQL } from "../../../libs/postgresql.js";
import { Quota } from "../../../models/index.js";

export async function PUT(request) {
    try {
        await connectPostgreSQL();
        const { bulan, tahun, jumlahKuota } = await request.json();

        if (!bulan || !tahun || jumlahKuota === undefined) {
            return NextResponse.json(
                { message: 'Data tidak lengkap' },
                { status: 400 }
            );
        }

        const [updatedQuota, created] = await Quota.upsert({
            bulan,
            tahun,
            jumlahKuota
        }, {
            returning: true
        });

        return NextResponse.json(updatedQuota);
    } catch (error) {
        console.error("PUT quota error:", error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await connectPostgreSQL();
        const { searchParams } = new URL(request.url);
        const bulan = searchParams.get("bulan");
        const tahun = searchParams.get("tahun");

        let whereClause = {};
        if (bulan && tahun) {
            whereClause = { bulan: parseInt(bulan), tahun: parseInt(tahun) };
        }

        const quotas = await Quota.findAll({
            where: whereClause,
            order: [['tahun', 'DESC'], ['bulan', 'ASC']]
        });

        return NextResponse.json({ quotas });
    } catch (error) {
        console.error("GET quota error:", error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}