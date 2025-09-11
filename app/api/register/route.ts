import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const usersFile = path.join(process.cwd(), "app", "data", "users.json")

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios." }, { status: 400 })
  }

  try {
    // Carrega usuários existentes
    const usersRaw = await fs.readFile(usersFile, "utf-8")
    const users = JSON.parse(usersRaw)

    // Verifica se o email já existe
    const existingUser = users.find((u: any) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "Usuário já existe." }, { status: 400 })
    }

    // Cria novo usuário
    const newUser = { email, password }
    users.push(newUser)

    // Salva no arquivo JSON
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf-8")

    return NextResponse.json({ success: true, message: "Usuário criado com sucesso!" }, { status: 201 })
  } catch (err) {
    console.error("Erro ao registrar usuário:", err)
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 })
  }
}
