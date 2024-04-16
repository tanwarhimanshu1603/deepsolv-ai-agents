// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";

// export default async function saveData(req,res){
//     try {
//         const {user} = await getSession(req,res);
//         const {userMessage, generatedLogs, report} = req.body;
//         // const newMessage = {
//         //     userMessage,
//         //     generatedLogs,
//         //     report
//         // }
//         const newMessage = [
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
//         const client = await clientPromise;
//         const db = client.db();
//         const chatgptConversation = await db.collection("DeepAgent").insertOne({
//             userId: user.sub,
//             messages: newMessage,
//             title: userMessage
//         })
//         res.status(200).json({
//             _id: chatgptConversation.insertedId.toString(),
//             messages: newMessage,
//             title: userMessage,
//         })
//     } catch (error) {
//         console.log("Error while saving data to db: ",error);
//     }
// }


import { getSession } from "@auth0/nextjs-auth0";
import { addDoc, collection } from "firebase/firestore";
import db from "lib/firebaseConfig"; // Assuming you've initialized and exported your Firestore instance as `firestore`

export default async function saveData(req, res) {
    try {
        const { user } = await getSession(req, res);
        const { userMessage, generatedLogs, report } = req.body;
        
        const newMessage = [
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

        const chatgptConversationRef = await addDoc(collection(db, "DeepAgent"), {
            userId: user.sub,
            messages: newMessage,
            title: userMessage
        });

        res.status(200).json({
            _id: chatgptConversationRef.id,
            messages: newMessage,
            title: userMessage,
        });
    } catch (error) {
        console.log("Error while saving data to db: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
