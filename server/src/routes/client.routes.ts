import { Router } from 'express';
import * as clientController from '../controllers/client.controller';
import { authenticateToken, requireInternal } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação e acesso interno
router.use(authenticateToken);
router.use(requireInternal);

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClient);
router.post('/', clientController.createClient);
router.patch('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

export default router;
