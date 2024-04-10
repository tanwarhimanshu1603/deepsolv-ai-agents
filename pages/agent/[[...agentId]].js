import { getSession } from "@auth0/nextjs-auth0";
import { AgentMessage } from "components/AgentMessage";
import {AgentSidebar} from "components/AgentSidebar";
import clientPromise from "lib/mongodb";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import {v4 as uuid} from 'uuid'
import {ObjectId} from 'mongodb'


export default function AgentPage({agentId,title,messages=[]}){

    // console.log("Content from id: ", messages);

    const [newChatId,setNewChatId] = useState(null);
    const [messageText,setMessageText] = useState("");
    const [reportType,setReportType] = useState("research_report");
    const [incomingLogs,setIncomingLogs] = useState("");
    const [report,setReport] = useState("");
    // const [fullMessage,setFullMessage] = useState([]);
    const [newAgentMessages,setNewAgentMessages] = useState([]);
    // const [allMessages,setAllMessages] = useState([]);
    const [reportPdfPath,setReportPdfPath] = useState("");
    const router = useRouter();

    useEffect(() => {
        setNewAgentMessages([]);
        setNewChatId(null);
    },[agentId])


    useEffect(() => {
        if(newChatId){
            setNewChatId(null);
            router.push(`/agent/${newChatId}`);
        }
    },[newChatId,reportPdfPath,router])

    // console.log("Incoming logs: ",incomingLogs);
    // console.log("Report: ",report);
    const handleStreamEnd = async () => {
        const message = newAgentMessages[newAgentMessages.length-1].content.content;
        // console.log("this is a good day.", message, incomingLogs, report);
        if(agentId){
            const existingChat = await fetch(`/api/agent/addMessageToExistingChat`,{
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({chatId: agentId,userMessage: message,generatedLogs:incomingLogs, report: report}),
            });
            const existingChatData = await existingChat.json();
            if(!existingChatData){
                console.log("returned no data");
                return;
            }
            // console.log("Existing Data stored is: ", existingChatData);
            const newMessages = existingChatData.chat.messages.slice(-3);
            // console.log("New messages: ", newMessages);
            // setFullMessage(newMessages);
            setNewAgentMessages(newMessages);
        }else{
            const newChat = await fetch(`/api/agent/saveData`,{
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({userMessage: message,generatedLogs:incomingLogs, report: report}),
            });
            const newChatData = await newChat.json();
            if(!newChatData){
                console.log("returned no data");
                return;
            }
            // console.log("New Data stored is: ", newChatData);
            setNewChatId(newChatData._id);
        }
        setIncomingLogs("");
        setReport("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(messageText.length === 0)return;
        const message = messageText;
        const report_type = reportType;
        setMessageText("");
        setReportType("research_report");

        setNewAgentMessages((prev) => {
            const newChatMessages = [
                ...prev,
                {
                    _id: uuid(),
                    role: 'user',
                    content: {
                        type: 'text',
                        content: message
                    },
                }
            ]
            return newChatMessages;
        })
        // Getting data from Websockets
        const socket = new WebSocket('ws://34.42.153.11:8000/ws');

        socket.addEventListener('open',(event) => {
            console.log("WebSocket connection established.");
            socket.send(`start {"task":"${message}","report_type":"${report_type}"}`);
        })

        socket.addEventListener('message',(event) => {
            const data = JSON.parse(event.data);
            // console.log("data: ",data);
            if(data.type === "logs"){
                setIncomingLogs(prev => prev + data.output);
            }else if(data.type==="path"){
                setReportPdfPath(data.output.pdf);
                // handleStreamEnd(message);
                socket.close();
            }else{
                setReport(prev => prev + data.output);
            }
        })
    }

    useEffect(() => {
        if(reportPdfPath){
            handleStreamEnd();
        }
    },[reportPdfPath]);


    const allMessages = [...messages, ...newAgentMessages];
    // console.log("All: ",allMessages);

    return (
        <div>
            <Head>
                <title>DeepAgent Messages</title>
            </Head>
            <div className="grid h-screen grid-cols-[260px_1fr]">
                <AgentSidebar chatId={agentId}/>
                <div className="bg-gray-700 flex flex-col overflow-hidden">
                    <div className="flex-1 text-white overflow-scroll no-scrollbar">
                        {allMessages.length === 0 ? <AgentMessage role='assistant' content='What would you like to research on today?' /> : allMessages.map(message => (
                            <AgentMessage key={uuid()} role={message.role} content={message.content.content} />
                        ))}
                        {
                            !!incomingLogs && <AgentMessage role="assistant" content={incomingLogs} />
                        }
                        {
                            !!report && <AgentMessage role="assistant" content={report} />
                        }
                        
                    </div>
                    <footer className="bg-gray-800 p-10">
                        <form onSubmit={handleSubmit}>
                            <fieldset className="flex gap-2">
                                <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} className="w-full h-[50px] resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-400 focus:bg-gray-600 focus:outline focus:outline-emerald-500" placeholder="Send a message..."/>
                                <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="rounded-md bg-emerald-300 px-2 focus:outline-none" required>
                                    <option value="research_report">Summary - Short and fast (~2 min)</option>
                                    <option value="detailed_report">Detailed - In depth and longer (~5 min)</option>
                                </select>
                                <button type="submit" className="btn">Submit</button>
                            </fieldset>
                        </form>
                    </footer>
                </div>
            </div>
        </div>
    );
}


export const getServerSideProps = async (context) => {
    const agentId = context.params?.agentId?.[0] || null;
    // console.log("context: ",agentId);
    if(agentId){
        const {user} = await getSession(context.req,context.res);
        const client = await clientPromise;
        const db = client.db();
        const collection = await db.collection("DeepAgent").findOne({
            userId: user.sub,
            _id: new ObjectId(agentId)
        })
        return {
            props: {
                agentId,
                title: collection.title,
                messages: collection.messages || []  // Ensure messages array is not undefined
            },
        }
    }
    return {
        props: {}
    }
}
