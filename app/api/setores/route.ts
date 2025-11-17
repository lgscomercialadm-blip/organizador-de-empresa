import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar todos os setores do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const setores = await prisma.setor.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(setores)
  } catch (error) {
    console.error("Erro ao buscar setores:", error)
    return NextResponse.json(
      { error: "Erro ao buscar setores" },
      { status: 500 }
    )
  }
}

// POST - Criar novo setor
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { nome, descricao, cor } = await req.json()

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const setor = await prisma.setor.create({
      data: {
        nome,
        descricao: descricao || null,
        cor: cor || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(setor, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar setor:", error)
    return NextResponse.json(
      { error: "Erro ao criar setor" },
      { status: 500 }
    )
  }
}
