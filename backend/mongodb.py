
from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi

uri = "mongodb+srv://root:21airr01@mycluster.wk4zgas.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster"

# Create a new client and connect to the server
client = MongoClient(uri)
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