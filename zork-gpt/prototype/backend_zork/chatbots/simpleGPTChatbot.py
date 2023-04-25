from .utils import ChatBot
import openai
import os
openai.api_key = ""


# define a GPT chatbot class extending the base ChatBot class
class SimpleGPTBot (ChatBot):
    def __init__(self, history=None, original_id=None, name=''):
        super().__init__(history, original_id, name)

    def _convert(self, history):
        return [
            {
                "role": "user" if message["sender"] == "user" else "assistant",
                "content": message["message"],
            }
            for message in history
        ]

    def get_answer_texts(self):
        # Note: you need to be using OpenAI Python v0.27.0 for the code below to work

        messages=[
                    {"role": "system", "content": "You are a helpful chat assistant to the user in the domain mental health. If the topic strays away, come back to mental health. Focus on asking the right questions and be very careful in giving premature advice. Write rather short messages when applicable. Try to focus on the user's feelings."},
                    {"role": "user", "content": "Hi."},
                    *self._convert(self.history)
                ]
        print(messages)
        completion = openai.ChatCompletion.create(
            model="gpt-4",
            messages = messages,
            max_tokens=256,
        )
        message_string = completion.choices[0].message.content
        return message_string

    



