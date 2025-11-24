import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { Product } from '@/types';
import { Package } from 'lucide-react';

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get<Product[]>('/products');
      return response.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-12">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Produtos e Templates</h1>
        <p className="text-gray-600 mt-2">
          Gerencie os produtos e seus templates de fases e ações
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className="card">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                )}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fases:</span>
                    <span className="font-medium text-gray-900">
                      {product.phaseTemplates?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Clientes:</span>
                    <span className="font-medium text-gray-900">
                      {product._count?.clients || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {products?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-600">
            Nenhum produto cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  );
}
