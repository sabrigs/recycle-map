import sqlite3
from flask import Flask, jsonify, render_template


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

    return render_template(
        "layout.html",
        categories=categories_list
        )


@app.route("/places")
def places():
    db = get_db()

    places_data = db.execute(
        """
        SELECT
            places.*,
            categories.name AS category_name,
            categories.icon
        FROM places
        JOIN categories
            ON places.category_id = categories.id;     
        """
        ).fetchall()

    db.close()

    return jsonify([dict(place) for place in places_data])
