from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from telegram.ext import ApplicationBuilder, CallbackContext, CommandHandler, MessageHandler, filters
from telegram import Update, Bot
from telegram.ext import Updater, CommandHandler, CallbackContext
from customwebhook import CustomContext, WebhookUpdate
import logging

from telegram import ForceReply, Update, InlineQueryResultGame
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, InlineQueryHandler, TypeHandler
from uuid import uuid4
import sqlite3

# Enable logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
# set higher logging level for httpx to avoid all GET and POST requests being logged
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)


from creds import BOT_TOKEN, BOT_USERNAME, WEBAPP_URL
import json
from asyncio import Queue

my_queue = Queue()

async def inline_query(update, context):
    print('event')
    query_id = update.inline_query.id
    results = [
        InlineQueryResultGame(
            id='1',
            game_short_name=f'BOT_USERNAME'
        )
    ]
    await context.bot.answer_inline_query(inline_query_id=query_id, results=results)

async def callback_query(update, context):
    
    query = update.callback_query
    print('event_call',query.game_short_name, BOT_USERNAME)
    url = WEBAPP_URL

    if query.game_short_name == BOT_USERNAME:
        
        uuid = str(uuid4())
        conn = sqlite3.connect('players.db')
        cur = conn.cursor()
        cur.execute("INSERT INTO games (user_id, hash, game_name, inline_id) VALUES (?, ?, ?, ?) ON CONFLICT (user_id) DO UPDATE SET hash=?, game_name=?, inline_id=?", (query.from_user.id, uuid, "YOUR GAME SHORT NAME", query.inline_message_id, uuid, "YOUR GAME SHORTNAME", query.inline_message_id))
        conn.commit()
        conn.close()
        print(url, query.game_short_name,uuid)
        await context.bot.answer_callback_query(callback_query_id=query.id, url=url)
    else:
        await context.bot.answer_callback_query(callback_query_id=query.id, text="This does nothing.")

async def start(update: Update, context: CallbackContext) -> None:
    """Отправляет приветственное сообщение и запускает игру"""
    chat_id = update.message.chat_id
    await update.message.reply_text('Добро пожаловать в нашу игру! Нажмите кнопку ниже, чтобы начать играть.')
    await context.bot.send_game(chat_id, game_short_name=BOT_USERNAME)

async def webhook_update(update: WebhookUpdate, context: CustomContext) -> None:
    user_hash = update.payload
    score = update.score
    bot = context.bot

    conn = sqlite3.connect('players.db')
    cur = conn.cursor()
    cur.execute('SELECT user_id, game_name, inline_id FROM games WHERE hash=?', (user_hash,))
    info = cur.fetchone()
    if info:
        user_id, game_name, inline_id = info
        await bot.set_game_score(user_id=user_id, score=score, inline_message_id=inline_id)
    conn.close()

def main() -> None:
    """Запускает бота"""
    application = Application.builder().token(BOT_TOKEN).build()

    # on different commands - answer in Telegram
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CallbackQueryHandler(callback_query))
    application.add_handler(InlineQueryHandler(inline_query))
    application.add_handler(TypeHandler(type=WebhookUpdate, callback=webhook_update))
   
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()


# async def launch_web_ui(update: Update, callback: CallbackContext):
#     # display our web-app!
#     kb = [
#         [KeyboardButton(
#             "Show me my Web-App!",
#             web_app=WebAppInfo(WEBAPP_URL)
#         )]
#     ]
#     await update.message.reply_text("Let's do this...", reply_markup=ReplyKeyboardMarkup(kb))


# async def web_app_data(update: Update, context: CallbackContext):
#     data = json.loads(update.message.web_app_data.data)
#     await update.message.reply_text("Your data was:")
#     for result in data:
#         await update.message.reply_text(f"{result['name']}: {result['value']}")



# if __name__ == '__main__':
#     # when we run the script we want to first create the bot from the token:
#     application = ApplicationBuilder().token(BOT_TOKEN).build()

#     # and let's set a command listener for /start to trigger our Web UI
#     application.add_handler(CommandHandler('start', launch_web_ui))

#     # as well as a web-app listener for the user-inputted data
#     application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))


#     # and send the bot on its way!
#     print(f"Your bot is listening! Navigate to http://t.me/{BOT_USERNAME} to interact with it!")
#     application.run_polling()
