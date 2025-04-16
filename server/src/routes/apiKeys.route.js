import express from 'express';
import { createAPIKeyController } from '../controllers/apiKey.controller.js';

const router = express.Router();

router.post('/', createAPIKeyController);

export default router;