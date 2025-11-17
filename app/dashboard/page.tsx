import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./dashboard-client"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Buscar dados do usuário
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      setores: true,
      membrosEquipe: true,
      canaisVenda: true,
      tarefas: {
        include: {
          setor: true,
          responsavel: true,
          alertas: true,
        },
        orderBy: {
          dataVencimento: "asc",
        },
      },
      alertas: {
        include: {
          tarefa: {
            include: {
              setor: true,
              responsavel: true,
            },
          },
        },
        where: {
          visualizado: false,
        },
        orderBy: {
          dataAlerta: "asc",
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  // Pegar tarefas de hoje
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)

  const tarefasHoje = user.tarefas.filter((tarefa) => {
    const dataVencimento = new Date(tarefa.dataVencimento)
    dataVencimento.setHours(0, 0, 0, 0)
    return dataVencimento >= hoje && dataVencimento < amanha && !tarefa.concluida
  })

  return (
    <DashboardClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
      }}
      setores={user.setores}
      membrosEquipe={user.membrosEquipe}
      canaisVenda={user.canaisVenda}
      tarefas={user.tarefas}
      tarefasHoje={tarefasHoje}
      alertas={user.alertas}
    />
  )
}
