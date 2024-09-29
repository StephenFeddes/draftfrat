import { createContext, useContext, useState, useEffect } from "react";
import { useGlobalContext } from "./GlobalProvider";
import { ChatMessage, RecentConversation } from "types/chats";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

type DirectMessagesContextType = {
    messages: ChatMessage[];
    recentConversations: RecentConversation[];
    fromUserId: number | null;
    setFromUserId: (fromUserId: number) => void;
    joinChat: (userId: number) => void;
};

const DirectMessagesContext = createContext<DirectMessagesContextType>({
    messages: [],
    fromUserId: null,
    recentConversations: [],
    setFromUserId: () => {},
    joinChat: () => {},
});
export const useDirectMessagesContext = () => useContext(DirectMessagesContext);

interface Props {
    children: React.ReactNode;
}

const socket = io("http://localhost:3001");

export const DirectMessagesProvider = ({ children }: Props) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
    const [fromUserId, setFromUserId] = useState<number | null>(null);

    const { user } = useGlobalContext();
    useEffect(() => {
        // Handle connection events
        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
        });

        socket.on("serverResponse", (data: any) => {
            console.log(data);
        });

        // Clean up on component unmount
        return () => {
            socket.off("connect");
        };
    }, []);

    const joinChat = (userId: number) => {
        socket.emit("joinChat", { userId, fromUserId: user?.id });
    }

    return (
        <DirectMessagesContext.Provider
            value={{
                messages,
                fromUserId,
                recentConversations,
                setFromUserId,
                joinChat,
            }}
        >
            {children}
        </DirectMessagesContext.Provider>
    );
};
