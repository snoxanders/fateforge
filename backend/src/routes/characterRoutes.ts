import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';

const router = Router();

router.post('/generate', CharacterController.generate);
router.post('/reroll', CharacterController.reroll);

export default router;
