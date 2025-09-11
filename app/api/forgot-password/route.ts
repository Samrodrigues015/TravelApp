import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const USERS_FILE = path.join(process.cwd(), "app/data/users.json"); // Certifique-se de que o caminho está correto

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    let users: any[] = [];
    if (fs.existsSync(USERS_FILE)) {
      users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
    }

    const user = users.find((u: any) => u.email === email);

    // Se o usuário existir, crie o link e retorne-o
    if (user) {
      const resetToken = user.email.split("@")[0] + "reset_token";
      const redirectLink = `http://localhost:3000/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;
      
      console.log(`Link de redirecionamento gerado: ${redirectLink}`); // Para depuração
      
      // Retorne o link no corpo da resposta
      return NextResponse.json({ 
        message: "Redirecionando para a página de redefinição...",
        redirectLink
      });
    }

    // Se o usuário não for encontrado, envie uma mensagem genérica por segurança
    return NextResponse.json({ message: "Se as informações estiverem corretas, você será redirecionado em instantes." });

  } catch (err) {
    console.error("Erro na API de forgot-password:", err);
    return NextResponse.json({ error: "Erro ao processar a solicitação" }, { status: 500 });
  }
}