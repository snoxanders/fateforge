import { Router } from 'express';
import { CharacterController } from '../controllers/CharacterController';

const router = Router();

// Geração (Stateless)
router.post('/generate', CharacterController.generate);
router.post('/reroll', CharacterController.reroll);

// Persistência (Database)
router.post('/characters', CharacterController.save);      // Salvar
router.get('/characters', CharacterController.list);       // Listar biblioteca
router.delete('/characters/:id', CharacterController.delete); // Excluir

export default router;
