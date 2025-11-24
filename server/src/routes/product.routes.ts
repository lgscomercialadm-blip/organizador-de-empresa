import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Products (apenas Admin pode criar/editar/deletar)
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', requireAdmin, productController.createProduct);
router.patch('/:id', requireAdmin, productController.updateProduct);
router.delete('/:id', requireAdmin, productController.deleteProduct);

// Phase Templates (apenas Admin)
router.post('/:productId/phase-templates', requireAdmin, productController.createPhaseTemplate);
router.patch('/phase-templates/:phaseTemplateId', requireAdmin, productController.updatePhaseTemplate);
router.delete('/phase-templates/:phaseTemplateId', requireAdmin, productController.deletePhaseTemplate);

// Action Templates (apenas Admin)
router.post('/phase-templates/:phaseTemplateId/action-templates', requireAdmin, productController.createActionTemplate);
router.patch('/action-templates/:actionTemplateId', requireAdmin, productController.updateActionTemplate);
router.delete('/action-templates/:actionTemplateId', requireAdmin, productController.deleteActionTemplate);

export default router;
