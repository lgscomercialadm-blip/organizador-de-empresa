import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

const createPhaseSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  order: z.number().int().min(0),
  visibility: z.enum(['INTERNAL', 'VISIBLE_TO_CLIENT']).optional(),
  deadlineType: z.enum(['SPECIFIC_DATE', 'RELATIVE_DAYS', 'RECURRING']).optional(),
  deadlineDays: z.number().int().optional(),
  deadlineDate: z.string().datetime().optional(),
  recurrence: z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  recurrenceDays: z.number().int().optional(),
});

const updatePhaseSchema = createPhaseSchema.partial();

const createActionSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  order: z.number().int().min(0),
  visibility: z.enum(['INTERNAL', 'VISIBLE_TO_CLIENT']).optional(),
  deadlineType: z.enum(['SPECIFIC_DATE', 'RELATIVE_DAYS', 'RECURRING']).optional(),
  deadlineDays: z.number().int().optional(),
  deadlineDate: z.string().datetime().optional(),
  recurrence: z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  recurrenceDays: z.number().int().optional(),
  assigneeId: z.string().uuid().optional(),
});

const updateActionSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional(),
  order: z.number().int().min(0).optional(),
  visibility: z.enum(['INTERNAL', 'VISIBLE_TO_CLIENT']).optional(),
  deadlineType: z.enum(['SPECIFIC_DATE', 'RELATIVE_DAYS', 'RECURRING']).optional(),
  deadlineDays: z.number().int().optional(),
  deadlineDate: z.string().datetime().optional(),
  recurrence: z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  recurrenceDays: z.number().int().optional(),
  assigneeId: z.string().uuid().optional().nullable(),
});

export const getBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { clientId } = req.params;

    const board = await prisma.board.findUnique({
      where: { clientId },
      include: {
        client: true,
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
    });

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PHASE CONTROLLERS
export const createPhase = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const data = createPhaseSchema.parse(req.body);

    const phase = await prisma.phase.create({
      data: {
        boardId,
        name: data.name,
        description: data.description,
        order: data.order,
        visibility: data.visibility || 'INTERNAL',
        deadlineType: data.deadlineType || 'RELATIVE_DAYS',
        deadlineDays: data.deadlineDays,
        deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
        recurrence: data.recurrence || 'ONCE',
        recurrenceDays: data.recurrenceDays,
      },
      include: {
        actions: true,
      },
    });

    res.status(201).json(phase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create phase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePhase = async (req: AuthRequest, res: Response) => {
  try {
    const { phaseId } = req.params;
    const data = updatePhaseSchema.parse(req.body);

    const updateData: any = { ...data };
    if (data.deadlineDate) {
      updateData.deadlineDate = new Date(data.deadlineDate);
    }

    const phase = await prisma.phase.update({
      where: { id: phaseId },
      data: updateData,
      include: {
        actions: true,
      },
    });

    res.json(phase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update phase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePhase = async (req: AuthRequest, res: Response) => {
  try {
    const { phaseId } = req.params;

    await prisma.phase.delete({
      where: { id: phaseId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete phase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const reorderPhases = async (req: AuthRequest, res: Response) => {
  try {
    const { boardId } = req.params;
    const { phaseOrders } = req.body as { phaseOrders: { id: string; order: number }[] };

    // Atualizar a ordem de cada fase
    await Promise.all(
      phaseOrders.map((phase) =>
        prisma.phase.update({
          where: { id: phase.id },
          data: { order: phase.order },
        })
      )
    );

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        phases: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    res.json(board);
  } catch (error) {
    console.error('Reorder phases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ACTION CONTROLLERS
export const createAction = async (req: AuthRequest, res: Response) => {
  try {
    const { phaseId } = req.params;
    const userId = req.user?.userId;
    const data = createActionSchema.parse(req.body);

    const action = await prisma.action.create({
      data: {
        phaseId,
        title: data.title,
        description: data.description,
        order: data.order,
        visibility: data.visibility || 'INTERNAL',
        deadlineType: data.deadlineType || 'RELATIVE_DAYS',
        deadlineDays: data.deadlineDays,
        deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
        recurrence: data.recurrence || 'ONCE',
        recurrenceDays: data.recurrenceDays,
        assigneeId: data.assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Criar entrada no histórico
    if (userId) {
      await prisma.historyEntry.create({
        data: {
          actionId: action.id,
          userId,
          field: 'created',
          newValue: 'Action created',
        },
      });
    }

    res.status(201).json(action);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAction = async (req: AuthRequest, res: Response) => {
  try {
    const { actionId } = req.params;
    const userId = req.user?.userId;
    const data = updateActionSchema.parse(req.body);

    // Buscar ação atual para comparar mudanças
    const currentAction = await prisma.action.findUnique({
      where: { id: actionId },
    });

    if (!currentAction) {
      return res.status(404).json({ error: 'Action not found' });
    }

    const updateData: any = { ...data };
    if (data.deadlineDate) {
      updateData.deadlineDate = new Date(data.deadlineDate);
    }

    // Se status mudou para COMPLETED, adicionar completedAt
    if (data.status === 'COMPLETED' && currentAction.status !== 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const action = await prisma.action.update({
      where: { id: actionId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Criar entradas no histórico para cada mudança
    if (userId) {
      const historyEntries: any[] = [];

      Object.keys(data).forEach((field) => {
        const oldValue = (currentAction as any)[field];
        const newValue = (data as any)[field];

        if (oldValue !== newValue) {
          historyEntries.push({
            actionId: action.id,
            userId,
            field,
            oldValue: oldValue?.toString() || null,
            newValue: newValue?.toString() || null,
          });
        }
      });

      if (historyEntries.length > 0) {
        await prisma.historyEntry.createMany({
          data: historyEntries,
        });
      }
    }

    res.json(action);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAction = async (req: AuthRequest, res: Response) => {
  try {
    const { actionId } = req.params;

    await prisma.action.delete({
      where: { id: actionId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const moveAction = async (req: AuthRequest, res: Response) => {
  try {
    const { actionId } = req.params;
    const { phaseId, order } = req.body as { phaseId: string; order: number };

    const action = await prisma.action.update({
      where: { id: actionId },
      data: {
        phaseId,
        order,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(action);
  } catch (error) {
    console.error('Move action error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { actionId } = req.params;

    const history = await prisma.historyEntry.findMany({
      where: { actionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(history);
  } catch (error) {
    console.error('Get action history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
