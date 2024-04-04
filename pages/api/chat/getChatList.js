import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req,res){
    try {
        const {user} = await getSession(req,res);
        const client = await clientPromise;
        const db = client.db("DeepsolvChatbots");
        const chatgptConversation = await db.collection("ChatgptConversations").find({
            userId: user.sub
        },{
            projection: {
                userId: 0,
                messages: 0
            }
        }).sort({
            _id: -1
        }).toArray();
        res.status(200).json({chatgptConversation});
    } catch (error) { 
        res.status(500).json({message: "Error getting chat list"});
        console.log("Error getting chat list: ", error);
    }
}