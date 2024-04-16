// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";

// export default async function handler(req,res){
//     try {
//         // console.log("starting in try");
//         const {user} = await getSession(req,res);
//         // console.log("getting user session",user);
//         const client = await clientPromise;
//         // console.log("Client: ",client);
//         const db = client.db();
//         const chatgptConversation = await db.collection("DeepAgent").find({
//             userId: user.sub
//         },{
//             projection: {
//                 userId: 0,
//                 messages: 0
//             }
//         }).sort({
//             _id: -1
//         }).toArray();
//         res.status(200).json({chatgptConversation});
//     } catch (error) { 
//         res.status(500).json({message: "Error getting chat list"});
//         console.log("Error getting chat list: ", error);
//     }
// }

import { getSession } from "@auth0/nextjs-auth0";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "lib/firebaseConfig"

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);

        // Create a query to get chat conversations for the user
        const q = query(collection(db, "DeepAgent"), where("userId", "==", user.sub));

        // Execute the query and retrieve the chat conversations
        const querySnapshot = await getDocs(q);
        
        // Convert the query snapshot to an array of chat conversations
        const chatgptConversation = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            chatgptConversation.push({
                id: doc.id,
                title: data.title,
                // Add other fields as needed
            });
        });

        // Return the chat conversations in the response
        res.status(200).json({ chatgptConversation });
    } catch (error) {
        console.log("Error getting chat list: ", error);
        res.status(500).json({ message: "Error getting chat list" });
    }
}
