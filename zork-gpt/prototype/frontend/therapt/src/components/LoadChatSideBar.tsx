// components/SideBar.tsx
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import { HiOutlineSelector } from 'react-icons/hi';
import { AiFillSave, AiOutlineClear } from 'react-icons/ai';
import { BiUpload, BiDownload } from 'react-icons/bi';
import { MdOutlineCreate } from 'react-icons/md';

interface LoadChatSideBarProps {
  onTabClick: (index: number) => void;
  onNewClick: () => void;
  loadable_chats_meta: {
    name: string;
    original_id: string;
  }[];
}


const SideBar: React.FC<LoadChatSideBarProps> = ({ onTabClick, onNewClick, loadable_chats_meta }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modelOptions, setModelOptions] = useState(["select model", "model1", "model2"]);
  const [selectedModel, setSelectedModel] = useState("select model");
  const [pressedClear, setPressedClear] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start bg-374F74">
    <div className="flex flex-col items-center justify-start p-4 w-60 bg-374F74">
      <div className="mb-8 mt-0 relative w-full mx-4">
        <button
          onClick={onNewClick}
          className=" text-white bg-A5C2ED rounded-lg w-full h-10"
        >
          create new chat <MdOutlineCreate size={22} className='float-right mr-2'/>
        </button>
      </div>
      <div className="overflow-auto h-full mb-4 flex flex-col w-full mx-4">
        {loadable_chats_meta.map((chat, index) => (
          <button
            key={index}
            onClick={() => onTabClick(index)}
            className="w-full py-2 mb-2 text-white bg-374F74/100 rounded-lg border border-[#A5C2ED] border-solid h-10"
          >
            <div className="w-full max-w-full overflow-ellipsis whitespace-nowrap">
              {/* up to length 20 */}
              {chat.name.slice(0, 20)}
            </div>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
};

export default SideBar;




