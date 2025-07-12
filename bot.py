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


@Client.event
async def message(title, description, color, thumbnail, channel):
    myEmbed = discord.Embed(title=title, description=description, color=color)
    myEmbed.set_thumbnail(url=thumbnail)
    channel.send(embed=myEmbed)


def get_channels(id):
    ch = []
    for guild in Client.guilds:
        if guild.id == id:
            for channel in guild.channels:
                if isinstance(channel, discord.TextChannel):
                    ch.append(channel)
    return ch

if __name__ == "__main__":  
    Client.run(MY_TOKEN)