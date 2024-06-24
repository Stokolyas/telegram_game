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
        this.clickRecoveryRate = 1000;
        this.telegramId = null;
        this.clickCount = 0;
        this.upgradeCooldown = false;
        this.api = new API();
        this.ui = new UI(this);
    }

    initTelegram() {
        const user = Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            this.telegramId = user.id;
            this.loadGame();
        } else {
            alert('Не удалось получить telegramId');
            this.startNewGame();
        }
    }

    updateDisplay() {
        this.ui.updateDisplay();
    }

    addPoints() {
        if (this.clicks > 0) {
            this.score += this.pointsPerClick;
            this.clicks--;
            this.clickCount++;
            if (this.clickCount % 10 === 0) {
                this.playClickSound();
            }
            this.checkLevelUp();
            this.updateDisplay();
        } else {
            alert("Недостаточно заряда кликов! Подождите, пока заряд восстановится.");
        }
    }

    playClickSound() {
        const clickSound = document.getElementById('click-sound');
        clickSound.play();
    }

    buyUpgrade() {
        if (this.upgradeCooldown) {
            alert("Подождите, улучшение на перезарядке!");
            return;
        }

        if (this.score >= this.upgradeCost) {
            this.score -= this.upgradeCost;
            this.pointsPerClick++;
            this.upgradeCost = Math.floor(this.upgradeCost * 1.5);
            this.updateDisplay();

            this.upgradeCooldown = true;
            document.getElementById('upgradeButton').disabled = true;

            setTimeout(() => {
                this.upgradeCooldown = false;
                document.getElementById('upgradeButton').disabled = false;
            }, 30000); // 30 секунд перезарядка
        } else {
            alert("Недостаточно очков для покупки улучшения.");
        }
    }

    checkLevelUp() {
        if (this.score >= this.level * 100) {
            this.level++;
            this.score = 0;
            alert(`Поздравляем! Вы достигли уровня ${this.level}`);
        }
    }

    saveGame() {
        const gameData = {
            telegramId: this.telegramId,
            score: this.score,
            level: this.level,
            clicks: this.clicks,
            pointsPerClick: this.pointsPerClick
        };

        this.api.saveGame(gameData)
            .then(response => {
                if (response.ok) {
                    alert('Игра сохранена!');
                } else {
                    alert('Ошибка сохранения игры!');
                }
            })
            .catch(error => {
                alert(`Ошибка сохранения игры: ${error}`);
            });
    }

    async loadGame() {
        try {
            const data = await this.api.loadGame(this.telegramId);
            this.score = data.score;
            this.level = data.level;
            this.clicks = data.clicks;
            this.pointsPerClick = data.pointsPerClick;
            this.updateDisplay();
        } catch (error) {
            alert(`Ошибка загрузки игры: ${error.message}`);
            this.startNewGame();
        }
    }

    startNewGame() {
        this.score = 0;
        this.pointsPerClick = 1;
        this.upgradeCost = 10;
        this.level = 1;
        this.clicks = 10;
        this.maxClicks = 10;
        this.clickCount = 0;
        this.updateDisplay();
    }

    startOrContinueGame() {
        this.loadGame();
        this.ui.showGame();
    }

    checkSubscriptionAndCompleteTask(taskName) {
        switch (taskName) {
            case 'subscribeTelegramChannel':
                const isSubscribed = true; // Здесь должна быть проверка подписки на канал
                if (isSubscribed) {
                    this.score += 100;
                    this.updateDisplay();
                    alert('Вы успешно подписались на канал @igmtv и получили награду в виде 100 очков!');
                } else {
                    alert('Вы не подписаны на канал @igmtv. Подпишитесь, чтобы получить награду.');
                }
                break;
            default:
                alert('Неизвестное задание');
        }
    }
}
