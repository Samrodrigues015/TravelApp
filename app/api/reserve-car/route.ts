// app/api/reserve-car/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

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
      type: "car",
      carId,
      userEmail,
      reservationDate: new Date().toISOString(),
      carDetails,
    };

    reservations.push(newReservation);

    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));

    // ENVIO DE E-MAIL (igual ao de hotéis, mas com detalhes do carro)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"TravelApp" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Confirmação de Reserva de Carro",
      text: `
Sua reserva de carro foi realizada com sucesso!

Detalhes da Reserva:
- Carro: ${carDetails.car_name}
- Categoria: ${carDetails.category || "Não informado"}
- Local de retirada: ${carDetails.pickupLocation || "Não informado"}
- Local de devolução: ${carDetails.dropoffLocation || "Não informado"}
- Data de retirada: ${carDetails.pickupDate || "Não informado"}
- Data de devolução: ${carDetails.dropoffDate || "Não informado"}
- Valor: ${carDetails.price || "Não informado"} ${carDetails.currency || ""}
- Data da Reserva: ${newReservation.reservationDate}

Obrigado por reservar conosco!
      `,
    });

    return NextResponse.json({ message: "Reserva de carro confirmada com sucesso!" });
  } catch (err) {
    console.error("Erro ao reservar carro:", err);
    return NextResponse.json(
      { error: "Erro ao processar a reserva de carro" },
      { status: 500 }
    );
  }
}
