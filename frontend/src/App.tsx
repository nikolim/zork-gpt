import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/Header';
import Terminal from './components/Terminal';
import UserInput from './components/UserInput';
import { Conversation, Message } from './custom_types';

import axios from 'axios';


const baseUrl = 'http://flask-env.eba-3gituzjt.us-east-2.elasticbeanstalk.com/'

function App() {
  const [conversation, setConversation] = useState<Conversation>({id: uuidv4(), messages: [{type: 'zork-gpt', text: 'Welcome to zork-gpt!'}]});
  const [inventory, setInventory] = useState<[]>([]);
  const [room, setRoom] = useState<string>("");

  const createChat = async (id: string) => {
    try {
        const url = baseUrl + 'api/create_chat';
      //   const data = {
      //     key1: 'value1',
      //     key2: 'value2',
      //   };
        const data = {id: id, model_name: "langchain GPT Chatbot"}
    
        const response = await axios.post(url, data);
        const new_messages : Message =  {type: 'zork-gpt', text: response.data.message};
        const appendMessages = [...conversation.messages, new_messages];
        setConversation({id: id, messages: appendMessages});
        setRoom(response.data.room);
        setInventory(response.data.inventory);
        // Handle the response data as needed
      } catch (error) {
        console.error('Error sending data:', error);
      }
    };

    useEffect(() => {
      createChat(conversation.id);
    }, []);

  const send_user_message = async (id: string, message: Message) => {
    let appendMessages = [...conversation.messages, message];
    setConversation({id: id, messages: appendMessages});
    // request answer from the backend
    console.log(message);
    try {
        const response = await axios.post(baseUrl + 'api/request_answer', {id: id, message: message.text});
        if (response.status === 200) {
            const new_messages : Message =  {type: 'zork-gpt', text: response.data.message};
            console.log("getting asnwer:", new_messages);
            appendMessages = [...appendMessages, new_messages];
            setRoom(response.data.room);
            setInventory(response.data.inventory);
        } else {
            console.error(`Error fetching chat response: ${response.status}`);
        }
        // append the response to the chats array
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    setConversation({id: id, messages: appendMessages});
  };


  const getLocation = () => {
    return room;
  };

  const getInventory = () => {
    return inventory.toString();
  };

  const sendMsg = (msg: Message) => {
    send_user_message(conversation.id, msg);  
  };
  

  return (
    <div className="App">
      <Header location={getLocation()} inventory={getInventory()} />
      <Terminal conversation={conversation}/>
      <UserInput sendMsg={sendMsg}/>
    </div>
  );
}

export default App;