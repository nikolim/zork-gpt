# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import uuid
from copy import deepcopy

# from typing import Optional
# import time
import chatbots
from chatbots import ChatBot, SimpleGPTBot
from chatbots.dialoGPTChatbot import DialoGPTBot

app = Flask(__name__)
CORS(app)

models = ["DefaultChatBot", "Simple GPT Chatbot", "DialoGPT Chatbot"]

# put lock or work queue


def get_model(model_name):
    if model_name == "DefaultChatBot":
        print("Loading ChatBot_v1")
        return ChatBot
    elif model_name == "Simple GPT Chatbot":
        return SimpleGPTBot
    elif model_name == "DialoGPT Chatbot":
        return DialoGPTBot
    elif model_name == "ChatBot_v3":
        return ChatBot
    else:
        return ChatBot


# Load existing chats from JSON file
if os.path.exists("chats.json"):
    with open("chats.json", "r") as f:
        saved_chats = json.load(f)
else:
    print("No chats.json file found. Creating a new one.")
    saved_chats = {}

chatbots = {}


def save_chats_to_file():
    with open("chats.json", "w") as f:
        json.dump(saved_chats, f)


@app.route("/api/create_chat", methods=["POST"])
def create_chat():
    dict_return = {}
    id = request.json.get("id")
    model_name = request.json.get("model_name")
    print(model_name)
    print("Creating chat with id: {}".format(id))
    chatbot = get_model(model_name)(
        original_id=id,
        name="",
    )
    chatbots[id] = chatbot
    # if not original_id or chatbot.history[-1]["sender"] != "AI":
    first_message = (
        chatbot.get_answer()
    )  # get the first answer, as we expect the chatbot to make the first move
    print("created first AI message")
    return first_message
    

@app.route("/api/delete_chat", methods=["POST"])
def delete_chat():
    current_id = request.json["current_id"]
    chatbots.pop(current_id)
    return jsonify({"status": "success"})


@app.route("/api/save_chat", methods=["POST"])
def save_chat():
    current_id = request.json["current_id"]
    save_as_original = request.json["save_as_original"]
    name = request.json["name"]

    chatbot = chatbots[current_id]
    chatbot.name = name
    chat_id = (
        chatbot.original_id if save_as_original and chatbot.original_id else current_id
    )
    saved_chats[chat_id] = {"name": name, "messages": chatbot.history}
    save_chats_to_file()

    return jsonify({"status": "success"})


# @app.route("/api/get_chat_messages", methods=["GET"])
# def get_chat_messages():
#     current_id = request.args.get("current_id")
#     chatbot = chatbots[current_id]
#     return jsonify(chatbot.history)


@app.route("/api/get_chat_ids", methods=["GET"])
def get_chat_ids():
    ids_with_names = {k: v["name"] for k, v in saved_chats.items() if v}
    return jsonify(ids_with_names)


@app.route("/api/submit_message", methods=["POST"])
def submit_message():
    current_id = request.json["id"]
    message = request.json["message"]
    sender = request.json["sender"]
    print(current_id)
    chatbot = chatbots[current_id]
    chatbot.append_message(message, sender="user")
    print("messages: {}".format(chatbot.history))
    return jsonify({"status": "success"})


@app.route("/api/request_answer", methods=["GET"])
def request_answer():
    current_id = request.args.get("id")
    chatbot = chatbots[current_id]
    answer = chatbot.get_answer()
    # wait for 1 second to simulate a delay
    # time.sleep(1)
    print("messages: {}".format(chatbot.history))
    return answer


@app.route("/api/get_models", methods=["GET"])
def get_models():
    return jsonify(models)


@app.route("/api/set_model", methods=["POST"])
def set_models():
    current_id = request.json["current_id"]
    model = request.json["model"]
    chatbot = chatbots[current_id]
    chatbots[current_id] = get_model(model)(
        history=chatbot.history, original_id=chatbot.original_id, name=chatbot.name
    )
    new_chatbot = chatbots[current_id]
    if len(new_chatbot.history) == 0 or chatbot.history[-1]["sender"] != "AI":
        first_messages = (
            new_chatbot.get_answer()
        )  # get the first answer, as we expect the chatbot to make the first move
        print("created AI message")
        print(first_messages)
    return jsonify({"messages": first_messages})
    # return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(debug=True)
