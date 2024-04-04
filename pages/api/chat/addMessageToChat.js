import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req,res){
    try {
        const {user} = await getSession(req,res);
        const client = await clientPromise;
        const db = client.db("DeepsolvChatbots");

        const {chatId,role,content} = req.body;
        const chatgptConversation = await db.collection("ChatgptConversations").findOneAndUpdate({
            _id: new ObjectId(chatId),
            userId: user.sub
        },{
            $push: {
                messages: {
                    role,
                    content
                }
            }
        },{returnDocument: "after"})

        res.status(200).json({
            chatgptConversation: {
                ...chatgptConversation.value,
                _id: chatgptConversation.value._id.toString(),
            }
        })
    } catch (error) {
        res.status(500).json({message: "Error occurred while adding message to a chat"});
        console.log("Error while adding message to chat: ", error);
    }
}