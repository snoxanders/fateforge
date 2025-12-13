import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';

const router = Router();

router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        database_url_configured: !!process.env.DATABASE_URL 
    });
});

router.post('/generate', CharacterController.generate);
router.post('/reroll', CharacterController.reroll);

router.post('/characters', CharacterController.save);
router.get('/characters', CharacterController.list);
router.delete('/characters/:id', CharacterController.delete);

export default router;
