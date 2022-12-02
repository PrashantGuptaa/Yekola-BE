import express from 'express';
import healthController from '../../controllers/health.controller';
import { loginUserController, registerUserController } from '../../controllers/user.controller';

const router = express.Router();

router.get('/', healthController);
router.post('/login', loginUserController);
router.post('/register', registerUserController);

export default router;