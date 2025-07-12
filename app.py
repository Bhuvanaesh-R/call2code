import os
import requests
import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from bot import get_channels
from dotenv import load_dotenv
from helpers import apology, login_required


load_dotenv()
MY_CLIENT_SECRET = os.getenv('MY_CLIENT_SECRET')
MY_CLIENT_ID = os.getenv('MY_CLIENT_ID')
REDIRECT_URI = os.getenv('REDIRECT_URI')
MY_TOKEN = os.getenv('MY_TOKEN')

connection = sqlite3.connect("call2code.db")
cursor = connection.cursor()


app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
 

@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
def index():

    if session.get("user_token") is None:
        return render_template("index.html")

    token = session.get("user_token")
    user = getorpost_info("/users/@me", 0, access_token=token["access_token"])
    session["username"] = user["username"]

    if user["avatar"]:
        avatar_url = f"https://cdn.discordapp.com/avatars/{user["id"]}/{user["avatar"]}.png?size=256"
    else:
        defaultAvatarIndex = (int(user["id"]) >> 22) % 6
        avatar_url = f"https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png"

    session["avatar_url"] = avatar_url

    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""
    session.clear()

    discord_url = (
        f"https://discord.com/oauth2/authorize?client_id={MY_CLIENT_ID}"
        f"&response_type=code"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=guilds+identify"
    )
    return redirect(discord_url)
    

@app.route("/servers")
@login_required
def servers():
    guilds = getorpost_info("/users/@me/guilds", 0, access_token=session.get("access_token"))
    
    for i in range(-len(guilds), 0):
        if not (int(guilds[i]['permissions']) & 0x20):
            guilds.pop(i)

    return render_template("servers.html", guilds=guilds)


@app.route("/message")
@login_required
def message():
    guild_id = request.args.get("id")
    channel_id = request.args.get("ch")


    return redirect('/manage')


@app.route("/manage")
@login_required
def manage():
    guild_id = request.args.get("id")

    if guild_id == None:
        return apology("Missing Guild Id", 400)
    

    '''json_data = {
        "name": "0",
        "type": 0
    }

    getorpost_info(f"/guilds/{guild_id}/channels", 1, json=json_data, bot=True)'''
    
    return render_template("manage.html")


@app.route("/callback")
def callback():
    code = request.args.get("code")
    token = exchange_code(code, REDIRECT_URI)
    session["user_token"] = token
    session["access_token"] = token["access_token"]

    return redirect("/")

def exchange_code(code, redirect_uri):
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    r = requests.post(
        'https://discord.com/api/v10/oauth2/token',
        data=data,
        headers=headers,
        auth=(MY_CLIENT_ID, MY_CLIENT_SECRET)
    )

    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        apology("HTTP error occurred", 400)
    except requests.exceptions.RequestException as e:
        apology("A request error occurred", 400)

    return r.json()



def getorpost_info(path, method, json=None, access_token=None, bot=False):
    headers = {'Authorization': ('Bearer ' + access_token) if bot == False else ('Bot ' + MY_TOKEN),
               "Content-Type": "application/json" if method == 1 else None}
    try:
        if method == 0:
            r = requests.get('https://discord.com/api/v10' + path, headers=headers)
        else:
            r = requests.post('https://discord.com/api/v10' + path, headers=headers, json=json)
        r.raise_for_status()
    except Exception as e:
        return apology(f"Oh there is a problem: {e}", r.status_code)

    return r.json()


@app.errorhandler(404)
def page_not_found(e):
    return apology("Looks like page not found", 404)


@app.errorhandler(500)
def page_not_found(e):
    return apology("Internal Server Error", 500)


if __name__ == '__main__': 
    app.run()