import { Link } from "react-router-dom";
import { TextInput } from "@components/inputs/text-input/TextInput";
import { useSignInUser } from "@hooks/users/useSignInUser";
import { useState } from "react";

export const SignInPage = () => {
    const { signInUser, error } = useSignInUser();
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const setName = (name: string) => {
        setUsername(name);
        setEmail(name);
    };

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInUser({ username, email, password });
    };

    return (
        <main className="flex overflow-hidden h-screen">
            {/* Left Section */}
            <section className="hidden lg:flex flex-col items-center flex-[40%] p-12 bg-primary">
                <h2 className="flex items-start justify-center items-center text-white text-6xl font-bold">
                    <img
                        src="icons/draftbash.svg"
                        alt="DraftBash logo"
                        className="w-16 h-16 mr-2"
                    />
                    DraftBash
                </h2>
                <img
                    src="images/confetti.png"
                    alt="Confetti"
                    className="w-[300px] h-[300px] mt-6"
                />
                <p className="text-center font-semibold text-white text-3xl w-[500px] mt-4">
                    Make fantasy sport dreams come true with{" "}
                    <b className="relative text-3xl text-secondary">
                        DraftBash{" "}
                        <img
                            src="images/underline.png"
                            alt="Underline"
                            className="absolute top-8 left-0 w-[175px]"
                        />
                    </b>
                </p>
                <p className="text-center text-grey text-xl w-[500px] mt-4">
                    Where party meets sport: have a fantasy sport bash with DraftBash
                </p>
            </section>

            {/* Right Section */}
            <section className="flex flex-col justify-center flex-[60%] h-full p-16 bg-white-1 overflow-auto">
                <header className="flex justify-between items-center w-full min-w-[300px]">
                    <h1 className="text-black text-5xl font-bold">Sign in</h1>
                    <Link to="/sign-up" className="text-secondary text-lg font-bold">
                        Sign up
                    </Link>
                </header>
                <p className="text-grey-2 text-md mt-4">
                    Sign in with your username or email
                </p>
                <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 mt-10 min-w-[300px]">
                    <TextInput
                        label="Username or email"
                        placeholder="Username or email"
                        handleOnChange={setName}
                    />
                    <TextInput
                        label="Password"
                        placeholder="Password"
                        type="password"
                        handleOnChange={setPassword}
                    />
                    {error && <p className="text-red text-xs font-semibold mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-72 p-4 text-white bg-secondary font-semibold text-xl rounded-md hover:shadow-lg transition-shadow"
                    >
                        Sign in
                    </button>
                </form>
            </section>
        </main>
    );
};