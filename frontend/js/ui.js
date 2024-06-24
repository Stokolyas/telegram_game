export class UI {
    constructor(game) {
        this.game = game;
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('continueGameButton').addEventListener('click', () => this.game.startOrContinueGame());
        document.getElementById('openShopButton').addEventListener('click', () => this.openShop());
        document.getElementById('openTasksButton').addEventListener('click', () => this.openTasks());
        document.getElementById('newGameButton').addEventListener('click', () => this.game.startNewGame());
    }

    updateDisplay() {
        document.getElementById('score').innerText = this.game.score;
        document.getElementById('level').innerText = this.game.level;
        document.getElementById('clicks').innerText = this.game.clicks;
        document.getElementById('maxClicks').innerText = this.game.maxClicks;
        document.getElementById('upgradeCost').innerText = this.game.upgradeCost;

        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressBarText = document.getElementById('progress-bar-text');

        const progress = (this.game.score / (this.game.level * 100)) * 100;
        progressBarFill.style.width = `${progress}%`;
        progressBarText.innerText = `${this.game.score} / ${this.game.level * 100}`;
    }

    showGame() {
        document.querySelectorAll('.container').forEach(container => container.style.display = 'none');
        document.getElementById('game').style.display = 'block';
    }

    openShop() {
        this.game.saveGame();
        document.querySelectorAll('.container').forEach(container => container.style.display = 'none');
        document.getElementById('shop').style.display = 'block';
    }

    openTasks() {
        this.game.saveGame();
        document.querySelectorAll('.container').forEach(container => container.style.display = 'none');
        document.getElementById('tasks').style.display = 'block';
    }
}
