import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import {ObjectId} from 'mongodb'

export default async function handler(req,res){
    try {
        const {user} = getSession();
        const client = clientPromise;
        const db = client.db();
        const {chatId, userMessage,generatedLogs,report} = req.body;
        const messagesToAdd = [
            {
                role: 'user',
                content: {
                    type: 'text',
                    content: userMessage
                } 
            },
            {
                role: 'assistant',
                content: {
                    type: 'logs',
                    content: generatedLogs
                } 
            },
            {
                role: 'assistant',
                content: {
                    type: 'report',
                    content: report
                } 
            },
        ]
        const chat = db.collection("DeepAgent").findOneAndUpdate({
            _id: new ObjectId(chatId),
            userId: user.sub
        },{
            $push: {$each: messagesToAdd}
        },{
            returnDocument: "after" 
        })

        res.status(200).json({
            chat: {
                ...chat.value,
                _id: chat.value._id.toString(),
            } 
        })
    } catch (error) {
        res.status(500).json({message: "Error while adding to existing chat"})
        console.log("Error while adding to existing chat: ",error);
    }
}