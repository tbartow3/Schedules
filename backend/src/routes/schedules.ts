import { Router } from 'express';
import {
  getSchedules,
  getUserSchedule,
  createShift,
  updateShift,
  deleteShift,
} from '../controllers/scheduleController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSchedules);
router.get('/:userId', getUserSchedule);
router.post('/', createShift);
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);

export default router;
