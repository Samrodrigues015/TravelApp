"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Reservation {
  id: string;
  flightId: string;
  userEmail: string;
  createdAt?: string;
  flightDetails?: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    airline: string;
    flightNumber: string;
  };
  // ... outros campos se necessário
}

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    if (!email) {
      setError("Você precisa estar logado para ver suas reservas.");
      setLoading(false);
      return;
    }

    const fetchReservations = async () => {
      try {
        const res = await fetch(`/api/get-reservations?email=${email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao buscar reservas");

        setReservations(data.reservations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;

    try {
      const res = await fetch("/api/cancel-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reservationId: id }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro ao cancelar");

      setReservations((prev) => prev.filter((r) => r.id !== id));
      alert(data.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Minhas Reservas
          </h1>

          {loading && <p>Carregando reservas...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && reservations.length === 0 && !error && (
            <p className="text-gray-600">Você ainda não possui reservas.</p>
          )}

          {/* Seção de Reservas de Voo */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-semibold text-[#503459]">
              Reservas de Voos
            </h2>
            {reservations.filter((res) => res.flightId).length === 0 && (
              <p className="text-gray-500">Nenhum voo reservado.</p>
            )}
            {reservations
              .filter((res) => res.flightId)
              .map((res) => (
                <div
                  key={res.id}
                  className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {res.flightDetails
                        ? `Voo ${res.flightDetails.flightNumber} - ${res.flightDetails.airline}`
                        : `Reserva de Voo`}
                    </p>
                    {res.flightDetails && (
                      <>
                        <p className="text-sm text-gray-600">
                          <strong>Origem:</strong> {res.flightDetails.origin}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Destino:</strong>{" "}
                          {res.flightDetails.destination}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Companhia:</strong>{" "}
                          {res.flightDetails.airline}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Número do Voo:</strong>{" "}
                          {res.flightDetails.flightNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Partida:</strong>{" "}
                          {new Date(
                            res.flightDetails.departureTime
                          ).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Chegada:</strong>{" "}
                          {new Date(
                            res.flightDetails.arrivalTime
                          ).toLocaleString()}
                        </p>
                      </>
                    )}
                    <p className="text-xs text-gray-400">
                      Reservado em:{" "}
                      {new Date(
                        res.createdAt || res.reservationDate
                      ).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="px-4 py-2 bg-[#6a4f72] text-white rounded hover:bg-[#6a4f72]"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
          </div>

          {/* Seção de Reservas de Hotéis */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#503459]">
              Reservas de Hotéis
            </h2>
            {reservations.filter((res) => res.type === "hotel").length ===
              0 && <p className="text-gray-500">Nenhum hotel reservado.</p>}
            {reservations
              .filter((res) => res.type === "hotel")
              .map((res) => (
                <div
                  key={res.id}
                  className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">Reserva #{res.id}</p>
                    <p className="text-sm text-gray-700">
                      Hotel: {res.hotelDetails?.hotel_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Preço: {res.hotelDetails?.currency}{" "}
                      {res.hotelDetails?.nightly_price} / noite
                    </p>
                    {res.hotelDetails?.image_list?.[0] && (
                      <img
                        src={res.hotelDetails.image_list[0]}
                        alt={res.hotelDetails.hotel_name}
                        className="h-20 w-20 object-cover rounded mt-2"
                      />
                    )}
                    <p className="text-xs text-gray-400">
                      Data: {new Date(res.reservationDate).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCancel(res.id)}
                    className="px-4 py-2 bg-[#6a4f72] text-white rounded hover:bg-[#6a4f72]"
                  >
                    Cancelar
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Seção de Reservas de Carros */}
        <div className="max-w-3xl mx-auto px-4 mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-[#503459] text-start">
            Reservas de Carros
          </h2>

          {reservations.filter((res) => res.type === "car").length === 0 && (
            <p className="text-gray-500 text-center">Nenhum carro reservado.</p>
          )}

          {reservations
            .filter((res) => res.type === "car")
            .map((res) => (
              <div
                key={res.id}
                className="p-4 bg-white rounded-lg shadow flex flex-col md:flex-row justify-between items-center"
              >
                <div className="flex flex-col md:flex-row items-center gap-4">
                  {res.carDetails?.image ? (
                    <img
                      src={res.carDetails.image}
                      alt={res.carDetails.name}
                      className="h-20 w-28 object-cover rounded"
                    />
                  ) : (
                    <div className="h-20 w-28 flex items-center justify-center bg-gray-200 rounded text-gray-500">
                      Sem imagem
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <p className="font-medium">Reserva #{res.id}</p>
                    <p className="text-sm text-gray-700">
                      Carro: {res.carDetails?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Preço: {res.carDetails?.price} / dia
                    </p>
                    <p className="text-xs text-gray-400">
                      Data: {new Date(res.reservationDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleCancel(res.id)}
                  className="mt-2 md:mt-0 px-4 py-2 bg-[#6a4f72] text-white rounded hover:bg-[#6a4f72]"
                >
                  Cancelar
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
