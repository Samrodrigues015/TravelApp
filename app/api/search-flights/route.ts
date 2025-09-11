import { type NextRequest, NextResponse } from "next/server"

interface AmadeusTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface FlightSearchParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate: string
  returnDate?: string // Adicionado campo opcional
  adults: number
}

async function getAmadeusToken(): Promise<string> {
  const clientId = process.env.AMADEUS_CLIENT_ID
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Credenciais da Amadeus não configuradas")
  }

  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    throw new Error("Falha ao obter token de acesso da Amadeus")
  }

  const data: AmadeusTokenResponse = await response.json()
  return data.access_token
}

async function searchFlights(token: string, params: FlightSearchParams) {
  const searchParams = new URLSearchParams({
    originLocationCode: params.originLocationCode.toUpperCase(),
    destinationLocationCode: params.destinationLocationCode.toUpperCase(),
    departureDate: params.departureDate,
    adults: params.adults.toString(),
    max: "10",
  })

  // Adiciona returnDate se fornecido
  if (params.returnDate) {
    searchParams.append("returnDate", params.returnDate)
  }

  const response = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error_description || "Erro ao buscar voos")
  }

  return response.json()
}

// Nova função para buscar código IATA pelo nome
async function getIataCode(location: string, token: string): Promise<string | null> {
  // Busca por aeroportos que correspondem ao termo
  let response = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${encodeURIComponent(location)}&subType=AIRPORT`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
  let data = await response.json()
  if (Array.isArray(data.data) && data.data.length > 0) {
    // Retorna o primeiro aeroporto encontrado
    return data.data[0].iataCode
  }

  // Se não encontrar, busca por cidade e retorna o primeiro aeroporto associado
  response = await fetch(
    `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${encodeURIComponent(location)}&subType=CITY`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )
  data = await response.json()
  if (Array.isArray(data.data) && data.data.length > 0) {
    const cityCode = data.data[0].iataCode
    // Busca aeroportos dessa cidade usando cityCode
    const airportResp = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?cityCode=${cityCode}&subType=AIRPORT`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
    const airportData = await airportResp.json()
    if (Array.isArray(airportData.data) && airportData.data.length > 0) {
      return airportData.data[0].iataCode
    }
  }

  // Se não encontrar, retorna null
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body: FlightSearchParams = await request.json()

    // Validar dados de entrada
    if (
      !body.originLocationCode ||
      !body.destinationLocationCode ||
      !body.departureDate ||
      !body.adults
    ) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos" }, { status: 400 })
    }

    if (body.adults < 1 || body.adults > 9) {
      return NextResponse.json({ error: "Número de adultos deve ser entre 1 e 9" }, { status: 400 })
    }

    // Validar formato da data
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(body.departureDate)) {
      return NextResponse.json({ error: "Formato de data inválido. Use YYYY-MM-DD" }, { status: 400 })
    }
    if (body.returnDate && !dateRegex.test(body.returnDate)) {
      return NextResponse.json({ error: "Formato da data de volta inválido. Use YYYY-MM-DD" }, { status: 400 })
    }

    // Validar códigos IATA (3 letras)
    const iataRegex = /^[A-Z]{3}$/i
    if (!iataRegex.test(body.originLocationCode) || !iataRegex.test(body.destinationLocationCode)) {
      return NextResponse.json({ error: "Códigos IATA devem ter exatamente 3 letras" }, { status: 400 })
    }

    // Obter token de acesso
    const token = await getAmadeusToken()

    // Buscar voos usando os códigos IATA fornecidos
    const flightData = await searchFlights(token, body)

    return NextResponse.json(flightData)
  } catch (error) {
    console.error("Erro na busca de voos:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
