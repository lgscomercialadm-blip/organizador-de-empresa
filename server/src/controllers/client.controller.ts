import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';
import { calculateTargetDate, isDelayed } from '../utils/deadline';

const createClientSchema = z.object({
  name: z.string().min(2),
  companyName: z.string().optional(),
  cnpjCpf: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  productId: z.string().uuid(),
  entryDate: z.string().datetime().optional(),
});

const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  companyName: z.string().optional(),
  cnpjCpf: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const data = createClientSchema.parse(req.body);

    // Verificar se o produto existe
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: {
        phaseTemplates: {
          include: {
            actionTemplates: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const entryDate = data.entryDate ? new Date(data.entryDate) : new Date();

    // Criar cliente com quadro e fases baseadas no template
    const client = await prisma.client.create({
      data: {
        name: data.name,
        companyName: data.companyName,
        cnpjCpf: data.cnpjCpf,
        email: data.email,
        phone: data.phone,
        productId: data.productId,
        entryDate,
        consultantId: userId,
        board: {
          create: {
            name: `Quadro - ${data.name}`,
            phases: {
              create: product.phaseTemplates.map((phaseTemplate) => ({
                name: phaseTemplate.name,
                description: phaseTemplate.description,
                order: phaseTemplate.order,
                visibility: phaseTemplate.visibility,
                deadlineType: phaseTemplate.deadlineType,
                deadlineDays: phaseTemplate.deadlineDays,
                deadlineDate: phaseTemplate.deadlineDate,
                recurrence: phaseTemplate.recurrence,
                recurrenceDays: phaseTemplate.recurrenceDays,
                actions: {
                  create: phaseTemplate.actionTemplates.map((actionTemplate) => ({
                    title: actionTemplate.title,
                    description: actionTemplate.description,
                    order: actionTemplate.order,
                    visibility: actionTemplate.visibility,
                    deadlineType: actionTemplate.deadlineType,
                    deadlineDays: actionTemplate.deadlineDays,
                    deadlineDate: actionTemplate.deadlineDate,
                    recurrence: actionTemplate.recurrence,
                    recurrenceDays: actionTemplate.recurrenceDays,
                  })),
                },
              })),
            },
          },
        },
      },
      include: {
        product: true,
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        board: {
          include: {
            phases: {
              include: {
                actions: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    res.status(201).json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        product: true,
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        board: {
          include: {
            phases: {
              include: {
                actions: {
                  select: {
                    id: true,
                    status: true,
                    deadlineType: true,
                    deadlineDays: true,
                    deadlineDate: true,
                    isDelayed: true,
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular estatísticas para cada cliente
    const clientsWithStats = clients.map((client) => {
      const board = client.board;
      if (!board) {
        return {
          ...client,
          stats: {
            totalActions: 0,
            completedActions: 0,
            delayedActions: 0,
            currentPhase: null,
          },
        };
      }

      const allActions = board.phases.flatMap((phase) => phase.actions);
      const totalActions = allActions.length;
      const completedActions = allActions.filter((a) => a.status === 'COMPLETED').length;
      const delayedActions = allActions.filter((a) => a.isDelayed).length;

      // Fase atual = primeira fase não concluída
      const currentPhase = board.phases.find((phase) => !phase.isCompleted);

      return {
        ...client,
        stats: {
          totalActions,
          completedActions,
          delayedActions,
          completionPercentage: totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0,
          currentPhase: currentPhase ? currentPhase.name : 'Concluído',
        },
      };
    });

    res.json(clientsWithStats);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        product: true,
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        board: {
          include: {
            phases: {
              include: {
                actions: {
                  include: {
                    assignee: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateClientSchema.parse(req.body);

    const client = await prisma.client.update({
      where: { id },
      data,
      include: {
        product: true,
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
