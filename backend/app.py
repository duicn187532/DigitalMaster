from flask import Flask, request, jsonify, send_from_directory
import os
from dotenv import load_dotenv
from mongodb import starCollection, masterCollection, classCollection, initCollection
from flask_cors import CORS
from bson.objectid import ObjectId


load_dotenv()  # 載入 .env 檔案（若有）

app = Flask(
    __name__,
    static_folder="dist",   # 這是你的 build 資料夾
    static_url_path="/"                # 根目錄就提供 index.html
)
CORS(app)  # 允許所有來源訪問


# 靜態首頁：回傳 index.html
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # 如果找不到資源，就回傳 index.html（讓 React Router 接手）
        return send_from_directory(app.static_folder, "index.html")

# -------------------------------
# master CRUD
# -------------------------------



# 1. 新增 master
@app.route("/master", methods=["POST"])
def create_master():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # 必要欄位檢查
    required_fields = ["id", "account", "name", "branchCode"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # 插入資料
    result = masterCollection.insert_one(data)

    return jsonify({"message": "master created", "inserted_id": str(result.inserted_id)}), 201


# 2. 取得所有 master
@app.route("/master", methods=["GET"])
def get_all_master():
    masters = list(masterCollection.find())
    for master in masters:
        master["_id"] = str(master["_id"])
    return jsonify(masters), 200


# 3. 取得單一 master
@app.route("/master/<master_id>", methods=["GET"])
def get_master(master_id):
    master = masterCollection.find_one({"id": master_id})
    if not master:
        return jsonify({"error": "master not found"}), 404

    master["_id"] = str(master["_id"])
    return jsonify(master), 200


# 4. 更新 master
@app.route("/master/<master_id>", methods=["PUT"])
def update_master(master_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    print(data)
    # 更新
    result = masterCollection.update_one(
        {"id": master_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "master not found"}), 404

    return jsonify({"message": "master updated"}), 200


# 5. 刪除 master
@app.route("/master/<master_id>", methods=["DELETE"])
def delete_master(master_id):
    result = masterCollection.delete_one({"id": master_id})
    if result.deleted_count == 0:
        return jsonify({"error": "master not found"}), 404
    return jsonify({"message": "master deleted"}), 200


# -------------------------------
# Star CRUD
# -------------------------------

@app.route("/stars", methods=["GET"])
def get_all_stars():
    stars = list(starCollection.find())
    for star in stars:
        star["_id"] = str(star["_id"])
    return jsonify(stars), 200

# 1. 新增 Star 記錄
@app.route("/stars", methods=["POST"])
def create_star():
    reqData = request.json
    if not reqData:
        return jsonify({"error": "No data provided"}), 400

    # 如果收到的是單筆資料，轉成列表處理
    if isinstance(reqData, dict):
        reqData = [reqData]
    
    # 檢查每筆資料是否包含必要欄位
    required_fields = ["masterId", "score", "type", "date"]
    for data in reqData:
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

    # 整理資料
    docs = [{
        "masterId": data["masterId"],
        "score": data["score"],
        "type": data["type"],
        "date": data["date"],
        "remarks": data.get("remarks", ""),
        "valid": True,
    } for data in reqData]

    # 批次新增
    result = starCollection.insert_many(docs)
    return jsonify({
        "message": "Star records created",
        "inserted_ids": [str(_id) for _id in result.inserted_ids]
    }), 201

# 2. 依照 masterId 取得星星紀錄
@app.route("/stars/<master_id>", methods=["GET"])
def get_stars_for_master(master_id):
    stars = list(starCollection.find({"masterId": master_id}))
    for star in stars:
        star["_id"] = str(star["_id"])
    return jsonify(stars), 200

# 3. 更新 Star
@app.route("/stars/<star_id>", methods=["PUT", "PATCH"])
def update_star(star_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    try:
    # 確認 ID 是有效的 ObjectId
        object_id = ObjectId(star_id)
    except Exception: 
        return jsonify({"error": "Invalid ID format"}), 400


    result = starCollection.update_one(
        {"_id": object_id},
        {"$set": data}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Star record not found"}), 404

    return jsonify({"message": "Star record updated"}), 200


# 4. 刪除 Star
@app.route("/stars/<star_id>", methods=["DELETE"])
def delete_star(star_id):
    result = starCollection.delete_one({"_id": ObjectId(star_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Star record not found"}), 404
    return jsonify({"message": "Star record deleted"}), 200

# -------------------------------
# Class CRUD
# -------------------------------

@app.route("/class", methods=["GET"])
def get_class():
    classes = list(classCollection.find())
    for cls in classes:
        cls["_id"] = str(cls["_id"])
    return jsonify(classes), 200

@app.route("/class", methods=["POST"])
def create_class():
    reqData = request.json
    if not reqData:
        return jsonify({"error": "No data provided"}), 400
    

    # 必要欄位檢查
    required_fields = ["date", "startTime", "endTime", "name", "type"]

    for field in required_fields:
        if field not in reqData:
            return jsonify({"error": f"Missing field: {field}"}), 400
    if type(reqData) == dict:
        # 插入資料
        result = classCollection.insert_one(reqData)
    else: return jsonify({"error : type error"}), 400

    return jsonify({"message": "Class record created", "inserted_id": str(result.inserted_id)}), 201

@app.route("/class/<class_id>", methods=["DELETE"])
def delete_class(class_id):
    result = classCollection.delete_one({"_id": ObjectId(class_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "class record not found"}), 404
    return jsonify({"message": "class record deleted"}), 200

INIT_ID = "system_setting"

@app.route("/user-data", methods=["GET"])
def user_data():
    master_id = request.args.get('master_id')

    if not master_id:
        return jsonify({"error": "Missing master_id"}), 400

    # Fetch Initial Data 
    
    init_info = initCollection.find_one({"_id": INIT_ID})
    
    # Fetch master
    master = masterCollection.find_one({"id": master_id})
    if master:
        master["_id"] = str(master["_id"])

    # Fetch Stars
    stars = list(starCollection.find({
        "masterId": master_id,
        "$or": [
            {"valid": {"$ne": False}},  # 找出 valid 不等於 False 的資料
            {"valid": {"$exists": False}}  # 找出沒有 valid 欄位的資料
        ]
    }))
    for star in stars:
        star["_id"] = str(star["_id"])

    # Fetch Classes
    classes = list(classCollection.find())
    for cls in classes:
        cls["_id"] = str(cls["_id"])

    # Return combined data
    response = {
        "master": master,
        "stars": stars,
        "classes": classes,
        "initInfo": init_info,
    }

    return jsonify(response), 200


# 預設只儲存一筆 init 設定

@app.route("/init", methods=["GET"])
def get_init_info():
    data = initCollection.find_one({"_id": INIT_ID})
    if not data:
        return jsonify({}), 200
    data["_id"] = str(data["_id"])  # 移除 _id 若你前端不需要
    return jsonify(data), 200

@app.route("/init", methods=["PUT"])
def update_init_info():
    req_data = request.json
    if not req_data:
        return jsonify({"error": "No data provided"}), 400

    # surveyUrl 和 surveyStartDay 應該是 string 格式
    survey_url = req_data.get("surveyUrl", "")
    survey_start_day = req_data.get("surveyStartDay", "")

    initCollection.update_one(
        {"_id": INIT_ID},
        {"$set": {
            "surveyUrl": survey_url,
            "surveyStartDay": survey_start_day
        }},
        upsert=True  # 若不存在則新增
    )

    return jsonify({"message": "Init info updated"}), 200


# -------------------------------
# 伺服器啟動
# -------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # 預設使用 8080
    app.run(debug=True, host="0.0.0.0", port=port)

