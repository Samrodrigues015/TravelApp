import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESERVATIONS_FILE = path.join(process.cwd(), "hotel-reservations.json");

export async function POST(req: NextRequest) {
  try {
    const { reservationId } = await req.json();

    if (!reservationId) {
      return NextResponse.json({ error: "ID da reserva é obrigatório" }, { status: 400 });
    }

    if (!fs.existsSync(RESERVATIONS_FILE)) {
      return NextResponse.json({ error: "Arquivo de reservas não encontrado" }, { status: 404 });
    }

    const reservations = JSON.parse(fs.readFileSync(RESERVATIONS_FILE, "utf-8"));
    const newReservations = reservations.filter((res: any) => res.id !== reservationId);

    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(newReservations, null, 2));

    return NextResponse.json({ message: "Reserva de hotel cancelada com sucesso!" });
  } catch (err) {
    console.error("Erro ao cancelar reserva de hotel:", err);
    return NextResponse.json({ error: "Erro ao cancelar reserva de hotel" }, { status: 500 });
  }
}