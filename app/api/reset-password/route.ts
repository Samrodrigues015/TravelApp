import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "app/data/users.json");

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, token } = await req.json();

    if (!email || !newPassword || !token) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const user = users[userIndex];
    const expectedToken = user.email.split("@")[0] + "reset_token"; // Re-cria o token de teste

    if (token !== expectedToken) {
      return NextResponse.json({ error: "Token de redefinição inválido" }, { status: 400 });
    }
    
    // Atualiza a senha (em um ambiente real, use uma biblioteca de hash como 'bcrypt')
    user.password = newPassword; 

    // Salva as mudanças no arquivo
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "Senha redefinida com sucesso!" });
  } catch (err) {
    return NextResponse.json({ error: "Erro ao redefinir a senha" }, { status: 500 });
  }
}