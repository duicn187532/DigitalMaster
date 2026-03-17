from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from mongodb import starCollection, masterCollection, classCollection, initCollection
from werkzeug.exceptions import HTTPException
from pymongo.errors import PyMongoError
from flask_cors import CORS
from bson.objectid import ObjectId


load_dotenv()  # 載入 .env 檔案（若有）

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["https://digital-master-d200.github.io"])


# -------------------------------
# Supervisor CRUD
# -------------------------------

# 3. 取得單一 Supervisor
@app.route("/master/<master_id>", methods=["GET"])
def get_master(master_id):
    master = masterCollection.find_one({"id": master_id})
    if not master:
        return jsonify({"error": "master not found"}), 404

    master["_id"] = str(master["_id"])
    return jsonify(master), 200


# -------------------------------
# Star CRUD
# -------------------------------

# 2. 依照 masterId 取得星星紀錄
@app.route("/stars/<master_id>", methods=["GET"])
def get_stars_for_master(master_id):
    stars = list(starCollection.find({"masterId": master_id}))
    for star in stars:
        star["_id"] = str(star["_id"])
    return jsonify(stars), 200

# -------------------------------
# Class CRUD
# -------------------------------

@app.route("/class", methods=["GET"])
def get_class():
    classes = list(classCollection.find())
    for cls in classes:
        cls["_id"] = str(cls["_id"])
    return jsonify(classes), 200


# -------------------------------
# Init CRUD
# -------------------------------

INIT_ID = "system_setting"

@app.route("/init", methods=["GET"])
def get_init_info():
    data = initCollection.find_one({"_id": INIT_ID})
    if not data:
        return jsonify({}), 200
    data["_id"] = str(data["_id"])  # 移除 _id 若你前端不需要
    return jsonify(data), 200

# -------------------------------
# Mix CRUD
# -------------------------------

@app.errorhandler(Exception)
def handle_all_errors(e):
    code = 500
    # 如果它本身就是个 HTTPException，就拿它的状态码
    if isinstance(e, HTTPException):
        code = e.code
    # 返回 JSON
    return jsonify({
        "error": getattr(e, "description", str(e))
    }), code

@app.route("/user-data", methods=["GET"])
def user_data():
    account = request.args.get('account', type=str)
    if not account:
        return jsonify({"error": "Missing required parameter: account"}), 400

    try:
        # 1. 讀取 init 資訊
        init_info = initCollection.find_one({"_id": INIT_ID})
        if not init_info:
            app.logger.error("Init info not found for INIT_ID=%s", INIT_ID)
            return jsonify({"error": "Initialization data not found"}), 500

        # 2. 讀取 master
        master = masterCollection.find_one({"account": account})
        if not master:
            return jsonify({"error": f"Master not found for account '{account}'"}), 404
        master["_id"] = str(master["_id"])

        # 3. 讀取 stars
        stars = list(starCollection.find({
            "masterId": master["id"],
            "$or": [
                {"valid": {"$ne": False}},
                {"valid": {"$exists": False}}
            ]
        }))
        for star in stars:
            star["_id"] = str(star["_id"])

        # 4. 讀取 classes
        classes = list(classCollection.find())
        for cls in classes:
            cls["_id"] = str(cls["_id"])

    except PyMongoError as e:
        # 資料庫存取錯誤
        app.logger.exception("Database error")
        return jsonify({"error": "Database error"}), 500
    except KeyError as e:
        # master["id"] 等欄位不存在
        app.logger.exception("Data format error: missing key %s", e)
        return jsonify({"error": "Data format error"}), 500
    except Exception as e:
        # 其他未預期錯誤
        app.logger.exception("Unexpected error")
        return jsonify({"error": "Unexpected error"}), 500

    # 組裝並回傳
    response = {
        "master": master,
        "stars": stars,
        "classes": classes,
        "initInfo": init_info,
    }
    return jsonify(response), 200

# -------------------------------
# 伺服器啟動
# -------------------------------
if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8080))  # 從環境變數獲取 Port
    app.run(host="0.0.0.0", port=port)
