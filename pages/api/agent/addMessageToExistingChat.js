// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";
// import {ObjectId} from 'mongodb'

// export default async function handler(req,res){
//     try {
//         const {user} = await getSession(req,res);
//         const client = await clientPromise;
//         const db = client.db("DeepsolvChatbots");
//         const {agentId, userMessage,generatedLogs,report} = req.body;
//         const messagesToAdd = [
//             {
//                 role: 'user',
//                 content: {
//                     type: 'text',
//                     content: userMessage
//                 } 
//             },
//             {
//                 role: 'assistant',
//                 content: {
//                     type: 'logs',
//                     content: generatedLogs
//                 } 
//             },
//             {
//                 role: 'assistant',
//                 content: {
//                     type: 'report',
//                     content: report
//                 } 
//             },
//         ]
//         const chat = db.collection("DeepAgent").findOneAndUpdate({
//             _id: new ObjectId(agentId),
//             userId: user.sub
//         },{
//             $push: {$each: messagesToAdd}
//         },{
//             returnDocument: "after" 
//         })

//         res.status(200).json({
//             chat: {
//                 ...chat.value,
//                 _id: chat.value._id.toString(),
//             } 
//         })
//     } catch (error) {
//         res.status(500).json({message: "Error while adding to existing chat"})
//         console.log("Error while adding to existing chat: ",error);
//     }
// }

// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";
// import { ObjectId } from 'mongodb';

// export default async function handler(req, res) {
//     try {
//         const { user } = await getSession(req, res);
//         const client = await clientPromise;
//         const db = client.db();
//         const { chatId, userMessage, generatedLogs, report } = req.body;
        
//         // Construct the messages to add
//         const messagesToAdd = [
//             {
//                 role: 'user',
//                 content: {
//                     type: 'text',
//                     content: userMessage
//                 } 
//             },
//             {
//                 role: 'assistant',
//                 content: {
//                     type: 'logs',
//                     content: generatedLogs
//                 } 
//             },
//             {
//                 role: 'assistant',
//                 content: {
//                     type: 'report',
//                     content: report
//                 } 
//             },
//         ];

//         // Update the chat document with the new messages
//         const result = await db.collection("DeepAgent").findOneAndUpdate(
//             {
//                 _id: new ObjectId(chatId),
//                 userId: user.sub
//             },
//             {
//                 $push: { messages: { $each: messagesToAdd } }
//             },
//             {
//                 returnDocument: "after" 
//             }
//         );

//         // Check if the chat document exists and return the updated chat
//         if (result && result.value) {
//             res.status(200).json({
//                 chat: {
//                     ...result.value,
//                     _id: result.value._id.toString(),
//                 } 
//             });
//         } else {
//             res.status(404).json({ message: "Chat not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Error while adding to existing chat" });
//         console.error("Error while adding to existing chat: ", error);
//     }
// }


// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";
// import {ObjectId} from 'mongodb'

// export default async function handler(req,res){
//     try {
//         const {user} = await getSession(req,res);
//         const client = await clientPromise;
//         const db = client.db("DeepsolvChatbots");
//         const {agentId, userMessage,generatedLogs,report} = req.body;
//         const messagesToAdd = [
//             {
//                 role: 'user',
//                 content: {
//                     type: 'text',
//                     content: userMessage
//                 } 
//             },
//             {
//                 role: 'assistant',
//                 content: {
//                     type: 'logs',
//                     content: generatedLogs
//                 } 
//             },
//             {
//                 role: 'assistant',
//                 content: {
//                     type: 'report',
//                     content: report
//                 } 
//             },
//         ]
//         const chat = db.collection("DeepAgent").findOneAndUpdate({
//             _id: new ObjectId(agentId),
//             userId: user.sub
//         },{
//             $push: {$each: messagesToAdd}
//         },{
//             returnDocument: "after" 
//         })

//         res.status(200).json({
//             chat: {
//                 ...chat.value,
//                 _id: chat.value._id.toString(),
//             } 
//         })
//     } catch (error) {
//         res.status(500).json({message: "Error while adding to existing chat"})
//         console.log("Error while adding to existing chat: ",error);
//     }
// }

import { getSession } from "@auth0/nextjs-auth0";
import {  doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import db from "lib/firebaseConfig";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const { chatId, userMessage, generatedLogs, report } = req.body;

        // Construct the messages to add
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
        ];

        // Get the chat document
        const chatDocRef = doc(db, "DeepAgent", chatId);
        const chatDocSnapshot = await getDoc(chatDocRef);

        // Check if the chat document exists
        if (chatDocSnapshot.exists() && chatDocSnapshot.data().userId === user.sub) {
            // Update the chat document with the new messages
            await updateDoc(chatDocRef, {
                messages: arrayUnion(...messagesToAdd)
            });

            const updatedChatDocSnapshot = await getDoc(chatDocRef);
            // Return the updated chat
            res.status(200).json({
                chat: {
                    ...updatedChatDocSnapshot.data(),
                    _id: updatedChatDocSnapshot.id
                }
            });
        } else {
            res.status(404).json({ message: "Chat not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error while adding to existing chat" });
        console.error("Error while adding to existing chat: ", error);
    }
}






