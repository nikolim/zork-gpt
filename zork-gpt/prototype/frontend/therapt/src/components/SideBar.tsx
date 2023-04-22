// components/SideBar.tsx
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { HiOutlineSelector } from 'react-icons/hi';
import { AiFillSave, AiOutlineClear } from 'react-icons/ai';
import { BiUpload, BiDownload } from 'react-icons/bi';
import { log } from "console";
import { GiCancel } from "react-icons/gi";

interface SideBarProps {
  onTabClick: (index: number) => void;
  chat_meta: {
    name: string;
    current_id: string;
    original_id: string;
  }[];
  activeTab: number;
  setChatName: (index: number, name: string) => void;
  onLoadClick: () => void;
  onDeleteClick: () => void;
  onSaveClick: (current_id: string, save_as_orig: boolean) => void;
  modelOptions: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  createNewChat: () => void;
}

// const SideBar: React.FC<SideBarProps> = ({ onTabClick }) => {
//   const [tabs] = useState(["Chat 1", "Chat 2", "Chat 3"]);

//   return (
//     <div className="flex flex-col items-center justify-start p-4 bg-374F74">
//       {/* ...existing buttons code... */}
//       <div className="mt-4 w-full">
//         {tabs.map((tab, index) => (
//           <button
//             key={index}
//             onClick={() => onTabClick(index)}
//             className="w-full text-white py-2 px-4 bg-A5C2ED mb-2 rounded-lg"
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };


