import { Game } from './game.js';
import { UI } from './ui.js';

const game = new Game();
const ui = new UI(game);

window.game = game; // Делаем объект game доступным глобально для тестирования
window.ui = ui; // Делаем объект ui доступным глобально для тестирования

// Инициализация Telegram WebApp
Telegram.WebApp.ready();
game.initTelegram();
