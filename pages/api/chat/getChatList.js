import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req,res){
    try {
        // console.log("starting in try");
        const {user} = await getSession(req,res);
        // console.log("getting user session",user);
        const client = await clientPromise;
        // console.log("Client: ",client);
        const db = client.db();
        const chatgptConversation = await db.collection("DeepChat").find({
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