"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

interface HotelOffer {
  id: string;
  hotel_name: string;
  description: string;
  nightly_price: string;
  currency: string;
  review_rating_float: number;
  image_list: string[];
}

interface SearchFormData {
  query: string;
  checkInDate: string;
  checkOutDate: string;
}

export default function SearchHotelsPage() {
  const [formData, setFormData] = useState<SearchFormData>({
    query: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Estados para o formulário de pagamento
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHotels([]);
    setSelectedHotel(null);
    setShowPayment(false);
    setShowConfirmation(false);

    try {
      const response = await fetch("/api/search-hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar hotéis");
      }

      setHotels(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formattedValue = value.replace(/^(\d{2})/, "$1/");
    setExpiryDate(formattedValue);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(value);
  };

  const handleReserveHotel = async () => {
    if (!selectedHotel) return;
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      alert("Você precisa estar logado para fazer uma reserva.");
      return;
    }
    
    if (cardNumber.replace(/\s/g, "").length !== 16 || expiryDate.length !== 5 || cvv.length < 3 || cardName.trim() === "") {
        return alert("Por favor, preencha todos os campos do cartão corretamente.");
    }

    try {
      const res = await fetch("/api/reserve-hotel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          userEmail: userEmail,
          hotelDetails: selectedHotel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao reservar o hotel.");
      }

      setShowPayment(false);
      setSelectedHotel(null);
      setShowConfirmation(true);

    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro desconhecido ao reservar.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Buscar Hotéis
          </h1>
          {/* Formulário de busca */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="query"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Destino ou Nome do Hotel (ex: Paris)
                </label>
                <input
                  type="text"
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleInputChange}
                  placeholder="Paris, Torre Eiffel, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="checkInDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data de Check-in
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="checkOutDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Data de Check-out
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
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
                {loading ? "Buscando..." : "Buscar Hotéis"}
              </button>
            </form>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {/* Lista de hotéis */}
          {hotels.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Hotéis Encontrados ({hotels.length})
              </h2>
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex flex-col md:flex-row border border-gray-200 rounded-lg p-4 gap-4"
                  >
                    <div className="md:flex-shrink-0">
                      <img
                        src={hotel.image_list[0]}
                        alt={hotel.hotel_name}
                        className="h-32 w-full md:w-32 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-gray-800">
                        {hotel.hotel_name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {hotel.description}
                      </p>
                      <div className="mt-2 text-yellow-500">
                        Avaliação: {hotel.review_rating_float} / 5
                      </div>
                      <div className="mt-4 text-2xl font-bold text-green-600">
                        {hotel.currency} {hotel.nightly_price}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          / noite
                        </span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setShowPayment(true);
                        }}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Reservar Hotel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modal de Pagamento */}
      {isClient && showPayment && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Dados do Cartão de Crédito
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Total a pagar: {selectedHotel.currency} {selectedHotel.nightly_price} / noite
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
                onClick={() => {
                  setShowPayment(false);
                  setSelectedHotel(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleReserveHotel}
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
            <p className="mb-6">Seu hotel foi reservado com sucesso.</p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => {
                setShowConfirmation(false);
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}