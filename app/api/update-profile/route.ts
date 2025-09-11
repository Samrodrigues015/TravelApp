import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "app/data/users.json");

export async function POST(req: NextRequest) {
  try {
    const { email, newName } = await req.json();

    if (!email || !newName) {
      return NextResponse.json({ error: "Email e novo nome são obrigatórios" }, { status: 400 });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    
    // Atualiza o nome do usuário no array
    users[userIndex].name = newName; 

    // Salva as mudanças no arquivo
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "Perfil atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}