export class API {
    saveGame(gameData) {
        return fetch(`http://localhost:5000/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData),
        });
    }

    async loadGame(telegramId) {
        const response = await fetch(`http://localhost:5000/load/${telegramId}`);
        if (!response.ok) {
            throw new Error('Ошибка загрузки игры');
        }
        return response.json();
    }
}
