// components/Layout.tsx
import React, { useState, useEffect } from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import ChatArea from './ChatArea';
import LoadChatSideBar from './LoadChatSideBar';


import axios from 'axios';


const Layout: React.FC = () => {
  const [chats, setChats] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loadChat, setLoadChat] = useState(false);
  const [chat_meta, setChatMeta] = useState({});
  const [modelOptions, setModelOptions] = useState(["select model", "model1", "model2"]);
  const [selectedModel, setSelectedModel] = useState("select model");

    // Add the get_chat_ids function inside your component
    const get_chat_ids = async () => {
        try {
        const response = await axios.get('http://127.0.0.1:5000/api/get_chat_ids');
        if (response.status === 200) {
            const chatIds = response.data;
            // Do something with the chatIds, e.g., update your component state
            // console.log(chatIds);
            setChatMeta(chatIds);
        } else {
            console.error(`Error fetching chat IDs: ${response.status}`);
        }
        } catch (error) {
        console.error(`Error fetching chat IDs: ${error}`);
        }
    };

    const set_model = async (model: string) => {
      setSelectedModel(model);
      try {
          const url = 'http://127.0.0.1:5000/api/set_model'
          const data = {model: model, current_id: chats[activeTab].current_id}
          const response = await axios.post(url, data);
          const new_messages = response.data.messages;
          const newChats = [...chats];
          newChats[activeTab].messages.push(...new_messages);
          setChats(newChats);
      } catch (error) {
          console.error('Error sending data:', error);
      }
    };

    const create_chat = async () => {
        try {
          const url = 'http://127.0.0.1:5000/api/create_chat';
        //   const data = {
        //     key1: 'value1',
        //     key2: 'value2',
        //   };
          const data = {model: selectedModel}
      
          const response = await axios.post(url, data);
          const new_chat = response.data;
          // const current_id = response.data.current_id;
          // Handle the response data as needed
          // console.log(current_id);
          setChats([...chats, {current_id: new_chat.current_id, original_id: '', name: new_chat.name, messages: new_chat.messages}]);
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

    const createChatBasedOnId = async (origin_id: number) => {
      try {
          const url = 'http://127.0.0.1:5000/api/create_chat';
        //   const data = {
        //     key1: 'value1',
        //     key2: 'value2',
        //   };
          const data = {original_id: origin_id, model: selectedModel}
      
          const response = await axios.post(url, data);
          const new_chat = response.data;
          // print the type of new_chat.messages
          console.log(typeof(new_chat.messages));
          // console.log(new_chat.messages);
          // Handle the response data as needed
          setChats([...chats, {current_id: new_chat.current_id, original_id: new_chat.original_id, name: new_chat.name, messages: new_chat.messages}]);
        } catch (error) {
          console.error('Error sending data:', error);
        }
      };

    const append_user_message = async (current_id: string, message: string) => {
        // append the message to the chats array
        const newChats = [...chats];
        const index = newChats.findIndex((chat) => chat.current_id === current_id);
        console.log(message)
        console.log(index)
        const new_id = newChats[index].messages.length;
        newChats[index].messages.push({sender: 'user', message: message, id: new_id});
        setChats(newChats);
        // send the message to the backend
        try {
            const url = 'http://127.0.0.1:5000/api/submit_message';
            const data = {current_id: current_id, message: message, sender: 'user', id: new_id};
            const response = await axios.post(url, data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
        // get the response from the backend
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/request_answer', {params: {current_id: current_id}});
            if (response.status === 200) {
                const new_messages = response.data;
                console.log("getting asnwer:", new_messages);
                const newChats = [...chats];
                const index = newChats.findIndex((chat) => chat.current_id === current_id);
                newChats[index].messages.push(...new_messages);
                setChats(newChats);
            } else {
                console.error(`Error fetching chat response: ${response.status}`);
            }
            // append the response to the chats array
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const save_chat = async (current_id: string, save_as_orig: boolean) => {
        try {
            const url = 'http://127.0.0.1:5000/api/save_chat';
            const data = {current_id: current_id, save_as_original: save_as_orig, name: chats[activeTab].name};
            const response = await axios.post(url, data);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };
        
    const get_models = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/get_models');
          if (response.status === 200) {
            const models = response.data;
                // Do something with the chatIds, e.g., update your component state
              console.log(models);
              setModelOptions(models);
          } else {
            console.error(`Error fetching chat IDs: ${response.status}`);
          }
        } catch (error) {
          console.error(`Error fetching chat IDs: ${error}`);
      }
    };
        
    
    const delete_chat = (index: number) => {
        const newChats = [...chats];
        newChats.splice(index, 1);
        setChats(newChats);
        setActiveTab(0);
    };


  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  const setChatName = (index: number, name: string) => {
    const newChats = [...chats];
    newChats[index].name = name;
    setChats(newChats);
    };
  
  useEffect(() => {
    create_chat();
    get_models();
    }, []);

  useEffect(() => {
    console.log("chat length is", chats.length);
  }, [chats]);

  return (
    <div className="flex flex-col h-screen bg-edf3fb bg-A5C2ED/20">
      {/* <TopBar /> */}
      <div className="flex flex-grow max-h-[100vh]">
        {
            chats.length > 0 ? (
                <SideBar onTabClick={handleTabClick} 
                chat_meta={chats.map(
                    (chat) => {
                        return {
                            name: chat.name,
                            current_id: chat.current_id,
                            original_id: chat.original_id,
                        }
                    }
                )} 
                // chat_meta={chats}
                activeTab={activeTab} 
                setChatName={setChatName}
                onLoadClick={() => {
                    get_chat_ids();
                    setLoadChat(!loadChat);
                }}
                onDeleteClick={() => delete_chat(activeTab)}
                onSaveClick={save_chat}
                modelOptions={modelOptions}
                selectedModel={selectedModel}
                setSelectedModel={set_model}
                createNewChat={() => create_chat()}
              />
            ) : null
        }
        
        {
            loadChat ? (
                <LoadChatSideBar 
                onTabClick={
                    (index: number) => {
                        createChatBasedOnId(Object.keys(chat_meta)[index]);
                    }
                } 
                // onTabClick={handleTabClick}
                // onNewClick={() => setChats([...chats, {current_id: 'c', name: '', messages: []}])}
                onNewClick={() => create_chat()} 
                loadable_chats_meta={Object.keys(chat_meta).map(
                    (chat_id) => {
                        return {
                            name: chat_meta[chat_id],
                            original_id: chat_id,
                        }
                    }
                )}
            />
            ) : null
        }
        {
            chats.length > 0 ? (
                <ChatArea activeTab={activeTab} chats={chats} addMessage={append_user_message}/>
            ) : null
        }
      </div>
    </div>
  );
};

export default Layout;