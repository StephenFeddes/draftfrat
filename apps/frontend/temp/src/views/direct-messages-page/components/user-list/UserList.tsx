import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useGetUsersByUsername } from "@hooks/users/useGetUsersByUsername";
import { User } from "types/users";
import { useGlobalContext } from "contexts/GlobalProvider";
import { useDirectMessagesContext } from "contexts/DirectMessagesProvider";

export const UserList = () => {
    const { user } = useGlobalContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const { getUsersByUsername } = useGetUsersByUsername();
    const { joinChat, setFromUserId } = useDirectMessagesContext();
    const [searchTimeout, setSearchTimeout] = useState<number | undefined>(undefined);

    const searchUsers = async (username: string) => {
        if (username.length >= 3) {
            const users: User[] = await getUsersByUsername(username, user?.id ?? 0);
            setSearchedUsers(users);
        } else {
            setSearchedUsers([]);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value;
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        const timeout = window.setTimeout(() => {
            searchUsers(username);
        }, 300);
        setSearchTimeout(timeout);
    };

    const handleChatClick = (userId: number) => {
        setFromUserId(userId);
        joinChat(userId);
        setIsModalOpen(false);
    };

    const closeModal = (event: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
        const target = event.target as HTMLDialogElement;
        if (target.tagName === "DIALOG") {
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <FaPlus
                className="text-white text-lg cursor-pointer hover:text-gray-500"
                onClick={() => {
                    setIsModalOpen(true);
                }}
                type="button"
            />
            {isModalOpen && (
                <dialog
                    className="fixed z-10 left-0 top-0 w-full h-full overflow-auto bg-white bg-opacity-30 border-none"
                    open={isModalOpen}
                    onClick={closeModal}
                >
                    <div className="z-20 flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[500px] h-4/5 max-h-[625px] max-w-[1000px] bg-gray-800 border border-black">
                        <header className="relative p-4">
                            <FaSearch className="absolute top-6 right-6 text-white" />
                            <input
                                className="w-full rounded-md bg-gray-700 border-none p-2 text-gray-400 text-sm"
                                placeholder="Search users"
                                type="text"
                                onChange={handleSearchChange}
                            />
                        </header>
                        {searchedUsers.length > 0 ? (
                            <ul className="overflow-y-auto">
                                {searchedUsers.map((searchedUser) => (
                                    <li
                                        key={searchedUser.id}
                                        className="flex justify-between p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                                    >
                                        <p className="text-white text-sm font-medium">
                                            {searchedUser.username}
                                        </p>
                                        <button
                                            className="px-4 py-1 rounded bg-blue-600 text-sm font-semibold text-white"
                                            type="button"
                                            onClick={() => handleChatClick(searchedUser.id)}
                                        >
                                            CHAT
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col justify-center items-center h-full">
                                <FaSearch className="text-gray-500 text-4xl" />
                                <p className="text-gray-400 text-base font-medium">Find user</p>
                            </div>
                        )}
                    </div>
                </dialog>
            )}
        </>
    );
};
