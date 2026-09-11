import sqlite3
from flask import Flask, render_template


def get_db():
    connection = sqlite3.connect("database.db")
    connection.row_factory = sqlite3.Row
    return connection

app = Flask(__name__)


@app.route("/")
def index():
    db = get_db()
    categories_list = db.execute("SELECT * FROM categories").fetchall()
    places_list = db.execute("SELECT * FROM places").fetchall()
    db.close()

    return render_template(
        "layout.html",
        categories=categories_list,
        places=places_list
        )
