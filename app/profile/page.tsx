"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn || !email) {
      router.push("/login");
      return;
    }

    setUserName(name || "");
    setUserEmail(email);
    setEditName(name || "");
  }, [router]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    if (editName.trim() === "") {
      setError("O nome não pode ser vazio.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          newName: editName,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao atualizar o perfil.");

      setUserName(editName);
      localStorage.setItem("userName", editName);
      setIsEditing(false);
      setMessage("Perfil atualizado com sucesso!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const handleChangePassword = async () => {
    setPasswordLoading(true);
    setPasswordMessage("");
    setError("");

    if (!oldPassword || !newPassword) {
      setPasswordMessage("Preencha todos os campos.");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("A nova senha deve ter no mínimo 6 caracteres.");
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao alterar senha");

      setPasswordMessage("Senha alterada com sucesso!");
      setOldPassword("");
      setNewPassword("");
      setShowChangePassword(false);
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Meu Perfil</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {/* Perfil */}
          <div className="bg-white p-6 rounded shadow-md mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold">{userName}</p>
                <p className="text-gray-500">{userEmail}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="bg-[#6a4f72] text-white px-4 py-2 rounded hover:bg-[#81638b] disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(userName);
                    }}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#81638b] text-white px-4 py-2 rounded hover:bg-[#6a4f72]"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="bg-[#6a4f72] text-white px-4 py-2 rounded hover:bg-[#81638b]"
                >
                  Alterar Senha
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Alterar Senha */}
          {showChangePassword && (
            <div className="bg-white p-6 rounded shadow-md mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Alterar Senha</h2>
              {passwordMessage && (
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded mb-4">{passwordMessage}</div>
              )}
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Senha atual"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={passwordLoading}
                    className="bg-[#6a4f72] text-white px-4 py-2 rounded hover:bg-[#81638b] disabled:opacity-50"
                  >
                    {passwordLoading ? "Alterando..." : "Alterar Senha"}
                  </button>
                  <button
                    onClick={() => setShowChangePassword(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
