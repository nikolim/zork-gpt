export type Message = {
    type: 'user' | 'zork-gpt';
    text: string;
  };
export type Conversation = {
    id: string;
    messages: Message[];
}