"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  location?: string;
  model?: string;
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Campos do cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Estados do formulário de pesquisa
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [carModel, setCarModel] = useState("");

  const [showPayment, setShowPayment] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

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
        location: "São Paulo",
        model: "Hatch",
      },
      {
        id: "car2",
        name: "BMW X5",
        price: 120,
        image:
          "https://tse2.mm.bing.net/th/id/OIP.CAz3G-PdA_E3IfUs3PxdFgHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "SUV de luxo para viagens confortáveis.",
        location: "Rio de Janeiro",
        model: "SUV",
      },
      {
        id: "car3",
        name: "Tesla Model 3",
        price: 150,
        image:
          "https://th.bing.com/th/id/R.92fcbac9c884704e9b46cfe684cd0750?rik=enmnAfZpY5q3pg&pid=ImgRaw&r=0",
        description: "100% elétrico, tecnologia de ponta e autonomia incrível.",
        location: "São Paulo",
        model: "Sedan",
      },
      {
        id: "car4",
        name: "Volkswagen T-Cross",
        price: 80,
        image:
          "https://www.targetmotori.com/wp-content/uploads/2022/08/volkswagen-t-cross-1-5-tsi-dsg-770x433.jpg",
        description: "SUV compacto, ótimo para família.",
        location: "Curitiba",
        model: "SUV",
      },
      {
        id: "car5",
        name: "Chevrolet Onix",
        price: 55,
        image:
          "https://1.bp.blogspot.com/-Ux5i-d7TbDI/XXxV1Ej24eI/AAAAAAAAW8k/0nwB6sUkDIsfCtJ8RtA6cUduYYH_R6YXgCLcBGAsYHQ/s640/Novo%2BOnix%2BPremier%2B%25281%2529.jpg",
        description: "Econômico, confortável e moderno.",
        location: "Belo Horizonte",
        model: "Hatch",
      },
      {
        id: "car6",
        name: "Renault Kwid",
        price: 40,
        image:
          "https://mlqt0se4pk9p.i.optimole.com/q:85/https://www.autodata.com.br/wordpress/wp-content/uploads//2023/10/renault-kwid.jpg",
        description: "Compacto, ideal para o dia a dia.",
        location: "Recife",
        model: "Hatch",
      },
      {
        id: "car7",
        name: "Toyota Corolla",
        price: 90,
        image:
          "https://images.prismic.io/carwow/c011a8a8-d805-4b88-b6c6-d40fbffbb6f0_2023+RHD+Toyota+Corolla+Front+3Q+Driving+01.jpg",
        description: "Sedan confortável e seguro.",
        location: "São Paulo",
        model: "Sedan",
      },
      {
        id: "car8",
        name: "Jeep Compass",
        price: 110,
        image:
          "https://tse1.mm.bing.net/th/id/OIP.fqkDdIjU0cLcLvOCSMmcdAHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "SUV robusto para qualquer terreno.",
        location: "Brasília",
        model: "SUV",
      },
      // Novos carros para Porto e Lisboa
      {
        id: "car9",
        name: "Peugeot 208",
        price: 60,
        image:
          "https://th.bing.com/th/id/R.70661134e9a595b07dfd3557672f9cd4?rik=tKbuH0MBH4OgYA&pid=ImgRaw&r=0",
        description: "Hatch moderno, ótimo para cidades europeias.",
        location: "Porto",
        model: "Hatch",
      },
      {
        id: "car10",
        name: "Mercedes-Benz Classe C",
        price: 140,
        image:
          "https://th.bing.com/th/id/R.6f72e9bd4aa28de07ba57d1dc15df53b?rik=ywacda5FAfoFVA&pid=ImgRaw&r=0",
        description: "Sedan premium, conforto e luxo.",
        location: "Lisboa",
        model: "Sedan",
      },
      {
        id: "car11",
        name: "Renault Captur",
        price: 75,
        image:
          "https://tse1.mm.bing.net/th/id/OIP.-a-JEY5WJzr0epdCtyaUWwHaEL?rs=1&pid=ImgDetMain&o=7&rm=3",
        description: "SUV compacto, ótimo para viagens em família.",
        location: "Porto",
        model: "SUV",
      },
      {
        id: "car12",
        name: "Volkswagen Golf",
        price: 65,
        image:
          "https://live.staticflickr.com/65535/49813579102_1b783355ca_o.jpg",
        description: "Hatch referência em conforto e tecnologia.",
        location: "Lisboa",
        model: "Hatch",
      },
    ];

    setCars(carsData);
    setFilteredCars(carsData);
    setLoading(false);
  }, []);

  // Função de pesquisa
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let results = cars;

    if (pickupLocation.trim()) {
      results = results.filter((car) =>
        car.location
          ?.toLowerCase()
          .includes(pickupLocation.trim().toLowerCase())
      );
    }
    if (carModel.trim()) {
      results = results.filter((car) =>
        car.model?.toLowerCase().includes(carModel.trim().toLowerCase())
      );
    }
    // Não filtre por data, pois não há disponibilidade por data nos dados

    setFilteredCars(results);
  };

  // Se o usuário limpar todos os campos, mostra todos os carros
  useEffect(() => {
    if (!pickupLocation && !carModel && !pickupDate && !returnDate) {
      setFilteredCars(cars);
    }
  }, [pickupLocation, carModel, pickupDate, returnDate, cars]);

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
    if (numbers.length >= 3)
      return numbers.slice(0, 2) + "/" + numbers.slice(2);
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
          <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Aluguel de Carros
          </h1>

          {/* Formulário de pesquisa de carros */}
          <form
            className="bg-white rounded-lg shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4"
            onSubmit={handleSearch}
          >
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Local de Retirada
              </label>
              <input
                type="text"
                placeholder="Cidade ou aeroporto"
                className="px-3 py-2 border border-gray-300 rounded w-full"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Retirada
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded w-full"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Devolução
              </label>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded w-full"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modelo do Carro
              </label>
              <input
                type="text"
                placeholder="Ex: SUV, Sedan, Hatch"
                className="px-3 py-2 border border-gray-300 rounded w-full"
                value={carModel}
                onChange={(e) => setCarModel(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#6a4f72] text-white px-6 py-2 rounded hover:bg-[#81638b] w-full md:w-auto"
              style={{ alignSelf: "end" }}
            >
              Pesquisar
            </button>
          </form>

          {loading && <p>Carregando carros...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.length === 0 && !loading && (
              <div className="col-span-full text-center text-gray-500">
                Nenhum carro encontrado para os critérios informados.
              </div>
            )}
            {filteredCars.map((car) => (
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
                <p className="text-[#503459] font-bold text-lg mb-4">
                  € {car.price}/dia
                </p>
                <button
                  onClick={() => handleReserveCar(car)}
                  className="mt-auto bg-[#6a4f72] hover:bg-[#6a4f72] text-white py-2 rounded-lg"
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
                className="px-4 py-2 bg-[#81638b] text-white rounded hover:bg-[#81638b]"
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
            <h3 className="text-xl font-semibold text-[#503459] mb-4">
              Reserva Confirmada!
            </h3>
            <p className="mb-6">Seu carro foi reservado com sucesso.</p>
            <button
              className="px-6 py-2 bg-[#81638b] text-white rounded hover:bg-[#81638b]"
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
