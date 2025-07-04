import os
import discord
from dotenv import load_dotenv


load_dotenv()
MY_TOKEN = os.getenv('MY_TOKEN')

intents = discord.Intents.default()
intents.message_content = True
Client = discord.Client(intents=intents)

@Client.event
async def on_ready():
    print("The bot is Online")

@Client.event
async def on_disconnect():
    print("The Bot is Offline")

  
if __name__ == "__main__":  
    Client.run(MY_TOKEN)