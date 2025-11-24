import { Router } from 'express';
import * as boardController from '../controllers/board.controller';
import { authenticateToken, requireInternal } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação e acesso interno
router.use(authenticateToken);
router.use(requireInternal);

// Board
router.get('/client/:clientId', boardController.getBoard);

// Phases
router.post('/board/:boardId/phases', boardController.createPhase);
router.patch('/phases/:phaseId', boardController.updatePhase);
router.delete('/phases/:phaseId', boardController.deletePhase);
router.post('/board/:boardId/phases/reorder', boardController.reorderPhases);

// Actions
router.post('/phases/:phaseId/actions', boardController.createAction);
router.patch('/actions/:actionId', boardController.updateAction);
router.delete('/actions/:actionId', boardController.deleteAction);
router.post('/actions/:actionId/move', boardController.moveAction);
router.get('/actions/:actionId/history', boardController.getActionHistory);

export default router;
