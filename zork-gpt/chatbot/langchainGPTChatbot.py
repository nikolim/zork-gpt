from utils import LangChainChatBot
import openai
from dotenv import load_dotenv
import os
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain.chains import ConversationChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


# define a GPT chatbot class extending the base ChatBot class
class LangChainGPTBot(LangChainChatBot):
    def __init__(self, prompt_dir, history=None, original_id=None, name=""):
        super().__init__(history, original_id, name)
        with open(os.path.join(prompt_dir, "init.txt"), "r") as f:
            init_prompt = f.read()

        self.start_prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate.from_template(init_prompt),
                MessagesPlaceholder(variable_name="history"),
                HumanMessagePromptTemplate.from_template("{input}"),
            ]
        )
        self.llm = ChatOpenAI(temperature=0)
        self.memory = ConversationBufferMemory(return_messages=True)
        self.conversation = ConversationChain(
            memory=self.memory, prompt=self.start_prompt, llm=self.llm, verbose=True
        )

    def start_game(self):
        return self.get_answer("")

    def get_answer(self, user_message):
        return self.conversation.predict(input=user_message)

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
