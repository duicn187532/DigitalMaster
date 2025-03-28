from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
import os
# from pymongo.server_api import ServerApi

# 載入 .env 檔案中的環境變數
load_dotenv()

# 讀取 MongoDB 連接字串
mongo_uri = os.getenv("MONGO_URI")

# Create a new client and connect to the server
client = MongoClient(mongo_uri)
db = client["DigitalMaster"]
supervisorCollection = db["supervisor"]
starCollection = db["star"]
classCollection = db["class"]

# data = {"id": "01234", "name": "張三", "branchCode": "02"}
# Send a ping to confirm a successful connection
# try:
#     # supervisor.insert_one(data)
#     result = supervisor.find()
#     for i in result:
#         print(i)
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)