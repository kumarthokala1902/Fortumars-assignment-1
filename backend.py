from flask import Flask, render_template, request, jsonify
import uuid

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/book", methods=["POST"])
def book():
    data = request.json
    booking_id = str(uuid.uuid4())[:8]

    print("Send email to:", data["email"])

    return jsonify({"booking_id": booking_id})

if __name__ == "__main__":
    app.run(debug=True)
