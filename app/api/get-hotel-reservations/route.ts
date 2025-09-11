// /api/get-hotel-reservations/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HOTEL_RESERVATIONS_FILE = path.join(process.cwd(), "hotel-reservations.json");
const HOTELS_DB = [
  {
    id: "H123",
    hotel_name: "Hotel Central",
    description: "Hotel 4 estrelas",
    nightly_price: "80",
    currency: "EUR",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { userEmail } = await req.json();
    
    if (!userEmail) {
      return NextResponse.json({ error: "userEmail é obrigatório" }, { status: 400 });
    }

    let reservations: any[] = [];
    if (fs.existsSync(HOTEL_RESERVATIONS_FILE)) {
      reservations = JSON.parse(fs.readFileSync(HOTEL_RESERVATIONS_FILE, "utf-8"));
    }

    // Filtra reservas do usuário
    const userReservations = reservations
      .filter(r => r.userEmail === userEmail)
      .map(r => ({
        id: r.id,
        userEmail: r.userEmail,
        reservationDate: r.createdAt,
        hotelDetails: HOTELS_DB.find(h => h.id === r.hotelId),
      }));

    return NextResponse.json({ data: userReservations });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ data: [], error: "Erro ao buscar reservas" }, { status: 500 });
  }
}