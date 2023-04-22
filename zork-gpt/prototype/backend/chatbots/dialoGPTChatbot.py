from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from .utils import ChatBot
from dotenv import load_dotenv
import os

load_dotenv()


class DialoGPTBot(ChatBot):
    """
    DialoGPT is a simple chatbot that keeps track of the entire chat history and generates responses based on the
    entire history.
    """

    def __init__(
        self,
        history=None,
        original_id=None,
        name="",
        model_name="microsoft/DialoGPT-medium",
        device="cpu",
    ):
        super().__init__(history, original_id, name)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        if device:
            self.device = device
        else:
            self.device = "mps" if torch.backends.mps.is_available() else "cpu"
            self.device = "cuda" if torch.cuda.is_available() else self.device
        print(f"Using device {self.device}")
        self.model.to(self.device)
        self.chat_history_ids = None

    def get_answer_texts(self):
        """
        Generates a response based on the entire chat history
        """
        print(f"Calling into DialoGPT with history: {self.history}")
        if not self.history:
            return "Hello, I am your DialoGPT therapist. How are you doing?"
        if self.chat_history_ids is None:
            # chat history is empty, so this is the start of the conversation
            self.chat_history_ids = torch.zeros((1, 0)).long().to(self.device)

        # get user input
        user_input = self.history[-1]["message"]
        user_input_ids = self.tokenizer.encode(
            user_input + self.tokenizer.eos_token, return_tensors="pt"
        ).to(self.device)

        # append user input to chat history
        # bot_input_ids = torch.cat([self.chat_history_ids, user_input_ids], dim=-1)
        # print(f"bot_input_ids: {bot_input_ids}")
        # TODO: fix this, Dialo starts speaking after some messages
        bot_input_ids = user_input_ids

        # generate response
        chat_history_ids = self.model.generate(
            bot_input_ids,
            max_length=1000,
            pad_token_id=self.tokenizer.eos_token_id,
        ).to(self.device)

        # update chat history with bot response
        self.chat_history_ids = torch.cat([bot_input_ids, chat_history_ids], dim=-1)

        # extract and return bot response
        bot_response = self.tokenizer.decode(
            chat_history_ids[:, bot_input_ids.shape[-1] :][0],
            skip_special_tokens=True,
        )
        return bot_response
