
from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi

uri = "mongodb+srv://root:scsbd200@digitalmaster.kwklubl.mongodb.net/?retryWrites=true&w=majority&appName=digitalMaster"

# Create a new client and connect to the server
client = MongoClient(uri)
db = client["DigitalMaster"]
masterCollection = db["master"]
starCollection = db["star"]
classCollection = db["class"]
initCollection = db["init_info"]


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