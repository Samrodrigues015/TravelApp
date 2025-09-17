import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid"; // 👈 Importa a função v4 da biblioteca uuid


interface Reservation {
  id: string; 
  flightId: string;
  userEmail: string;
  createdAt: string;
  flightDetails: string; // <-- novo campo
}

const RESERVATIONS_FILE = path.join(process.cwd(), "reservations.json");

export async function POST(req: NextRequest) {
  try {
    const { flightId, userEmail, flightDetails } = await req.json();

    if (!flightId || !userEmail) {
      return NextResponse.json({ error: "flightId e userEmail são obrigatórios" }, { status: 400 });
    }

    // Ler reservas existentes
    let reservations: Reservation[] = [];
    if (fs.existsSync(RESERVATIONS_FILE)) {
      const fileData = fs.readFileSync(RESERVATIONS_FILE, "utf-8");
      reservations = JSON.parse(fileData);
    }

    // Adicionar nova reserva com ID único
    const newReservation: Reservation = {
      id: uuidv4(), // 👈 Gera um ID único para a nova reserva
      flightId,
      userEmail,
      createdAt: new Date().toISOString(),
      flightDetails, // <-- novo campo
    };
    reservations.push(newReservation);

    // Salvar no arquivo
    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));

    console.log("Reserva adicionada:", newReservation);

    return NextResponse.json({ message: "Reserva realizada com sucesso!", reservation: newReservation });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao reservar voo" }, { status: 500 });
  }
}