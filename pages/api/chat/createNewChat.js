import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req,res){
    try {
        const {user} = await getSession(req,res);
        const {message} = req.body;
        const newUserMessage = {
            role: "user",
            content: message,
        }
        const client = await clientPromise;
        const db = client.db("DeepsolvChatbots");
        const chatgptConversation = await db.collection("ChatgptConversations").insertOne({
            userId: user.sub,
            messages: [newUserMessage],
            title: message
        })
        res.status(200).json({
            _id: chatgptConversation.insertedId.toString(),
            messages: [newUserMessage],
            title: message,
        })
    } catch (error) {
        res.status(500).json({message: "An error occurred while creating a new chat"})
        console.log("Error occurred in create new chat: ",  error);
    }
}