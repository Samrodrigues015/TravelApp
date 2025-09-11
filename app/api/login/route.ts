import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const usersFile = path.join(process.cwd(), "app", "data", "users.json")

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 })
  }

  // Carrega usuários existentes
  const usersRaw = await fs.readFile(usersFile, "utf-8")
  const users = JSON.parse(usersRaw)

  // Busca usuário pelo email e senha
  const user = users.find((u: any) => u.email === email && u.password === password)

  if (!user) {
    return NextResponse.json({ error: "Email ou senha inválidos." }, { status: 401 })
  }

  // Retorna dados do usuário (sem a senha)
  const { password: _, ...userData } = user
  return NextResponse.json({ success: true, user: userData })
}