"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Campos do cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);

    const carsData: Car[] = [
      {
        id: "car1",
        name: "Fiat 500",
        price: 45,
        image:
          "https://car-images.bauersecure.com/wp-images/12903/fiat500_100.jpg",
        description: "Compacto, econômico e perfeito para a cidade.",
      },
      {
        id: "car2",
        name: "BMW X5",
        price: 120,
        image:
          "https://tse2.mm.bing.net/th/id/OIP.CAz3G-PdA_E3IfUs3PxdFgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "SUV de luxo para viagens confortáveis.",
      },
      {
        id: "car3",
        name: "Tesla Model 3",
        price: 150,
        image:
          "https://th.bing.com/th/id/R.92fcbac9c884704e9b46cfe684cd0750?rik=enmnAfZpY5q3pg&pid=ImgRaw&r=0",
        description: "100% elétrico, tecnologia de ponta e autonomia incrível.",
      },
    ];

    setCars(carsData);
    setLoading(false);
  }, []);

  const handleReserveCar = (car: Car) => {
    if (!userEmail) {
      alert("Você precisa estar logado para reservar um carro.");
      return;
    }
    setSelectedCar(car);
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedCar || !userEmail) return;

    try {
      const res = await fetch("/api/reserve-car", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: selectedCar.id,
          userEmail,
          carDetails: {
            name: selectedCar.name,
            price: selectedCar.price,
            image: selectedCar.image,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao reservar carro");

      // Limpa os campos e mostra confirmação
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
      setShowPayment(false);
      setShowConfirmation(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  // FORMATADORES DOS CAMPOS
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 16);
    return numbers.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 4);
    if (numbers.length >= 3) return numbers.slice(0, 2) + "/" + numbers.slice(2);
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-zÀ-ÿ\s]/g, ""); // só letras e espaços
    setCardName(value.slice(0, 50));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(numbers);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center">
            🚗 Aluguel de Carros
          </h1>

          {loading && <p>Carregando carros...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-40 w-full object-cover rounded-xl mb-4"
                />
                <h2 className="text-lg font-semibold">{car.name}</h2>
                <p className="text-gray-600 text-sm mb-2">{car.description}</p>
                <p className="text-green-600 font-bold text-lg mb-4">
                  € {car.price}/dia
                </p>
                <button
                  onClick={() => handleReserveCar(car)}
                  className="mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Reservar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPayment && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Dados do Cartão de Crédito
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Total a pagar: € {selectedCar.price} / dia
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número do Cartão
                </label>
                <input
                  type="text"
                  placeholder="XXXX XXXX XXXX XXXX"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome no Cartão
                </label>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={cardName}
                  onChange={handleCardNameChange}
                  maxLength={50}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    Validade (MM/AA)
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="XXX"
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </form>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowPayment(false);
                  setSelectedCar(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleConfirmPayment}
              >
                Confirmar Pagamento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              Reserva Confirmada!
            </h3>
            <p className="mb-6">Seu carro foi reservado com sucesso.</p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => (window.location.href = "/my-reservations")}
            >
              Ver Reserva
            </button>
          </div>
        </div>
      )}
    </>
  );
}
