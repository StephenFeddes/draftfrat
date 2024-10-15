import { RiMessage3Line } from "react-icons/ri";
import { useState } from "react";
import { Link } from "react-router-dom";
import { timeSince } from "@utils/time";
import { useDirectMessagingContext } from "contexts/DirectMessagingProvider";
import { VscSend } from "react-icons/vsc";

export const LeftPanel = () => {
    const { messages, sendMessage, recipientId } = useDirectMessagingContext();
    const [chatMessage, setChatMessage] = useState("");

    return (
        <div className="h-full">
            {recipientId != null ? (
                <form
                    className="flex flex-col justify-end h-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage(chatMessage);
                        setChatMessage("");
                    }}
                >
                    <ul className="p-4 border-b border-grey-3 max-h-[75vh] overflow-auto">
                        {messages.map((message, index) => (
                            <li key={index} className="mt-4">
                                <span className="inline-block h-4 bg-yellow-500/50 bg-opacity-50 bg-secondary text-md font-normal leading-4 text-white">
                                    {message.senderName}
                                </span>
                                <span className="ml-4 text-xs font-normal text-grey">
                                    {timeSince(message.sentAt)}
                                </span>
                                {message.content.includes("Join my draft! /drafts/") ? (
                                    <p className="text-xs font-normal text-white">
                                        Join my draft!{" "}
                                        <Link
                                            to={`/draft/${message.content.split("/")[2]}/${message.content.split("/")[3]}`}
                                            className="bg-secondary px-8 py-1 rounded-md font-semibold text-grey3"
                                        >
                                            JOIN
                                        </Link>
                                    </p>
                                ) : (
                                    <p className="text-md font-normal text-white">{message.content}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center gap-2 p-2">
                        <input
                            placeholder="Enter Message"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="flex-1 p-4 rounded-full bg-primary text-md text-grey"
                        />
                        <button
                            type="submit"
                            className="w-8 h-8 bg-transparent"
                        >
                            <VscSend className="h-full w-full text-grey" />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <RiMessage3Line className="w-16 h-16 mb-5 text-grey" />
                    <h3 className="text-medium font-medium text-grey">Chat</h3>
                    <p className="text-sm font-normal text-grey">Start a chat</p>
                </div>
            )}
        </div>
    );
};