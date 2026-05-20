import { Router } from 'express';
import { getUnits, createUnit, deleteUnit } from '../controllers/unitController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getUnits);
router.post('/', createUnit);
router.delete('/:id', deleteUnit);

export default router;
