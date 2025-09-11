"use client";

import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

interface FlightOffer {
  id: string;
  source: string;
  itineraries: Array<{
    segments: Array<{
      departure: {
        iataCode: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        at: string;
      };
    }>;
  }>;
  price: {
    total: string;
    currency: string;
  };
}

interface SearchFormData {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
}

export default function Home() {
  const [formData, setFormData] = useState<SearchFormData>({
    originLocationCode: "",
    destinationLocationCode: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
  });
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null
  );
  const [reservationSuccess, setReservationSuccess] = useState("");

  // Hooks do modal de pagamento e cliente
  const [showPayment, setShowPayment] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Funções de formatação e validação
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formattedValue = value.replace(/^(\d{2})/, "$1/");
    setExpiryDate(formattedValue);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlights([]);
    setSelectedFlight(null);
    setReservationSuccess("");

    try {
      const response = await fetch("/api/search-flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar voos");
      }

      setFlights(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "adults" ? Number.parseInt(value) || 1 : value,
    }));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Buscar Voos
          </h1>
          {/* Formulário de busca */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="originLocationCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Origem (Código IATA, ex: GRU)
                  </label>
                  <input
                    type="text"
                    id="originLocationCode"
                    name="originLocationCode"
                    value={formData.originLocationCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        originLocationCode: e.target.value
                          .toUpperCase()
                          .slice(0, 3),
                      }))
                    }
                    placeholder="GRU"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="destinationLocationCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Destino (Código IATA, ex: JFK)
                  </label>
                  <input
                    type="text"
                    id="destinationLocationCode"
                    name="destinationLocationCode"
                    value={formData.destinationLocationCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        destinationLocationCode: e.target.value
                          .toUpperCase()
                          .slice(0, 3),
                      }))
                    }
                    placeholder="JFK"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="departureDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data de Partida
                  </label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="returnDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data de Volta (opcional)
                  </label>
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="adults"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Número de Adultos
                  </label>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    value={formData.adults}
                    onChange={handleInputChange}
                    min="1"
                    max="9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Buscando..." : "Buscar Voos"}
              </button>
            </form>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {/* Lista de voos */}
          {flights.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Voos Encontrados ({flights.length})
              </h2>
              <div className="space-y-4">
                {flights.map((flight) => (
                  <div
                    key={flight.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedFlight(flight)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="text-lg font-medium text-gray-800">
                          {
                            flight.itineraries[0]?.segments[0]?.departure
                              .iataCode
                          }{" "}
                          →{" "}
                          {
                            flight.itineraries[0]?.segments[
                              flight.itineraries[0].segments.length - 1
                            ]?.arrival.iataCode
                          }
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Partida:{" "}
                          {new Date(
                            flight.itineraries[0]?.segments[0]?.departure.at
                          ).toLocaleString("pt-BR")}
                        </div>
                        <div className="text-sm text-gray-600">
                          Chegada:{" "}
                          {new Date(
                            flight.itineraries[0]?.segments[
                              flight.itineraries[0].segments.length - 1
                            ]?.arrival.at
                          ).toLocaleString("pt-BR")}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {flight.price.currency} {flight.price.total}
                        </div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Área de reserva */}
          {selectedFlight && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Confirmar Reserva
              </h3>
              <p>
                {selectedFlight.itineraries[0]?.segments[0]?.departure.iataCode}{" "}
                →{" "}
                {
                  selectedFlight.itineraries[0]?.segments[
                    selectedFlight.itineraries[0].segments.length - 1
                  ]?.arrival.iataCode
                }
              </p>
              <p>
                Partida:{" "}
                {new Date(
                  selectedFlight.itineraries[0]?.segments[0]?.departure.at
                ).toLocaleString("pt-BR")}
              </p>
              <p>
                Chegada:{" "}
                {new Date(
                  selectedFlight.itineraries[0]?.segments[
                    selectedFlight.itineraries[0].segments.length - 1
                  ]?.arrival.at
                ).toLocaleString("pt-BR")}
              </p>
              <p className="font-bold text-green-600">
                {selectedFlight.price.currency} {selectedFlight.price.total}
              </p>
              <button
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => setShowPayment(true)}
              >
                Reservar Voo
              </button>

              {reservationSuccess && (
                <p className="text-green-600 mt-2">{reservationSuccess}</p>
              )}
            </div>
          )}
          {/* Modal de pagamento */}
          {isClient && showPayment && selectedFlight && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Dados do Cartão de Crédito
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Total a pagar: {selectedFlight.price.currency}{" "}
                  {selectedFlight.price.total}
                </p>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="card-number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      id="card-number"
                      name="card-number"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="card-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      id="card-name"
                      name="card-name"
                      placeholder="Nome Completo"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="w-1/2">
                      <label
                        htmlFor="expiry-date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        id="expiry-date"
                        name="expiry-date"
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="XXX"
                        value={cvv}
                        onChange={handleCvvChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </form>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={() => setShowPayment(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={async () => {
                      if (
                        cardNumber.replace(/\s/g, "").length !== 16 ||
                        expiryDate.length !== 5 ||
                        cvv.length < 3 ||
                        cardName.trim() === ""
                      ) {
                        return alert(
                          "Por favor, preencha todos os campos corretamente."
                        );
                      }
                      try {
                        const res = await fetch("/api/reserve-flight", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            flightId: selectedFlight.id,
                            userEmail: localStorage.getItem("userEmail"),
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok)
                          throw new Error(data.error || "Erro ao reservar voo");
                        setShowPayment(false);
                        setShowConfirmation(true);
                      } catch (err) {
                        alert(
                          err instanceof Error
                            ? err.message
                            : "Erro desconhecido"
                        );
                      }
                    }}
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Confirmação de Reserva */}
          {isClient && showConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 shadow-lg text-center">
                <h3 className="text-xl font-semibold text-green-600 mb-4">
                  Reserva Confirmada!
                </h3>
                <p className="mb-6">Seu voo foi reservado com sucesso.</p>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => {
                    // Navega para a página de reservas e fecha o modal
                    window.location.href = "/my-reservations";
                    setShowConfirmation(false);
                  }}
                >
                  Ver Reserva
                </button>
              </div>
            </div>
          )}
          {!loading && flights.length === 0 && !error && (
            <div className="text-center text-gray-500 mt-8">
              Preencha o formulário acima para buscar voos
            </div>
          )}
        </div>
      </div>
    </>
  );
}
