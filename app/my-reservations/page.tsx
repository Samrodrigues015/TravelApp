"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Reservation {
  id: string;
  flightId: string;
  userEmail: string;
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

      const data = await res.json(); // agora sempre terá JSON

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

          <div className="space-y-4">
            {reservations.map((res) => (
              <div
                key={res.id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Reserva #{res.id}</p>
                  <p className="text-sm text-gray-600">Voo: {res.flightId}</p>
                </div>
                <button
                  onClick={() => handleCancel(res.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Cancelar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
