import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/Header';
import Terminal from './components/Terminal';
import UserInput from './components/UserInput';
import { Conversation, Message } from './custom_types';

import axios from 'axios';


function App() {
  const [conversation, setConversation] = useState<Conversation>({id: uuidv4(), messages: [{type: 'zork-gpt', text: 'Welcome to zork-gpt!'}]});

  const createChat = async (id: string) => {
    try {
        const url = 'http://127.0.0.1:5000/api/create_chat';
      //   const data = {
      //     key1: 'value1',
      //     key2: 'value2',
      //   };
        const data = {id: id, model_name: "DialoGPT Chatbot"}
    
        const response = await axios.post(url, data);
        const new_messages : Message =  {type: 'zork-gpt', text: response.data[0].message};
        const appendMessages = [...conversation.messages, new_messages];
        setConversation({id: id, messages: appendMessages});
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
    // send the message to the backend
    try {
        const url = 'http://127.0.0.1:5000/api/submit_message';
        const data = {id: id, message: message.text, sender: 'user'};
        const response = await axios.post(url, data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
    // get the response from the backend
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/request_answer', {params: {id: id}});
        if (response.status === 200) {
            const new_messages : Message =  {type: 'zork-gpt', text: response.data[0].message};
            console.log("getting asnwer:", new_messages);
            appendMessages = [...appendMessages, new_messages];
            
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
    return "Mansion ground floor"
  };

  const getInventory = () => {
    return "flashlight, lighter"
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