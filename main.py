import telebot
from telebot import types

bot = telebot.TeleBot("6972956528:AAGzrauQ_uZjmkorgPlTr529o8IZyTT0j2o")
game_short_name='taptap'

@bot.message_handler(commands=['start'])
def send_game(message):
    user_id = message.chat.id
    
    game_url = f'https://disk.yandex.ru/i/EZgO-mantyqi0A'
    
    markup = types.InlineKeyboardMarkup(row_width=2)

    game_button = types.InlineKeyboardButton("Play Game", callback_game="your_game_data")
    markup.add(game_button)

    bot.send_game(user_id, game_short_name, reply_markup=None, disable_notification=True, timeout=False)

bot.infinity_polling()