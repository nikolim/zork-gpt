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
from chatbots.langchainGPTChatbot import LangChainGPTBot

app = Flask(__name__)
CORS(app)

models = ["DefaultChatBot", "Simple GPT Chatbot", "DialoGPT Chatbot"]


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
    elif model_name == "langchain GPT Chatbot":
        return LangChainGPTBot
    else:
        return ChatBot

chatbots = {}

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
    
@app.route("/api/get_chat_ids", methods=["GET"])
def get_chat_ids():
    ids_with_names = {k: v["name"] for k, v in saved_chats.items() if v}
    return jsonify(ids_with_names)


# @app.route("/api/submit_message", methods=["POST"])
# def submit_message():
#     current_id = request.json["id"]
#     message = request.json["message"]
#     sender = request.json["sender"]
#     print(current_id)
#     chatbot = chatbots[current_id]
#     chatbot.get_answer(message)
#     print("messages: {}".format(chatbot.history))
#     return jsonify({"status": "success"})


@app.route("/api/request_answer", methods=["POST"])
def request_answer():
    current_id = request.json["id"]
    message = request.json["message"]
    chatbot = chatbots[current_id]
    answer = chatbot.get_answer(message)
    # wait for 1 second to simulate a delay
    # time.sleep(1)
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
