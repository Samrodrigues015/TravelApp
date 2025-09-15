import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const RESERVATIONS_FILE = path.join(process.cwd(), "reservations.json");

export async function POST(req: NextRequest) {
  try {
    const { carId, userEmail, carDetails } = await req.json();

    if (!carId || !userEmail || !carDetails) {
      return NextResponse.json(
        { error: "Dados da reserva do carro ausentes" },
        { status: 400 }
      );
    }

    // Lê reservas existentes
    const reservations = fs.existsSync(RESERVATIONS_FILE)
      ? JSON.parse(fs.readFileSync(RESERVATIONS_FILE, "utf-8"))
      : [];

    const newReservation = {
      id: Date.now().toString(),
      type: "car", // <- importante para filtrar depois
      carId,
      userEmail,
      reservationDate: new Date().toISOString(),
      carDetails, // aqui você pode salvar nome do carro, preço, imagem, etc.
    };

    reservations.push(newReservation);

    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));

    return NextResponse.json({ message: "Reserva de carro confirmada!" });
  } catch (err) {
    console.error("Erro ao reservar carro:", err);
    return NextResponse.json(
      { error: "Erro ao processar a reserva de carro" },
      { status: 500 }
    );
  }
}