const SideBar: React.FC<SideBarProps> = ({ onTabClick, chat_meta, activeTab, setChatName, onLoadClick, onDeleteClick, onSaveClick, modelOptions, selectedModel, setSelectedModel, createNewChat }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loadChatOpen, setLoadChatOpen] = useState(false);
  const [saveChatOpen, setSaveChatOpen] = useState(false);
  // const [modelOptions, setModelOptions] = useState(["select model", "model1", "model2"]);
  // const [selectedModel, setSelectedModel] = useState("select model");
  // const [chatName, setChatName] = useState('');
  const [pressedClear, setPressedClear] = useState(false);
  const [deleteNext, setDeleteNext] = useState(false);
  // const [tabs] = useState(["Chat 1", "Chat 2", "Chat 3"]);

  const handleChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(activeTab, e.target.value);
  };

  // useEffect(() => {
  //   fetchModelOptions();
  // }, []);

  // const fetchModelOptions = async () => {
  //   try {
  //     // Replace this URL with your Flask backend API endpoint
  //     const response = await axios.get('/api/models');
  //     setModelOptions(response.data);
  //   } catch (error) {
  //     console.error('Error fetching model options:', error);
  //   }
  // };

  const openSaveChat = () => {
    // axios call to save chat in the backend
    setSaveChatOpen(!saveChatOpen);
    console.log('save chat');
  };

  const saveChatUpdate = () => {
    onSaveClick(chat_meta[activeTab].current_id, true);
    setSaveChatOpen(false);
  };

  const saveChatNew = () => {
    onSaveClick(chat_meta[activeTab].current_id, false);
    setSaveChatOpen(false);
  };

  const tryDeleteChat = () => {
    console.log(chat_meta)
    if (chat_meta.length > 1) {
      onDeleteClick();
    } else {
      createNewChat();
      setDeleteNext(true);
    }
  };

  useEffect(() => {
    if (deleteNext) {
      tryDeleteChat();
      setDeleteNext(false);
    }
  }, [chat_meta]);


  const deleteChat = () => {
    // axios call to save chat in the backend
    if (pressedClear) {
      setPressedClear(false);
      tryDeleteChat();
    } else {
      setPressedClear(true);
    }
  };

  const loadChat = () => {
    // axios call to load chat from the backend
    onLoadClick();
    setLoadChatOpen(!loadChatOpen);
  };

  const handleModelSelect = (model: string) => {
    // axios call to load the AI model to use for the chat
    console.log(`Selected model: ${model}`);
    setSelectedModel(model);
    setDropdownOpen(false);
  };

  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const saveRef = useRef(null);

  useEffect(() => {
    // add event listener when component mounts
    document.addEventListener("click", handleClickOutside);

    // cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target)) {
      // user clicked outside of button, reset state here
      setPressedClear(false);
    }
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // user clicked outside of dropdown, reset state here
      setDropdownOpen(false);
    }
  };
 
  return (
    <div className="flex flex-col items-center justify-start bg-374F74">
    <div className="flex flex-col items-center justify-start p-4 w-60 bg-374F74 flex-1">
      <div className="flex items-center justify-center h-16">
        <h1 className="text-white text-6xl">TheraPT</h1>
      </div>
      <input
        value={chat_meta[activeTab].name}
        onChange={handleChatNameChange}
        className="mb-8 mt-4 w-full px-4 py-2 text-white bg-374F74 rounded-lg border border-[#A5C2ED] border-solid"
        placeholder="no name"
      />
      <div className="relative w-full">
      {
        saveChatOpen ? (
          <div className="mb-8 relative w-full">
            {
              chat_meta[activeTab].original_id!='' ? (
                <div>
                  <button
                    onClick={saveChatUpdate}
                    className="mb-4 text-white bg-red-800 rounded-lg w-full h-10"
                  >
                    overwrite original <BiDownload size={22} className='float-right mr-2'/>
                  </button>
                </div>
              ) : (
                <div></div>
              )
            }
            <button
              onClick={saveChatNew}
              className="text-white mb-4 bg-red-800 rounded-lg w-full h-10"
            >
              save as new <BiDownload size={22} className='float-right mr-2'/>
            </button>
            <button
              onClick={() => setSaveChatOpen(!saveChatOpen)}
              className="text-white bg-A5C2ED rounded-lg w-full h-10"
            >
              cancel save <GiCancel size={22} className='float-right mr-2'/>
            </button>
          </div>
        ) : (
          <div className="mb-8 relative w-full">
            <button
              onClick={openSaveChat}
              className=" text-white bg-A5C2ED rounded-lg w-full h-10"
            >
              save chat as ... <BiDownload size={22} className='float-right mr-2'/>
            </button>
          </div>
        )
      }
      </div>
      { loadChatOpen ? (
        <div className="mb-8 relative w-full">
          <button
            onClick={loadChat}
            className=" text-white bg-red-800 rounded-lg w-full h-10"
          >
            close <BiUpload size={22} className='float-right mr-2'/>
          </button>
        </div>
      ) : (
        <div className="mb-8 relative w-full">
          <button
            onClick={loadChat}
            className=" text-white bg-A5C2ED rounded-lg w-full h-10"
          >
            new or load chat <BiUpload size={22} className='float-right mr-2'/>
          </button>
        </div>
      )
      }
      <div className="mb-8 relative w-full">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full text-white bg-A5C2ED rounded-lg h-10"
          ref={dropdownRef}
        >
          {selectedModel} <HiOutlineSelector size={22} className='float-right mr-2'/>
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 mt-2 w-full bg-white rounded-lg shadow-md border-2 border-[#A5C2ED]">
            {modelOptions.map((model: string) => (
              <button
                key={model}
                onClick={() => handleModelSelect(model)}
                className="block w-full text-left px-4 py-2 text-black hover:bg-A5C2ED/50 rounded-lg"
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="overflow-auto h-full w-full mb-4">
        {chat_meta.map((chat, index) => (
          index === activeTab ? (
            <button
              key={index}
              onClick={() => onTabClick(index)}
              className="w-full py-2 mb-2 text-white bg-A5C2ED/50 rounded-lg border border-[#A5C2ED] border-solid h-10"
            >
              <div className="w-full max-w-full overflow-ellipsis whitespace-nowrap">
              {/* up to length 20 */}
              {chat.name.slice(0, 20)}
              </div>
            </button>
          ) : (
            <button
              key={index}
              onClick={() => onTabClick(index)}
              className="w-full py-2 mb-2 text-white bg-374F74 rounded-lg border border-[#A5C2ED] border-solid h-10"
            >
              <div className="w-full max-w-full overflow-ellipsis whitespace-nowrap">
                {/* up to length 20 */}
                {chat.name.slice(0, 20)}
              </div>
            </button>
          )
        ))}
      </div>
      <div className="mt-auto text-white w-full">
        {/* <button
          onClick={clearChat}
          className=" text-white bg-A5C2ED rounded-lg w-full h-10"
        >
            {pressedClear ? "confirm to clear" : "clear chat"} <AiOutlineClear size={22} className='float-right mr-2'/>
        </button> */}
        {pressedClear ? (
          <button onClick={deleteChat} ref={buttonRef} className="text-white bg-red-800 rounded-lg w-full h-10">
            confirm to clear <AiOutlineClear size={22} className='float-right mr-2'/>
          </button>
        ) : (
          <button onClick={deleteChat} className="text-white bg-A5C2ED rounded-lg w-full h-10">
            delete chat <AiOutlineClear size={22} className='float-right mr-2'/>
          </button>
        )}
      </div>
    </div>
    </div>
  );
};

export default SideBar;




