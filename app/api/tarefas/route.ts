import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar todas as tarefas
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const tarefas = await prisma.tarefa.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        setor: true,
        responsavel: true,
        alertas: true,
      },
      orderBy: {
        dataVencimento: "asc",
      },
    })

    return NextResponse.json(tarefas)
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar tarefas" },
      { status: 500 }
    )
  }
}

// POST - Criar nova tarefa
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const {
      titulo,
      descricao,
      dataVencimento,
      recorrente,
      tipoRecorrencia,
      diaDoMes,
      diaDaSemana,
      setorId,
      responsavelId,
      diasAntecedenciaAlerta,
    } = await req.json()

    if (!titulo || !dataVencimento) {
      return NextResponse.json(
        { error: "Título e data de vencimento são obrigatórios" },
        { status: 400 }
      )
    }

    // Criar tarefa
    const tarefa = await prisma.tarefa.create({
      data: {
        titulo,
        descricao: descricao || null,
        dataVencimento: new Date(dataVencimento),
        recorrente: recorrente || false,
        tipoRecorrencia: tipoRecorrencia || null,
        diaDoMes: diaDoMes || null,
        diaDaSemana: diaDaSemana || null,
        setorId: setorId || null,
        responsavelId: responsavelId || null,
        userId: session.user.id,
      },
      include: {
        setor: true,
        responsavel: true,
      },
    })

    // Criar alerta se foi especificado
    if (diasAntecedenciaAlerta && diasAntecedenciaAlerta > 0) {
      const dataAlerta = new Date(dataVencimento)
      dataAlerta.setDate(dataAlerta.getDate() - diasAntecedenciaAlerta)

      await prisma.alerta.create({
        data: {
          tarefaId: tarefa.id,
          diasAntecedencia: diasAntecedenciaAlerta,
          dataAlerta,
          userId: session.user.id,
        },
      })
    }

    return NextResponse.json(tarefa, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    return NextResponse.json(
      { error: "Erro ao criar tarefa" },
      { status: 500 }
    )
  }
}
