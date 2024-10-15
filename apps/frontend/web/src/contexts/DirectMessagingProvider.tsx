import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useGlobalContext } from "./GlobalProvider";
import { DirectMessage } from "types/directMessages";
import io, { Socket } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

type DirectMessagingContextType = {
    messages: DirectMessage[];
    recentConversations: DirectMessage[];
    recipientId: number | null;
    setRecipientId: (recipientId: number) => void;
    joinChat: (userId: number) => void;
    sendMessage: (message: string) => void;
};

const DirectMessagingContext = createContext<DirectMessagingContextType>({
    messages: [],
    recipientId: null,
    recentConversations: [],
    setRecipientId: () => { },
    joinChat: () => { },
    sendMessage: () => { },
});

export const useDirectMessagingContext = () => useContext(DirectMessagingContext);

interface Props {
    children: React.ReactNode;
}

export const DirectMessagingProvider = ({ children }: Props) => {
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [recentConversations, setRecentConversations] = useState<DirectMessage[]>([]);
    const [recipientId, setRecipientId] = useState<number | null>(null);

    const { user } = useGlobalContext();
    const socketRef = useRef<Socket | null>(null);  // Store the socket instance

    useEffect(() => {
        if (!user) return;

        // Create socket connection when the component is mounted
        socketRef.current = io(`${SERVER_URL}/direct-messaging`, {
            path: "/direct-messaging/socket.io/",
        });

        const socket = socketRef.current;  // Store the socket instance locally

        // Request recent conversations when connected
        socket.on("connect", () => {
            socket.emit("requestRecentConversations", user.id);
        });

        socket.on("receiveMessage", (data: DirectMessage) => {
            const newMessage: DirectMessage = {
                senderId: data.senderId,
                senderName: data.senderName,
                recipientId: recipientId!,
                content: data.content,
                sentAt: new Date().toUTCString(),
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        socket.on("receiveMessages", (data: any) => {
            setMessages(data);
        });

        socket.on("receiveRecentConversations", (data: any) => {
            setRecentConversations(data);
        });

        // Clean up the socket connection when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;  // Clear the socket reference
            }
        };
    }, []);

    const joinChat = (recipientId: number) => {
        if (socketRef.current && user) {
            socketRef.current.emit("joinChat", { senderId: user.id, recipientId });
        }
    };

    const sendMessage = (content: string) => {
        if (socketRef.current && user) {
            const newMessage: DirectMessage = {
                senderId: user.id,
                senderName: user.username,
                recipientId: recipientId!,
                content: content,
                sentAt: new Date().toUTCString(),
            };

            socketRef.current.emit("sendMessage", newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    };

    return (
        <DirectMessagingContext.Provider
            value={{
                messages,
                recipientId,
                recentConversations,
                setRecipientId,
                joinChat,
                sendMessage,
            }}
        >
            {children}
        </DirectMessagingContext.Provider>
    );
};