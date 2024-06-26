import { faLightbulb, faMessage, faPlus, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link"
import { useEffect, useState } from "react"

export const ChatSidebar = ({chatId}) => {

    const [chatList,setChatList] = useState([]);

    useEffect(() => {
        const loadChatList = async () => {
            const response = await fetch('/api/chat/getChatList',{
                method: 'POST',
            });
            const json = await response.json();
            // console.log("Chat list: ",json);
            setChatList(json?.chatgptConversations || []);
        }
        loadChatList();
    },[chatId]);

    return (<div className="bg-gray-900 text-white flex flex-col overflow-hidden">
        <Link href='/chat' className="side-menu-item bg-emerald-500 hover:bg-emerald-600"><FontAwesomeIcon icon={faPlus} /> New Chat</Link>
        <div className="flex-1 overflow-auto bg-gray-950">
            {
                chatList.map(chat => (
                    <Link key={chat.id} href={`/chat/${chat.id}`} className={`side-menu-item ${chatId === chat.id && "bg-gray-700 hover:bg-gray-700"}`}><FontAwesomeIcon icon={faMessage} /> <span title={chat.title} className="overflow-hidden text-ellipsis whitespace-nowrap">{chat.title}</span></Link>
                ))
            }
        </div>
        <Link href='/agent' className="side-menu-item bg-emerald-500 hover:bg-emerald-600"><FontAwesomeIcon icon={faLightbulb} />
            DeepAgent
        </Link>
        {/* <Link href='http://34.42.153.11:8000/#form' className="side-menu-item bg-emerald-500">DeepAgent</Link> */}
        <Link href='/api/auth/logout' className="side-menu-item hover:bg-emerald-500"><FontAwesomeIcon icon={faRightFromBracket} /> Logout</Link>
    </div>)
}