"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true"
    const name = localStorage.getItem("userName") || ""
    setIsLoggedIn(logged)
    setUserName(name)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
    setUserName("")
    window.location.href = "/login" // redireciona para login
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
      <div className="font-bold text-lg">TravelApp</div>
      <ul className="flex gap-6 items-center">
        {isLoggedIn ? (
          <>
            <li>
              <Link href="/profile" className="hover:underline">
                Olá, {userName}
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </li>
        )}
        <li>
          <Link href="/" className="hover:underline">
            Voos
          </Link>
        </li>
        <li>
          <Link href="/search-hotels" className="hover:underline">
            Hotéis
          </Link>
        </li>
        <li>
          <Link href="/carros" className="hover:underline">
            Carros
          </Link>
        </li>
        <li>
          <Link href="/my-reservations" className="hover:underline">
            Minhas Reservas
          </Link>
        </li>
      </ul>
    </nav>
  )
}
