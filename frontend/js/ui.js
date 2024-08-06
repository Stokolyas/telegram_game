export class UI {
    constructor(game) {
        this.game = game;
        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelector('.click-image').addEventListener('click', () => this.game.addPoints());
        document.getElementById('upgradeButton').addEventListener('click', () => this.game.buyUpgrade());
    }

    updateDisplay() {
        document.getElementById('score').innerText = this.game.score;
        document.getElementById('level').innerText = this.game.level;
        document.getElementById('clicks').innerText = this.game.clicks;
        document.getElementById('maxClicks').innerText = this.game.maxClicks;
        document.getElementById('upgradeCost').innerText = this.game.upgradeCost;
        const progress = (this.game.score % (this.game.level * 100)) / (this.game.level * 100) * 100;
        document.getElementById('progress-bar-fill').style.width = `${progress}%`;
        document.getElementById('progress-bar-text').innerText = `${this.game.score} / ${this.game.level * 100}`;
    }

    showGame() {
        document.getElementById('game').style.display = 'flex';
        document.getElementById('shop').style.display = 'none';
        document.getElementById('tasks').style.display = 'none';
    }
}
