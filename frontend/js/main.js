import { Game } from './game.js';

const game = new Game();

document.getElementById('continueGameButton').addEventListener('click', () => {
    game.startOrContinueGame();
    document.getElementById('game').style.display = 'flex';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('tasks').style.display = 'none';
});

document.getElementById('openShopButton').addEventListener('click', () => {
    game.saveGame();
    document.getElementById('game').style.display = 'none';
    document.getElementById('shop').style.display = 'flex';
    document.getElementById('tasks').style.display = 'none';
});

document.getElementById('openTasksButton').addEventListener('click', () => {
    game.saveGame();
    document.getElementById('game').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('tasks').style.display = 'flex';
});

document.getElementById('newGameButton').addEventListener('click', () => {
    game.startNewGame();
    document.getElementById('game').style.display = 'flex';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('tasks').style.display = 'none';
});

// Инициализация Telegram WebApp
function initTelegram() {
    if (typeof Telegram !== 'undefined' && Telegram.WebApp) {
        window.Telegram.initData()
        window.Telegram.WebApp.ready();
        const initData = window.Telegram.WebApp.initData() || '';
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            game.telegramId = user.id;
            game.startOrContinueGame();
        } else {
            console.error('Не удалось получить Telegram ID.');
        }
    } else {
        console.error('Telegram WebApp не инициализирован.');
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    initTelegram();
});
