class ChatBot:
    def __init__(self, history=None, original_id=None, name=""):
        self.history = history or []
        self.original_id = original_id
        self.name = name

    def append_message(self, message_string, sender="user"):
        message = {
            "id": len(self.history),
            "message": message_string,
            "sender": sender,
        }
        self.history.append(message)

    def get_answer(self):
        message_strings = self.get_answer_texts()
        if type(message_strings) == str:
            message_strings = [message_strings]
        messages = [
            {
                "id": len(self.history),
                "message": message_string,
                "sender": "AI",
            }
            for message_string in message_strings
        ]
        for message in messages:
            self.append_message(message["message"], sender=message["sender"])
        return messages

    def get_answer_texts(self):
        """
        Implement this method in your chatbot class!
        Your logic to generate the answers based on internal state and history
        You can give back multiple answers as a list of strings.
        """
        if len(self.history) == 0:
            return []
        return "Hello, I am a default chatbot. Please select a model to start a conversation."


class LangChainChatBot:
    def __init__(self, history=None, original_id=None, name=""):
        self.history = history or []
        self.original_id = original_id
        self.name = name

    def get_answer(self, user_message):
        pass

    def get_memory(self):
        pass

    def set_memory(self, memory):
        pass
