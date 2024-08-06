import { API } from './api.js';
import { UI } from './ui.js';

export class Game {
    constructor() {
        this.score = 0;
        this.pointsPerClick = 1;
        this.upgradeCost = 10;
        this.level = 1;
        this.clicks = 10;
        this.maxClicks = 10;
        this.clickCount = 0;
        this.upgradeTimeout = null;
        this.ui = new UI(this);
        this.api = new API();

        this.ui.updateDisplay();
        this.startOrContinueGame();
    }

    addPoints() {
        if (this.clicks > 0) {
            this.score += this.pointsPerClick;
            this.clicks--;
            this.clickCount++;
            this.checkLevelUp();
            this.ui.updateDisplay();

            if (this.clickCount % 10 === 0) {
                document.getElementById('click-sound').play();
            }
        } else {
            alert('Недостаточно кликов! Подождите, пока клики восстановятся.');
        }
    }

    buyUpgrade() {
        if (this.score >= this.upgradeCost && this.upgradeTimeout === null) {
            this.score -= this.upgradeCost;
            this.pointsPerClick++;
            this.upgradeCost *= 2;
            this.ui.updateDisplay();

            document.getElementById('upgradeButton').disabled = true;
            this.upgradeTimeout = setTimeout(() => {
                this.upgradeTimeout = null;
                document.getElementById('upgradeButton').disabled = false;
            }, 60000);
        } else {
            alert('Недостаточно очков или улучшение на перезарядке.');
        }
    }

    checkLevelUp() {
        if (this.score >= this.level * 100) {
            this.level++;
            this.maxClicks += 10;
            this.clicks = this.maxClicks;
            this.ui.updateDisplay();
        }
    }

    saveGame() {
        const state = {
            score: this.score,
            pointsPerClick: this.pointsPerClick,
            upgradeCost: this.upgradeCost,
            level: this.level,
            clicks: this.clicks,
            maxClicks: this.maxClicks
        };
        localStorage.setItem('gameState', JSON.stringify(state));
    }

    loadGame() {
        const state = JSON.parse(localStorage.getItem('gameState'));
        if (state) {
            this.score = state.score;
            this.pointsPerClick = state.pointsPerClick;
            this.upgradeCost = state.upgradeCost;
            this.level = state.level;
            this.clicks = state.clicks;
            this.maxClicks = state.maxClicks;
        }
        this.ui.updateDisplay();
    }

    startNewGame() {
        this.score = 0;
        this.pointsPerClick = 1;
        this.upgradeCost = 10;
        this.level = 1;
        this.clicks = 10;
        this.maxClicks = 10;
        this.clickCount = 0;

        this.ui.updateDisplay();
    }

    startOrContinueGame() {
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
            this.loadGame();
        } else {
            this.startNewGame();
        }
        this.ui.showGame();
    }

    initTelegram() {
        const initData = Telegram.WebApp.initData || '';
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            this.telegramId = user.id;
            this.loadGame();
        } else {
            console.error('Не удалось получить Telegram ID.');
        }
    }

    checkSubscriptionAndCompleteTask(taskId) {
        this.api.checkSubscription(this.telegramId, taskId)
            .then(isSubscribed => {
                if (isSubscribed) {
                    alert('Спасибо за подписку! Вы получили 100 кликов.');
                    this.clicks += 100;
                    this.ui.updateDisplay();
                } else {
                    alert('Пожалуйста, подпишитесь на канал, чтобы завершить задание.');
                }
            })
            .catch(error => console.error('Ошибка проверки подписки:', error));
    }
}
