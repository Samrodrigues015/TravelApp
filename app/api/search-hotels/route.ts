import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Este código simula a busca por hotéis.
// Ele retorna um JSON com uma lista de hotéis de exemplo.
export async function POST(req: NextRequest) {
  try {
    const { query, checkInDate, checkOutDate } = await req.json();

    // Dados de exemplo
    const hotels = [
      {
        id: "hotel-1",
        hotel_name: "Hotel de luxo em Paris",
        description: "Um hotel de 5 estrelas com vista para a Torre Eiffel.",
        nightly_price: "350",
        currency: "USD",
        review_rating_float: 4.8,
        image_list: ["https://picsum.photos/id/1000/400/300"],
      },
      {
        id: "hotel-2",
        hotel_name: "Hotel boutique charmoso",
        description: "Pequeno e aconchegante, no coração da cidade.",
        nightly_price: "150",
        currency: "USD",
        review_rating_float: 4.5,
        image_list: ["https://picsum.photos/id/1005/400/300"],
      },
      {
        id: "hotel-3",
        hotel_name: "Hostel econômico",
        description: "Opção barata para mochileiros, perto de transportes públicos.",
        nightly_price: "45",
        currency: "USD",
        review_rating_float: 3.9,
        image_list: ["https://picsum.photos/id/1010/400/300"],
      },
    ];

    // Simula um delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({ data: hotels });
  } catch (err) {
    console.error("Erro na API de busca de hotéis:", err);
    return NextResponse.json({ error: "Erro ao buscar hotéis" }, { status: 500 });
  }
}