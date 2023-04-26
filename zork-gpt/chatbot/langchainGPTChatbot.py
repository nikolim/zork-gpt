from utils import LangChainChatBot
import openai
from dotenv import load_dotenv
import os
from langchain.llms import OpenAI
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

import re


def parse_bracket_content(text):
    bracket_pattern = r"\[([^\]]*)\]"

    bracket_match = re.search(bracket_pattern, text)

    if bracket_match:
        content = bracket_match.group(0)
        return content
    else:
        return None


def parse_room_name(text):
    room_pattern = r"(?i)room:\s*(.*)"

    room_match = re.search(room_pattern, text)

    if room_match:
        room_name = room_match.group(1)
        return room_name
    else:
        return None


def ignore_ai_prefix(text):
    ai_prefix_pattern = r"^(AI:)\s*"

    return re.sub(ai_prefix_pattern, "", text, flags=re.IGNORECASE)


# define a GPT chatbot class extending the base ChatBot class
class LangChainGPTBot(LangChainChatBot):
    def __init__(self, prompt_dir, history=None, original_id=None, name=""):
        super().__init__(history, original_id, name)
        self.running = False

        with open(os.path.join(prompt_dir, "chat_init.txt"), "r") as f:
            self.chat_init_prompt = f.read()
        with open(os.path.join(prompt_dir, "inventory.txt"), "r") as f:
            self.inventory_prompt = f.read()
        with open(os.path.join(prompt_dir, "room.txt"), "r") as f:
            self.room_prompt = f.read()
        with open(os.path.join(prompt_dir, "room_init.txt"), "r") as f:
            self.room_init_prompt = f.read()

        print(f"Init prompt: \n{self.chat_init_prompt}")
        print(f"Inventory prompt: \n{self.inventory_prompt}")
        print(f"Room prompt: \n{self.room_prompt}")
        print(f"Room init prompt: \n{self.room_init_prompt}")

        # Conversation chatbot
        self.chat_init_prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate.from_template(self.chat_init_prompt),
                MessagesPlaceholder(variable_name="history"),
                HumanMessagePromptTemplate.from_template("{input}"),
            ]
        )
        self.chat_llm = ChatOpenAI(temperature=0)
        self.memory = ConversationBufferMemory(return_messages=True)
        self.conversation = ConversationChain(
            memory=self.memory,
            prompt=self.chat_init_prompt,
            llm=self.chat_llm,
            verbose=True,
        )

        # Game state model
        self.analyzer_llm = OpenAI(
            model_name="text-davinci-003",
            temperature=0.9,
        )

        self.room = None
        self.room_init_prompt = PromptTemplate(
            input_variables=["ai_message"],
            template=self.room_init_prompt,
        )
        self.room_init_chain = LLMChain(
            llm=self.analyzer_llm, prompt=self.room_init_prompt
        )
        self.room_prompt = PromptTemplate(
            input_variables=["current_room", "ai_message", "human_message"],
            template=self.room_prompt,
        )
        self.room_update_chain = LLMChain(
            llm=self.analyzer_llm, prompt=self.room_prompt
        )

        self.inventory = None
        self.inventory_prompt = PromptTemplate(
            input_variables=["ai_message", "inventory", "human_message"],
            template=self.inventory_prompt,
        )
        self.inventory_update_chain = LLMChain(
            llm=self.analyzer_llm, prompt=self.inventory_prompt
        )

    def get_answer(self, user_message=None):
        if not self.running or not user_message:
            self.running = True
            user_message = "Let's start the game!"
        #     answer = self.conversation.predict(input=user_message)
        #     ai_answer = answer.split("#")[0]
        #     # update inventory directly
        #     self.inventory = answer.split("#")[1]
        #     # update room
        #     self.room = self.room_init_chain.run(ai_message=ai_answer)
        # else:
        #     prev_ai_message = self.conversation.memory.chat_memory.messages[-1]
        #     print("prev ai message", prev_ai_message)
        #     answer = self.conversation.predict(input=user_message)
        #     ai_answer = answer.split("#")[0]
        #     # update inventory directly
        #     self.inventory = answer.split("#")[1]
        #     # update room
        #     self.room = self.room_update_chain.run(
        #         {
        #             "current_room": self.room,
        #             "ai_message": prev_ai_message,
        #             "human_message": user_message,
        #         }
        #     )
        #     print(f"updated room: {self.room}")

        answer = self.conversation.predict(input=user_message)
        answers = answer.split("#")
        try:
            user_answer = ignore_ai_prefix(answers[0])
        except IndexError:
            user_answer = answer
        try:
            self.inventory = parse_bracket_content(answers[1])
        except IndexError:
            print("No inventory found")
        try:
            self.room = parse_room_name(answers[2])
        except IndexError:
            print("No room found")

        print(f"chatbot answer: {answer}")
        print(f"User answer: {user_answer}")
        print(f"Inventory: {self.inventory}")
        print(f"Room: {self.room}")

        return {
            "message": user_answer,
            "inventory": self.inventory,
            "room": self.room,
        }

    def get_memory(self):
        # access the ConversationBufferMemory object
        return self.memory

    def set_memory(self, memory):
        # can be used to continue a dialogue
        self.memory = memory
        self.conversation.memory = memory

    def reset_memory(self):
        self.memory = ConversationBufferMemory(return_messages=True)
        self.conversation.memory = self.memory
