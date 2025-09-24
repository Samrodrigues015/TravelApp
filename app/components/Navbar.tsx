"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    const name = localStorage.getItem("userName") || "";
    setIsLoggedIn(logged);
    setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserName("");
    window.location.href = "/login"; // redireciona para login
  };

  return (
    <nav className="bg-[#503459] text-white px-6 py-3 flex items-center justify-between relative">
      <div className="font-bold text-lg">TravelApp</div>

      {/* Botão do menu hamburguer - visível em mobile */}
      <button
        className="md:hidden flex items-center"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          // Ícone X
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Ícone Hambúrguer
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Menu principal */}
      <ul
        className={`flex-col md:flex-row md:flex gap-6 items-start absolute md:static top-full left-0 w-full md:w-auto bg-[#503459] md:bg-transparent transition-all duration-300 overflow-hidden ${
          menuOpen ? "flex py-4" : "h-0 md:h-auto"
        }`}
      >
        {isLoggedIn ? (
          <>
            <li className="px-6 py-2 md:p-0 text-center">
              <Link href="/profile" className="hover:underline">
                Olá, {userName}
              </Link>
            </li>
            <li className="px-6 py-2 md:p-0 text-center">
              <button
                onClick={handleLogout}
                className="bg-[#81638b] px-3 py-1 rounded hover:bg-[#6a4f72]" 
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li className="px-6 py-2 md:p-0 text-center">
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </li>
        )}
        <li className="px-6 py-2 md:p-0 text-center">
          <Link href="/" className="hover:underline">
            Voos
          </Link>
        </li>
        <li className="px-6 py-2 md:p-0 text-center">
          <Link href="/search-hotels" className="hover:underline">
            Hotéis
          </Link>
        </li>
        <li className="px-6 py-2 md:p-0 text-center">
          <Link href="/cars" className="hover:underline">
            Carros
          </Link>
        </li>
        <li className="px-6 py-2 md:p-0 text-center">
          <Link href="/my-reservations" className="hover:underline">
            Minhas Reservas
          </Link>
        </li>
      </ul>
    </nav>
  );
}