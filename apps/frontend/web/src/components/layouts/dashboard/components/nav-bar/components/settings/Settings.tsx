import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useGlobalContext } from "contexts/GlobalProvider";
import { TokenStorage } from "services/security/TokenStorage";
import { useNavigate } from "react-router-dom";

export const Settings = () => {
    const { user } = useGlobalContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const closeModal = (event: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
        const target = event.target as HTMLDialogElement;
        if (target.tagName === "DIALOG") {
            setIsModalOpen(false);
        }
    };

    const logout = () => {
        TokenStorage.removeToken();
        navigate("/sign-in");
    };

    return (
        <>
            <div
                className="relative flex items-center mt-auto px-4 bg-black-1 rounded-t-lg h-16 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                <FaUser className="text-gray-500 text-3xl" />
                <p className="w-[70px] text-right text-sm font-semibold text-white transition-all duration-300 hidden lg:block">
                    {user?.username}
                </p>
                <FaGear className="ml-auto text-gray-400 hover:text-white transition-colors duration-300 text-xl hidden lg:block" />
            </div>

            {isModalOpen && (
                <dialog
                    className="fixed inset-0 z-10 flex items-center justify-center bg-[rgba(255,255,255,0.33)]"
                    open={isModalOpen}
                    onClick={closeModal}
                >
                    <div className="relative z-15 flex flex-col bg-gray-800 border border-black rounded-lg w-full max-w-[1000px] min-w-[500px] h-[70%] max-h-[625px] p-6 transform -translate-x-1/2 -translate-y-1/2">
                        <p
                            className="mt-auto ml-auto text-red-500 cursor-pointer px-3 py-1 hover:bg-red-600 hover:text-white transition"
                            onClick={() => logout()}
                        >
                            Logout
                        </p>
                    </div>
                </dialog>
            )}
        </>
    );
};