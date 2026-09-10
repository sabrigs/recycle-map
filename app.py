import sqlite3
from flask import Flask, flash, redirect, render_template, request


def get_db():
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    return connection

app = Flask(__name__)

@app.route("/")
def index():
    db = get_db()
    categories_list = db.execute("SELECT * FROM categories").fetchall()
    db.close()

    return render_template("layout.html", categories=categories_list)
