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

    categories_list = db.execute(
        """
        SELECT * FROM categories
        """
        ).fetchall()

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

    categories = [dict(category) for category in categories_list]
    places = [dict(place) for place in places_data]

    return render_template(
        "layout.html",
        places=places,
        categories=categories
    )