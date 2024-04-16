// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";
// import { ObjectId } from "mongodb";

// export default async function handler(req,res){
//     try {
//         const {user} = await getSession(req,res);
//         const {chatId,role,content} = req.body;
        
//         const client = await clientPromise;
//         const db = client.db();
        
//         const chatgptConversation = await db.collection("DeepChat").findOneAndUpdate({
//             _id: new ObjectId(chatId),
//             userId: user.sub
//         },{
//             $push: {
//                 messages: {
//                     role,
//                     content
//                 }
//             }
//         },{returnDocument: "after"})

//         res.status(200).json({
//             chatgptConversation: {
//                 ...chatgptConversation.value,
//                 _id: chatgptConversation.value._id.toString(),
//             }
//         })
//     } catch (error) {
//         res.status(500).json({message: "Error occurred while adding message to a chat"});
//         console.log("Error while adding message to chat: ", error);
//     }
// }

import { getSession } from "@auth0/nextjs-auth0";
import db from "lib/firebaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const { chatId, role, content } = req.body;
        
        // Reference to the specific chat document
        const chatRef = doc(db, "DeepChat", chatId);
        
        // Retrieve the current chat document
        const chatSnap = await getDoc(chatRef);
        
        if (!chatSnap.exists()) {
            throw new Error("Chat not found or you do not have permission to access it");
        }
        
        // Check if the user is authorized to update the chat
        if (chatSnap.data().userId !== user.sub) {
            throw new Error("Unauthorized access to chat");
        }

        // Update the document by pushing a new message into the messages array
        await updateDoc(chatRef, {
            messages: arrayUnion({ role, content })
        });

        // Fetch the updated document to return in response
        const updatedChatSnap = await getDoc(chatRef);
        
        res.status(200).json({
            chatgptConversation: {
                ...updatedChatSnap.data(),
                _id: updatedChatSnap.id
            }
        });
    } catch (error) {
        console.error("Error while adding message to chat: ", error);
        res.status(500).json({ message: "Error occurred while adding message to a chat" });
    }
}
