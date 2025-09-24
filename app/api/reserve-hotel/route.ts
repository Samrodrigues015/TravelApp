// app/api/reserve-hotel/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const RESERVATIONS_FILE = path.join(process.cwd(), "reservations.json");

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
      id: Date.now().toString(),
      type: "hotel",
      hotelId,
      userEmail,
      reservationDate: new Date().toISOString(),
      hotelDetails,
    };

    reservations.push(newReservation);

    fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2));

    // ENVIO DE E-MAIL
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
      subject: "Confirmação de Reserva de Hotel",
      text: `
Sua reserva de hotel foi realizada com sucesso!

Detalhes da Reserva:
- Hotel: ${hotelDetails.hotel_name}
- Localização: ${hotelDetails.location || "Não informado"}
- Check-in: ${hotelDetails.checkInDate || "Não informado"}
- Check-out: ${hotelDetails.checkOutDate || "Não informado"}
- Valor: ${hotelDetails.nightly_price || "Não informado"} ${hotelDetails.currency || ""}
- Data da Reserva: ${newReservation.reservationDate}

Obrigado por reservar conosco!
      `,
    });

    return NextResponse.json({ message: "Reserva de hotel confirmada com sucesso!" });
  } catch (err) {
    console.error("Erro ao reservar hotel:", err);
    return NextResponse.json({ error: "Erro ao processar a reserva" }, { status: 500 });
  }
}
