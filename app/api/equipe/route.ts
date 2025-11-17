import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar todos os membros da equipe
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const membros = await prisma.membroEquipe.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(membros)
  } catch (error) {
    console.error("Erro ao buscar membros:", error)
    return NextResponse.json(
      { error: "Erro ao buscar membros" },
      { status: 500 }
    )
  }
}

// POST - Adicionar novo membro
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { nome, email, cargo } = await req.json()

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const membro = await prisma.membroEquipe.create({
      data: {
        nome,
        email: email || null,
        cargo: cargo || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(membro, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar membro:", error)
    return NextResponse.json(
      { error: "Erro ao criar membro" },
      { status: 500 }
    )
  }
}
