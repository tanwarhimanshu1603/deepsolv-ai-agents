import {OpenAIEdgeStream} from 'openai-edge-stream'

export const config = {
    runtime: "edge",
};

export default async function handler(req){
    try{
        const {chatId: chatIdFromParam,message} = await req.json();
        let chatId = chatIdFromParam;
        const initialMessage = {
            role: "system",
            content: ""
        }

        let newChatId = null;
        let chatMessages = [];  //This variable will have conversation history

        if(chatId){
            const response = await fetch(`${req.headers.get("origin")}/api/chat/addMessageToChat`,{
                method: 'POST',
                headers: {
                    'content-type': "application/json",
                    cookie: req.headers.get("cookie")
                },
                body: JSON.stringify({
                    chatId,
                    role: "user",
                    content: message
                })
            })
            const json = response.json();
            chatMessages = json?.chatgptConversation?.messages || [];
        }else{
            const response = await fetch(`${req.headers.get("origin")}/api/chat/createNewChat`,{
                method: 'POST',
                headers: {
                    'content-type': "application/json",
                    cookie: req.headers.get("cookie")
                },
                body: JSON.stringify({
                    message: message
                }),
            });
            const json = await response.json();
            chatId = json._id
            newChatId = json._id;
            chatMessages = json?.messages || [];
            // console.log("new message created: ", json);
        }

        const messagesToInlcude = [];         // This will finally be sent to openai to know about conversation history
        chatMessages.reverse();
        console.log("chat messages: ", chatMessages);
        let usedTokens = 0;
        for(let chatMessage of chatMessages){
            const messageTokens = chatMessage.content.length/4;
            usedTokens += messageTokens;
            if(usedTokens <= 2000){
                messagesToInlcude.push(chatMessage);
            }else break;
        }

        messagesToInlcude.reverse();
        console.log("message to include: ",messagesToInlcude);

        const stream = await OpenAIEdgeStream('https://api.openai.com/v1/chat/completions',{
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-4-turbo-preview",
                // messages: [
                //     {
                //       "role": "user",
                //       "content": ""
                //     }
                //   ],
                messages: [initialMessage, {content: message, role: "user"}],
                stream: true
            })
        },{
            onBeforeStream: ({emit}) => {
                if(newChatId)emit(newChatId, "newChatId");
            },
            onAfterStream: async ({fullContent}) => {
                await fetch(`${req.headers.get("origin")}/api/chat/addMessageToChat`,{
                    method: 'POST',
                    headers: {
                        'content-type': "application/json",
                        cookie: req.headers.get("cookie"),
                    },
                    body: JSON.stringify({
                        chatId,
                        role: "assistant",
                        content: fullContent,
                    })
                })
            }
        });
        return new Response(stream)
    }catch(e){
        console.log("Error occurred in sendMessage: ", e);
    }
}