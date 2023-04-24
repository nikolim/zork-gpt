from .utils import LangChainChatBot
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
    def __init__(self, history=None, original_id=None, name=""):
        super().__init__(history, original_id, name)
        self.start_prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessagePromptTemplate.from_template(
                    "The following is a friendly conversation between a human and a AI psychotherapist that offers Rogerian psychotherapy. The AI psychotherapist is caring about the human client, asking questions about their problems, and tries to make the client find solutions to their problems. If the AI does not know the answer to a question, it truthfully says it does not know. The AI therapist uses a scratchpad in its outputs to take notes. Information about the client on the scratchpad is formatted at the end of the message with python comments, namely with a # at the beginning of each line. \nExample: \nClient: Hi my name is John and my girlfriend broke up.\n# client's name: John\n# cause: girlfriend broke up."
                ),
                MessagesPlaceholder(variable_name="history"),
                HumanMessagePromptTemplate.from_template("{input}"),
            ]
        )
        self.llm = ChatOpenAI(temperature=0)
        self.memory = ConversationBufferMemory(return_messages=True)
        self.conversation = ConversationChain(
            memory=self.memory, prompt=self.start_prompt, llm=self.llm, verbose=True
        )

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
