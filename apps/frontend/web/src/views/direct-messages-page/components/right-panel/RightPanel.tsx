import { useChatContext } from "contexts/ChatProvider";

export const RightPanel = () => {
    const { recentConversations, setFromUserId, joinChat } = useChatContext();

    return (
        <div className="p-5">
            <h3 className="text-sm font-semibold text-grey">Conversations</h3>
            <ul>
                {recentConversations.map((conversation) => (
                    <li
                        key={conversation.fromUserId}
                        onClick={() => {
                            setFromUserId(conversation.fromUserId);
                            joinChat(conversation.fromUserId);
                        }}
                        className="p-2 mt-2 rounded-lg cursor-pointer hover:bg-black/10"
                    >
                        <span className="inline-block h-5 px-2 bg-yellow-500/50 text-xs font-normal leading-4 text-white">
                            {conversation.fromUsername}
                        </span>
                        {conversation.lastMessage.includes("Join my draft! /drafts/") ? (
                            <p className="text-xs text-grey1 mt-1">Join my draft!</p>
                        ) : (
                            <p className="text-xs text-grey1 mt-1 truncate">
                                {conversation.lastMessage}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
