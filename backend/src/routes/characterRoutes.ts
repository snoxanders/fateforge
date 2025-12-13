import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        database_url_configured: !!process.env.DATABASE_URL 
    });
});

// Geração (Stateless)
router.post('/generate', CharacterController.generate);
router.post('/reroll', CharacterController.reroll);

// Persistência (Database)
router.post('/characters', CharacterController.save);      // Salvar
router.get('/characters', CharacterController.list);       // Listar biblioteca
router.delete('/characters/:id', CharacterController.delete); // Excluir

export default router;
