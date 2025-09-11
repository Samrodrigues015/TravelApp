import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESERVATIONS_FILE = path.join(process.cwd(), "reservations.json");

export async function POST(req: NextRequest) {
  try {
    const { reservationId } = await req.json();

    if (!reservationId) {
      return NextResponse.json(
        { error: "reservationId é obrigatório para o cancelamento." },
        { status: 400 }
      );
    }

    let reservations: any[] = [];
    if (fs.existsSync(RESERVATIONS_FILE)) {
      reservations = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, "utf-8"));
    }

    const initialLength = reservations.length;
    const filtered = reservations.filter((r) => r.id !== reservationId);

    if (filtered.length === initialLength) {
      return NextResponse.json({ error: "Reserva não encontrada." }, { status: 404 });
    }

    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(filtered, null, 2));

    return NextResponse.json({ message: "Reserva cancelada com sucesso!" });
  } catch (err) {
    console.error("Erro ao cancelar a reserva:", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
