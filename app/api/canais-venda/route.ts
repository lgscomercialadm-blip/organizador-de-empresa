import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar todos os canais de venda
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const canais = await prisma.canalVenda.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        nome: "asc",
      },
    })

    return NextResponse.json(canais)
  } catch (error) {
    console.error("Erro ao buscar canais:", error)
    return NextResponse.json(
      { error: "Erro ao buscar canais" },
      { status: 500 }
    )
  }
}

// POST - Criar novo canal de venda
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { nome, descricao, diaFechamento } = await req.json()

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      )
    }

    const canal = await prisma.canalVenda.create({
      data: {
        nome,
        descricao: descricao || null,
        diaFechamento: diaFechamento || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(canal, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar canal:", error)
    return NextResponse.json(
      { error: "Erro ao criar canal" },
      { status: 500 }
    )
  }
}
