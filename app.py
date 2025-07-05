import os
import requests
import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
import bot
from dotenv import load_dotenv
from helpers import apology, login_required


load_dotenv()
MY_CLIENT_SECRET = os.getenv('MY_CLIENT_SECRET')
MY_CLIENT_ID = os.getenv('MY_CLIENT_ID')
REDIRECT_URI = os.getenv('REDIRECT_URI')

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
@login_required
def index():

    token = session.get("user_token")
    user = get_user_info(token["access_token"])
    # Get user name
    username = user["username"]

    # Get user avatar
    if user["avatar"]:
        avatar_url = f"https://cdn.discordapp.com/avatars/{user["id"]}/{user["avatar"]}.png?size=256"
    else:
        defaultAvatarIndex = (int(user["id"]) >> 22) % 6
        avatar_url = f"https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png"

    return render_template("index.html", username=username, avatar_url=avatar_url)


@app.route("/login", methods=["GET", "POST"])
def login():

    """Log user in"""

    session.clear()

    if request.method == "POST":

        discord_url = (
            f"https://discord.com/oauth2/authorize?client_id={MY_CLIENT_ID}"
            f"&permissions=8"
            f"&response_type=code"
            f"&redirect_uri={REDIRECT_URI}"
            f"&integration_type=0&scope=bot+guilds+identify"
        )
        return redirect(discord_url)
    

    else:
        return render_template("login.html")


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
    r.raise_for_status()
    return r.json()

def get_user_info(access_token):
    headers = {'Authorization': f'Bearer {access_token}'}
    r = requests.get('https://discord.com/api/v10/users/@me', headers=headers)
    return r.json()

if __name__ == '__main__':  
    app.run()