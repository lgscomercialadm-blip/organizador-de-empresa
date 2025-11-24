import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { clientService } from '@/services/client.service';
import { Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients,
  });

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  const activeClients = clients?.filter((c) => c.isActive) || [];
  const delayedClients = clients?.filter((c) => (c.stats?.delayedActions || 0) > 0) || [];
  const onTrackClients = activeClients.filter((c) => (c.stats?.delayedActions || 0) === 0);

  const totalActions = clients?.reduce((acc, c) => acc + (c.stats?.totalActions || 0), 0) || 0;
  const completedActions = clients?.reduce((acc, c) => acc + (c.stats?.completedActions || 0), 0) || 0;

  const stats = [
    {
      name: 'Clientes Ativos',
      value: activeClients.length,
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      name: 'Clientes em Dia',
      value: onTrackClients.length,
      icon: CheckCircle,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      name: 'Clientes com Atraso',
      value: delayedClients.length,
      icon: AlertCircle,
      color: 'text-danger-600',
      bgColor: 'bg-danger-50',
    },
    {
      name: 'Conclusão Geral',
      value: totalActions > 0 ? `${Math.round((completedActions / totalActions) * 100)}%` : '0%',
      icon: Clock,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral dos projetos e clientes</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Clients */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Clientes Recentes</h2>
          <Link to="/clients" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Ver todos →
          </Link>
        </div>

        <div className="space-y-4">
          {clients?.slice(0, 5).map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}/board`}
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{client.name}</h3>
                  <p className="text-sm text-gray-600">
                    {client.product?.name} • {client.consultant?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {client.stats?.currentPhase}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${client.stats?.completionPercentage || 0}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-600">
                      {client.stats?.completionPercentage || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {(client.stats?.delayedActions || 0) > 0 && (
                <div className="mt-3 flex items-center text-danger-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {client.stats!.delayedActions} ação(ões) atrasada(s)
                </div>
              )}
            </Link>
          ))}

          {clients?.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              Nenhum cliente cadastrado ainda.
              <Link to="/clients" className="text-primary-600 hover:text-primary-700 ml-1">
                Criar primeiro cliente →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
