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

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar o perfil.");
      }

      // Atualiza os dados no estado e no localStorage
      setUserName(editName);
      localStorage.setItem("userName", editName);

      setIsEditing(false); // Sai do modo de edição
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Meu Perfil</h1>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}

          <div className="bg-white p-6 rounded shadow-md">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-1">Nome:</label>
                  <input
                    type="text"
                    id="editName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
                  <input
                    type="email"
                    id="userEmail"
                    value={userEmail}
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                    readOnly
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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
              <div className="space-y-4">
                <p><strong>Nome:</strong> {userName}</p>
                <p><strong>Email:</strong> {userEmail}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#81638b] text-white px-4 py-2 rounded hover:bg-[#6a4f72]"
                  >
                    Editar Perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-[#81638b] text-white px-4 py-2 rounded hover:bg-[#6a4f72]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}