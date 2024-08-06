import logging
import sqlite3
from uuid import uuid4
from creds import BOT_TOKEN, BOT_USERNAME, WEBAPP_URL
from telegram import InlineQueryResultGame, Update
from telegram.ext import Application, CommandHandler, InlineQueryHandler, CallbackQueryHandler, TypeHandler, CallbackContext
from customwebhook import CustomContext, WebhookUpdate

# Enable logging
logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)
logging.getLogger("httpx").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

async def inline_query(update: Update, context: CallbackContext) -> None:
    logger.info('Inline query received')
    query_id = update.inline_query.id
    results = [InlineQueryResultGame(id='1', game_short_name=BOT_USERNAME)]
    await context.bot.answer_inline_query(inline_query_id=query_id, results=results)

async def callback_query(update: Update, context: CallbackContext) -> None:
    logger.info('Callback query received')
    query = update.callback_query
    url = WEBAPP_URL
    if query.game_short_name == BOT_USERNAME:
        uuid_value = str(uuid4())
        try:
            conn = sqlite3.connect('players.db')
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO games (user_id, hash, game_name, inline_id) VALUES (?, ?, ?, ?) "
                "ON CONFLICT (user_id) DO UPDATE SET hash=?, game_name=?, inline_id=?",
                (query.from_user.id, uuid_value, BOT_USERNAME, query.inline_message_id, uuid_value, BOT_USERNAME, query.inline_message_id)
            )
            conn.commit()
        finally:
            conn.close()
        await context.bot.answer_callback_query(callback_query_id=query.id, url=url)
    else:
        await context.bot.answer_callback_query(callback_query_id=query.id, text="This does nothing.")

async def start(update: Update, context: CallbackContext) -> None:
    chat_id = update.message.chat_id
    await update.message.reply_text('Добро пожаловать в нашу игру! Нажмите кнопку ниже, чтобы начать играть.')
    await context.bot.send_game(chat_id, game_short_name=BOT_USERNAME)

async def webhook_update(update: WebhookUpdate, context: CustomContext) -> None:
    logger.info('Webhook update received')
    user_hash = update.payload
    score = update.score
    bot = context.bot

    try:
        conn = sqlite3.connect('players.db')
        cur = conn.cursor()
        cur.execute('SELECT user_id, game_name, inline_id FROM games WHERE hash=?', (user_hash,))
        info = cur.fetchone()
        if info:
            user_id, game_name, inline_id = info
            await bot.set_game_score(user_id=user_id, score=score, inline_message_id=inline_id)
    finally:
        conn.close()

def main() -> None:
    """Run the bot."""
    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(InlineQueryHandler(inline_query))
    application.add_handler(CallbackQueryHandler(callback_query))
    application.add_handler(TypeHandler(type=WebhookUpdate, callback=webhook_update))

    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
