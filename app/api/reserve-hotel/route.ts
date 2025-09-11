import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESERVATIONS_FILE = path.join(process.cwd(), "app/data/hotel-reservations.json");

export async function POST(req: NextRequest) {
  try {
    const { hotelId, userEmail, hotelDetails } = await req.json();

    if (!hotelId || !userEmail || !hotelDetails) {
      return NextResponse.json({ error: "Dados da reserva ausentes" }, { status: 400 });
    }

    // Lê as reservas existentes
    const reservations = fs.existsSync(RESERVATIONS_FILE)
      ? JSON.parse(fs.readFileSync(RESERVATIONS_FILE, "utf-8"))
      : [];

    const newReservation = {
      id: Date.now().toString(), // ID único para a reserva
      hotelId,
      userEmail,
      reservationDate: new Date().toISOString(),
      hotelDetails,
    };

    reservations.push(newReservation);

    // Salva a nova lista de reservas
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));

    return NextResponse.json({ message: "Reserva de hotel confirmada com sucesso!" });
  } catch (err) {
    console.error("Erro ao reservar hotel:", err);
    return NextResponse.json({ error: "Erro ao processar a reserva" }, { status: 500 });
  }
}