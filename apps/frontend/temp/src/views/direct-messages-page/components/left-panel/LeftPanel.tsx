import { useChatContext } from "contexts/ChatProvider";
import { RiMessage3Line } from "react-icons/ri";
import { useState } from "react";
import { Link } from "react-router-dom";
import { timeSince } from "@utils/time";

export const LeftPanel = () => {
    const { messages, sendMessage, fromUserId } = useChatContext();
    const [chatMessage, setChatMessage] = useState("");

    return (
        <div>
            {fromUserId != null ? (
                <form
                    className="flex flex-col justify-end h-full p-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage(chatMessage);
                        setChatMessage("");
                    }}
                >
                    <ul className="p-4 border-b-2 border-grey2 mb-2 max-h-[75vh] overflow-auto">
                        {messages.map((message, index) => (
                            <li key={index} className="mt-4">
                                <span className="inline-block h-5 px-2 bg-yellow-500/50 text-xs font-normal leading-4 text-white">
                                    {message.fromUsername}
                                </span>
                                <span className="ml-4 text-xxs font-normal text-grey">
                                    {timeSince(message.sentAt)}
                                </span>
                                {message.message.includes("Join my draft! /drafts/") ? (
                                    <p className="text-xs font-normal text-white">
                                        Join my draft!{" "}
                                        <Link
                                            to={`/draft/${message.message.split("/")[2]}/${message.message.split("/")[3]}`}
                                            className="bg-secondary px-8 py-1 rounded-md font-semibold text-grey3"
                                        >
                                            JOIN
                                        </Link>
                                    </p>
                                ) : (
                                    <p className="text-xs font-normal text-white">{message.message}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center gap-2">
                        <input
                            placeholder="Enter Message"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            className="flex-1 p-2 rounded-full bg-black text-xs text-grey"
                        />
                        <button
                            type="submit"
                            className="w-20 h-10 bg-black text-xs font-medium text-grey2"
                        >
                            SEND
                        </button>
                    </div>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center mt-48">
                    <RiMessage3Line className="w-16 h-16 mb-5 text-grey" />
                    <h3 className="text-medium font-medium text-grey">Chat</h3>
                    <p className="text-sm font-normal text-grey">Start a chat</p>
                </div>
            )}
        </div>
    );
};