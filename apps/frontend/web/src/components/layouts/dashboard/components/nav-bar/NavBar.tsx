import { Link, useLocation } from "react-router-dom";
import { RiMessage3Line } from "react-icons/ri";
import { PiGridNineLight } from "react-icons/pi";
import { LuPlusCircle } from "react-icons/lu";
import { Settings } from "./components/settings/Settings";

export const NavBar = () => {
    const currentUrlLocation = useLocation().pathname;

    return (
        <nav
            className="flex flex-col h-screen w-[64px] min-w-[64px] bg-black-2 border-r 
        border-grey-4 transition-all duration-300 lg:min-w-[240px]"
        >
            <div className="flex items-center gap-4 p-4">
                <img
                    src="icons/draftbash.svg"
                    alt="DraftBash logo"
                    className="w-[35px] h-[35px]"
                />
                <h2 className="text-center text-3xl font-medium text-transparent transition-colors duration-300 lg:text-white">
                    DraftBash
                </h2>
            </div>

            <ul>
                <li
                    className={`relative cursor-pointer transition-colors duration-300 ${
                        currentUrlLocation === "/messages" ? "bg-[rgba(255,255,255,0.08)]" : ""
                    }`}
                >
                    {currentUrlLocation === "/messages" && (
                        <div className="absolute left-0 top-[10px] h-[calc(100%-20px)] w-[5px] bg-secondary rounded-r-md" />
                    )}
                    <Link
                        to="/messages"
                        className={`flex items-center justify-start py-2 text-lg font-medium 
                            text-grey-1 transition-colors duration-300 hover:text-white 
                            lg:${currentUrlLocation === "/messages" ? "text-white" : "text-grey-1"}`}
                    >
                        <RiMessage3Line className="top-2 w-[60px] h-[35px]" />
                        <span className="hidden lg:block">Messages</span>
                    </Link>
                </li>
                <li
                    className={`relative cursor-pointer transition-colors duration-300 ${
                        currentUrlLocation === "/mock-drafts" ? "bg-[rgba(255,255,255,0.08)]" : ""
                    }`}
                >
                    {currentUrlLocation === "/mock-drafts" && (
                        <div className="absolute left-0 top-[10px] h-[calc(100%-20px)] w-[5px] bg-secondary rounded-r-md" />
                    )}
                    <Link
                        to="/mock-drafts"
                        className={`flex items-center justify-start py-2 text-lg font-medium 
                            text-grey-1 transition-colors duration-300 hover:text-white hover:bg-[rgba(255,255,255,0.08)]
                            lg:${currentUrlLocation === "/mock-drafts" ? "text-white" : "text-grey-1"}`}
                    >
                        <PiGridNineLight className="top-2 w-[60px] h-[35px]" />
                        <span className="hidden lg:block">Mock Drafts</span>
                    </Link>
                </li>
            </ul>

            <div className="p-5 leagues">
                <div className="relative flex items-center justify-between cursor-pointer">
                    <p className="text-lg text-grey-1 transition-colors duration-300 hidden lg:block">
                        Leagues
                    </p>
                    <LuPlusCircle className="w-6 h-6 text-secondary" />
                    <div
                        className="absolute left-full ml-4 w-[110px] h-[30px] rounded-md text-center 
                        leading-[30px] text-xs font-medium text-white hidden group-hover:block"
                    >
                        Make league
                    </div>
                </div>
                <ul className="mt-2 border-b-2 border-gray-500"></ul>
            </div>

            <Settings />
        </nav>
    );
};
