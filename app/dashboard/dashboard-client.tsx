"use client"

import { signOut } from "next-auth/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Plus, Calendar, Users, Briefcase, Target, Bell } from "lucide-react"
import { formatDate } from "@/lib/utils"

type User = {
  id: string
  name: string
  email: string
}

type Setor = {
  id: string
  nome: string
  descricao: string | null
  cor: string | null
}

type MembroEquipe = {
  id: string
  nome: string
  email: string | null
  cargo: string | null
}

type CanalVenda = {
  id: string
  nome: string
  descricao: string | null
  diaFechamento: number | null
}

type Tarefa = {
  id: string
  titulo: string
  descricao: string | null
  dataVencimento: Date
  concluida: boolean
  setor: Setor | null
  responsavel: MembroEquipe | null
}

type Alerta = {
  id: string
  dataAlerta: Date
  tarefa: Tarefa
}

type DashboardClientProps = {
  user: User
  setores: Setor[]
  membrosEquipe: MembroEquipe[]
  canaisVenda: CanalVenda[]
  tarefas: Tarefa[]
  tarefasHoje: Tarefa[]
  alertas: Alerta[]
}

export function DashboardClient({
  user,
  setores,
  membrosEquipe,
  canaisVenda,
  tarefas,
  tarefasHoje,
  alertas,
}: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState<string>("dashboard")

  const tarefasPendentes = tarefas.filter((t) => !t.concluida)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Organizador Empresarial
              </h1>
              <p className="text-sm text-gray-600 mt-1">Olá, {user.name}!</p>
            </div>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeSection === "dashboard" ? "default" : "outline"}
            onClick={() => setActiveSection("dashboard")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeSection === "setores" ? "default" : "outline"}
            onClick={() => setActiveSection("setores")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Setores
          </Button>
          <Button
            variant={activeSection === "equipe" ? "default" : "outline"}
            onClick={() => setActiveSection("equipe")}
          >
            <Users className="mr-2 h-4 w-4" />
            Equipe
          </Button>
          <Button
            variant={activeSection === "tarefas" ? "default" : "outline"}
            onClick={() => setActiveSection("tarefas")}
          >
            <Target className="mr-2 h-4 w-4" />
            Tarefas
          </Button>
          <Button
            variant={activeSection === "canais" ? "default" : "outline"}
            onClick={() => setActiveSection("canais")}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            Canais de Venda
          </Button>
        </div>

        {/* Dashboard View */}
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tarefas Hoje
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tarefasHoje.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tarefas Pendentes
                  </CardTitle>
                  <Target className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tarefasPendentes.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Alertas Ativos
                  </CardTitle>
                  <Bell className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alertas.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Setores
                  </CardTitle>
                  <Briefcase className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{setores.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Alertas */}
            {alertas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Alertas e Lembretes</CardTitle>
                  <CardDescription>
                    Tarefas que precisam da sua atenção
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alertas.slice(0, 5).map((alerta) => (
                      <div
                        key={alerta.id}
                        className="flex items-start justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-4"
                      >
                        <div>
                          <p className="font-medium">{alerta.tarefa.titulo}</p>
                          <p className="text-sm text-gray-600">
                            Vencimento: {formatDate(alerta.tarefa.dataVencimento)}
                          </p>
                          {alerta.tarefa.setor && (
                            <p className="text-sm text-gray-600">
                              Setor: {alerta.tarefa.setor.nome}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tarefas de Hoje */}
            <Card>
              <CardHeader>
                <CardTitle>Tarefas de Hoje</CardTitle>
                <CardDescription>
                  {tarefasHoje.length} tarefa(s) para concluir hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tarefasHoje.length === 0 ? (
                  <p className="text-gray-500">Nenhuma tarefa para hoje!</p>
                ) : (
                  <div className="space-y-4">
                    {tarefasHoje.map((tarefa) => (
                      <div
                        key={tarefa.id}
                        className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4"
                      >
                        <div>
                          <p className="font-medium">{tarefa.titulo}</p>
                          {tarefa.descricao && (
                            <p className="text-sm text-gray-600">
                              {tarefa.descricao}
                            </p>
                          )}
                          <div className="mt-2 flex gap-4 text-sm text-gray-500">
                            {tarefa.setor && (
                              <span>Setor: {tarefa.setor.nome}</span>
                            )}
                            {tarefa.responsavel && (
                              <span>
                                Responsável: {tarefa.responsavel.nome}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Setores View */}
        {activeSection === "setores" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Setores</CardTitle>
                  <CardDescription>
                    Gerencie os setores da sua empresa
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Setor
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {setores.length === 0 ? (
                <p className="text-gray-500">
                  Nenhum setor cadastrado ainda. Clique em &quot;Novo Setor&quot; para
                  começar!
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {setores.map((setor) => (
                    <div
                      key={setor.id}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <h3 className="font-semibold">{setor.nome}</h3>
                      {setor.descricao && (
                        <p className="mt-1 text-sm text-gray-600">
                          {setor.descricao}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Equipe View */}
        {activeSection === "equipe" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipe</CardTitle>
                  <CardDescription>
                    Gerencie os membros da sua equipe
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Membro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {membrosEquipe.length === 0 ? (
                <p className="text-gray-500">
                  Nenhum membro cadastrado ainda. Clique em &quot;Novo Membro&quot; para
                  começar!
                </p>
              ) : (
                <div className="space-y-4">
                  {membrosEquipe.map((membro) => (
                    <div
                      key={membro.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <div>
                        <h3 className="font-semibold">{membro.nome}</h3>
                        {membro.cargo && (
                          <p className="text-sm text-gray-600">{membro.cargo}</p>
                        )}
                        {membro.email && (
                          <p className="text-sm text-gray-500">{membro.email}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tarefas View */}
        {activeSection === "tarefas" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Todas as Tarefas</CardTitle>
                  <CardDescription>
                    Gerencie todas as tarefas e obrigações
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Tarefa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tarefas.length === 0 ? (
                <p className="text-gray-500">
                  Nenhuma tarefa cadastrada ainda. Clique em &quot;Nova Tarefa&quot; para
                  começar!
                </p>
              ) : (
                <div className="space-y-4">
                  {tarefas.slice(0, 10).map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className={`flex items-start justify-between rounded-lg border p-4 ${
                        tarefa.concluida
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div>
                        <p className={`font-medium ${tarefa.concluida ? "line-through" : ""}`}>
                          {tarefa.titulo}
                        </p>
                        {tarefa.descricao && (
                          <p className="text-sm text-gray-600">
                            {tarefa.descricao}
                          </p>
                        )}
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                          <span>Vencimento: {formatDate(tarefa.dataVencimento)}</span>
                          {tarefa.setor && (
                            <span>Setor: {tarefa.setor.nome}</span>
                          )}
                          {tarefa.responsavel && (
                            <span>Responsável: {tarefa.responsavel.nome}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Canais de Venda View */}
        {activeSection === "canais" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Canais de Venda</CardTitle>
                  <CardDescription>
                    Gerencie seus canais de venda e fechamentos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Canal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {canaisVenda.length === 0 ? (
                <p className="text-gray-500">
                  Nenhum canal cadastrado ainda. Clique em &quot;Novo Canal&quot; para
                  começar!
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {canaisVenda.map((canal) => (
                    <div
                      key={canal.id}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <h3 className="font-semibold">{canal.nome}</h3>
                      {canal.descricao && (
                        <p className="mt-1 text-sm text-gray-600">
                          {canal.descricao}
                        </p>
                      )}
                      {canal.diaFechamento && (
                        <p className="mt-2 text-sm text-gray-500">
                          Fechamento: dia {canal.diaFechamento}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
