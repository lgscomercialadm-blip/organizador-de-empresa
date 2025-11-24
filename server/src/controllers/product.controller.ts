import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

const updateProductSchema = createProductSchema.partial().extend({
  isActive: z.boolean().optional(),
});

const createPhaseTemplateSchema = z.object({
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

const createActionTemplateSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  order: z.number().int().min(0),
  visibility: z.enum(['INTERNAL', 'VISIBLE_TO_CLIENT']).optional(),
  deadlineType: z.enum(['SPECIFIC_DATE', 'RELATIVE_DAYS', 'RECURRING']).optional(),
  deadlineDays: z.number().int().optional(),
  deadlineDate: z.string().datetime().optional(),
  recurrence: z.enum(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  recurrenceDays: z.number().int().optional(),
});

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        phaseTemplates: {
          include: {
            actionTemplates: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            clients: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        phaseTemplates: {
          include: {
            actionTemplates: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            clients: true,
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data,
    });

    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PHASE TEMPLATE CONTROLLERS
export const createPhaseTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const data = createPhaseTemplateSchema.parse(req.body);

    const phaseTemplate = await prisma.phaseTemplate.create({
      data: {
        productId,
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
        actionTemplates: true,
      },
    });

    res.status(201).json(phaseTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create phase template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePhaseTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { phaseTemplateId } = req.params;
    const data = createPhaseTemplateSchema.partial().parse(req.body);

    const updateData: any = { ...data };
    if (data.deadlineDate) {
      updateData.deadlineDate = new Date(data.deadlineDate);
    }

    const phaseTemplate = await prisma.phaseTemplate.update({
      where: { id: phaseTemplateId },
      data: updateData,
      include: {
        actionTemplates: true,
      },
    });

    res.json(phaseTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update phase template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePhaseTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { phaseTemplateId } = req.params;

    await prisma.phaseTemplate.delete({
      where: { id: phaseTemplateId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete phase template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ACTION TEMPLATE CONTROLLERS
export const createActionTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { phaseTemplateId } = req.params;
    const data = createActionTemplateSchema.parse(req.body);

    const actionTemplate = await prisma.actionTemplate.create({
      data: {
        phaseTemplateId,
        title: data.title,
        description: data.description,
        order: data.order,
        visibility: data.visibility || 'INTERNAL',
        deadlineType: data.deadlineType || 'RELATIVE_DAYS',
        deadlineDays: data.deadlineDays,
        deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
        recurrence: data.recurrence || 'ONCE',
        recurrenceDays: data.recurrenceDays,
      },
    });

    res.status(201).json(actionTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create action template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateActionTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { actionTemplateId } = req.params;
    const data = createActionTemplateSchema.partial().parse(req.body);

    const updateData: any = { ...data };
    if (data.deadlineDate) {
      updateData.deadlineDate = new Date(data.deadlineDate);
    }

    const actionTemplate = await prisma.actionTemplate.update({
      where: { id: actionTemplateId },
      data: updateData,
    });

    res.json(actionTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Update action template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteActionTemplate = async (req: AuthRequest, res: Response) => {
  try {
    const { actionTemplateId } = req.params;

    await prisma.actionTemplate.delete({
      where: { id: actionTemplateId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete action template error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
