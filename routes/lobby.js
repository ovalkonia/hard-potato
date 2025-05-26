import express from 'express';
import lobby_controller from '../controllers/lobby.js';

const lobby_router = express.Router();

lobby_router.get('/lobby/gamepage', lobby_controller.render_game_page);

export default lobby_router;