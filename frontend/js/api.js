export class API {
    checkSubscription(telegramId, taskId) {
        // Пример вызова API для проверки подписки
        return new Promise((resolve, reject) => {
            // Замените на ваш реальный API-запрос
            setTimeout(() => {
                // Мокаем проверку подписки
                resolve(true); // Предполагаем, что пользователь подписан
            }, 1000);
        });
    }
}
