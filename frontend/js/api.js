export class API {
    checkSubscription(telegramId, taskId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true); // Mocking subscription check
            }, 1000);
        });
    }
}
