// import { getSession } from "@auth0/nextjs-auth0";
// import clientPromise from "lib/mongodb";

// export default async function handler(req,res){
//     try {
//         const {user} = await getSession(req,res);
//         const {message} = req.body;
//         const newUserMessage = {
//             role: "user",
//             content: message,
//         }
//         const client = await clientPromise;
//         const db = client.db();
//         const chatgptConversation = await db.collection("DeepChat").insertOne({
//             userId: user.sub,
//             messages: [newUserMessage],
//             title: message
//         })
//         res.status(200).json({
//             _id: chatgptConversation.insertedId.toString(),
//             messages: [newUserMessage],
//             title: message,
//         })
//     } catch (error) {
//         res.status(500).json({message: "An error occurred while creating a new chat"})
//         console.log("Error occurred in create new chat: ",  error);
//     }
// }


import { getSession } from "@auth0/nextjs-auth0";
import db from "lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
    try {
        const { user } = await getSession(req, res);
        const { message } = req.body;

        // Construct the new message object to store in Firestore
        const newUserMessage = {
            role: "user",
            content: message,
        };

        // Add a new document in the "DeepChat" collection
        const chatDocument = await addDoc(collection(db, "DeepChat"), {
            userId: user.sub,
            messages: [newUserMessage],
            title: message
        });

        // Send success response with created data
        res.status(200).json({
            _id: chatDocument.id,
            messages: [newUserMessage],
            title: message,
        });
    } catch (error) {
        console.error("Error occurred in create new chat: ", error);
        res.status(500).json({ message: "An error occurred while creating a new chat" });
    }
}
