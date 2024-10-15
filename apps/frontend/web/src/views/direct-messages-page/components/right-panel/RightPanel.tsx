import { useDirectMessagingContext } from "contexts/DirectMessagingProvider";

export const RightPanel = () => {
    const { recentConversations, setRecipientId, joinChat } = useDirectMessagingContext();

    return (
        <div>
            <h3 className="p-4 text-lg font-semibold text-grey">Conversations</h3>
            <ul>
                {recentConversations.map((conversation) => (
                    <li
                        key={conversation.senderId}
                        onClick={() => {
                            setRecipientId(conversation.senderId);
                            joinChat(conversation.senderId);
                        }}
                        className="p-2 mt-2 rounded-lg cursor-pointer hover:bg-black/10"
                    >
                        <span className="inline-block h-4 bg-yellow-500/50 bg-opacity-50 bg-secondary text-md font-normal leading-4 text-white">
                            {conversation.senderName}
                        </span>
                        {conversation.content.includes("Join my draft! /drafts/") ? (
                            <p className="text-md text-grey">Join my draft!</p>
                        ) : (
                            <p className="text-md text-grey truncate">
                                {conversation.content}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
