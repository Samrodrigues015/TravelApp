import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const reservationsFile = path.join(process.cwd(), "reservations.json");

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório." }, { status: 400 });
  }

  try {
    let reservations: any[] = [];

    try {
      const fileData = await fs.readFile(reservationsFile, "utf-8");
      reservations = JSON.parse(fileData || "[]");
    } catch {
      reservations = [];
    }

    const userReservations = reservations.filter(
      (r: any) => r.userEmail === email
    );

    return NextResponse.json({ reservations: userReservations });
  } catch (err) {
    console.error("Erro em GET /get-reservations:", err);
    return NextResponse.json(
      { error: "Erro ao carregar reservas." },
      { status: 500 }
    );
  }
}
