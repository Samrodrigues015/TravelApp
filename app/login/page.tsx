"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Digite um email válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao fazer login");
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name || email.split("@")[0]);

      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordMessage("");
    if (!forgotPasswordEmail.includes("@")) {
      setForgotPasswordMessage("Por favor, digite um email válido.");
      return;
    }

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Erro ao solicitar recuperação de senha."
        );
      }

      // Verifique se o link de redirecionamento foi retornado pela API
      if (data.redirectLink) {
        // Redirecione o usuário imediatamente para a página de redefinição
        window.location.href = data.redirectLink;
      } else {
        setForgotPasswordMessage(
          data.message ||
            "Se as informações estiverem corretas, você receberá um email com instruções para redefinir sua senha."
        );
      }

      setForgotPasswordEmail("");
    } catch (err) {
      setForgotPasswordMessage(
        err instanceof Error ? err.message : "Erro desconhecido."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {error && (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#6a4f72] text-white py-2 rounded hover:bg-[#6a4f72] mb-4"
          >
            Entrar
          </button>

          <p className="text-sm text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-[#6a4f72] font-semibold hover:underline">
              Criar conta
            </Link>
          </p>

          <p className="text-sm text-center text-gray-600 mt-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPasswordModal(true);
              }}
              className="text-[#6a4f72] font-semibold hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </p>
        </form>

        {/* Modal de Recuperação de Senha */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
              <h3 className="text-xl font-bold mb-4 text-center">
                Recuperar Senha
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Digite o email associado à sua conta.
              </p>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="seu-email@exemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              />
              {forgotPasswordMessage && (
                <div className="text-green-600 text-sm mb-4 text-center">
                  {forgotPasswordMessage}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleForgotPassword}
                  className="px-4 py-2 bg-[#6a4f72] text-white rounded hover:[#6a4f72]"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
