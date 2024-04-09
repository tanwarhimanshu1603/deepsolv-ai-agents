import { getSession } from "@auth0/nextjs-auth0";
import { ChatSidebar } from "components/ChatSidebar";
import { ChatMessage } from "components/ChatMessage";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";
import Head from "next/head";
import { useRouter } from "next/router";
import { streamReader } from "openai-edge-stream";
import { useEffect, useState } from "react";
import {v4 as uuid} from 'uuid'

export default function ChatPage({chatId,title, messages = []}){
    // console.log("title", title, messages);
    const [newChatId,setNewChatId] = useState(null)
    const [incomingMessage,setIncomingMessage] = useState("");
    const [messageText,setMessageText] = useState("");
    const [newChatMessages, setNewChatMessages] = useState([]);
    const [generatingResponse,setGeneratingResponse] = useState(false);
    const [fullMessage,setFullMessage] = useState("");
    const router = useRouter();

    // when our route is changing
    useEffect(() => {
        setNewChatMessages([]);
        setNewChatId(null);
    },[chatId]);

    // save new message to existing chat
    useEffect(() => {
        if(!generatingResponse && fullMessage){
            setNewChatMessages(prev => [...prev,{
                _id: uuid(),
                role: "assistant",
                content: fullMessage
            }])
            setFullMessage("")
        }
    },[generatingResponse,fullMessage])

    // if we created a new chat
    useEffect(() =>{
        if(!generatingResponse && newChatId){
            setNewChatId(null);
            router.push(`/chat/${newChatId}`);
        }
    },[newChatId,generatingResponse,router])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(messageText.length === 0)return;
        setGeneratingResponse(true);
        setNewChatMessages((prev) => {
            const newChatMessages = [
                ...prev,
                {
                    _id: uuid(),
                    role: 'user',
                    content: messageText,
                }
            ]
            return newChatMessages;
        })
        setMessageText(""); 
        // console.log("message text", messageText);
        const response = await fetch(`/api/chat/sendMessage`,{
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({chatId,message: messageText})
        });
        const data = response.body;
        if(!data){
            console.log("returned no data");
            return;
        }
        const reader = data.getReader();
        let content = "";
        await streamReader(reader, async (message) => {
            // console.log("Message from gpt: ", message);
            if(message.event === "newChatId"){
                setNewChatId(message.content)
            }else{
                setIncomingMessage((prev) => `${prev}${message.content}`);
                content = content + message.content;
            }
        })
        setFullMessage(content)
        setIncomingMessage("")
        setGeneratingResponse(false);
    }

    const allMessages = [...messages,...newChatMessages];

    return (
        <div>
            <Head>
                <title>DeepChat Messages</title>
            </Head>
            <div className="grid h-screen grid-cols-[260px_1fr]">
                <ChatSidebar chatId={chatId} />
                <div className="bg-gray-700 flex flex-col overflow-hidden">
                    <div className="flex-1 text-white overflow-scroll no-scrollbar">
                        {allMessages.length === 0 ? <ChatMessage role='assistant' content='Hello there, How can I assisst you today?' /> : allMessages.map(message => (
                            <ChatMessage key={message._id} role={message.role} content={message.content} />
                        ))}
                        {
                            !!incomingMessage && <ChatMessage role='assistant' content={incomingMessage} />
                        }
                    </div>
                    <footer className="bg-gray-800 p-10">
                        <form onSubmit={handleSubmit}>
                            <fieldset disabled={generatingResponse} className="flex gap-2">
                                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} className="w-full h-[50px] resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-400 focus:bg-gray-600 focus:outline focus:outline-emerald-500" placeholder={`${generatingResponse ? "Generating response..." : "Send a message..."}`}/>
                                <button type="submit" className="btn">Submit</button>
                            </fieldset>
                        </form>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps = async (context) => {
    const chatId = context.params?.chatId?.[0] || null;
    if(chatId){
        const {user} = await getSession(context.req,context.res);
        const client = await clientPromise;
        const db = client.db();
        const chatgptConversation = await db.collection("DeepChat").findOne({
            userId: user.sub,
            _id: new ObjectId(chatId)
        })
        return {
            props: {
                chatId,
                title: chatgptConversation.title,
                messages: chatgptConversation.messages.map(message => ({
                    ...message,
                    _id: uuid(),
                }))
            },
        }
    }
    return {
        props: {}
    }
    
}