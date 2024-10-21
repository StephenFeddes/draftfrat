import { Link } from "react-router-dom";
import { TextInput } from "@components/inputs/text-input/TextInput";
import { useCreateUser } from "@hooks/users/useCreateUser";
import { useState } from "react";

export const SignUpPage = () => {
    const {
        createUser,
        validateEmail,
        validateUsername,
        validatePassword,
        usernameError,
        emailError,
        passwordError,
    } = useCreateUser();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createUser({ username, email, password });
    };

    return (
        <main className="flex overflow-hidden h-screen">
            {/* Left Section */}
            <section className="hidden lg:flex flex-col items-center flex-[40%] p-12 bg-primary">
                <h2 className="flex items-start justify-center items-center text-white text-6xl font-bold">
                    <img
                        src="icons/draftfrat.svg"
                        alt="DraftFrat logo"
                        className="w-16 h-16 mr-2"
                    />
                    DraftFrat
                </h2>
                <img
                    src="images/confetti.png"
                    alt="Confetti"
                    className="w-[300px] h-[300px] mt-6"
                />
                <p className="text-center font-semibold text-white text-3xl w-[500px] mt-4">
                    Make fantasy sport dreams come true with{" "}
                    <b className="relative text-3xl text-secondary">
                        DraftFrat{" "}
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
                    <h1 className="text-black text-5xl font-bold">Sign up</h1>
                    <Link to="/sign-in" className="text-secondary text-lg font-bold">
                        Sign in
                    </Link>
                </header>
                <p className="text-grey-2 text-md mt-4">
                    Sign up with your username, email, and password
                </p>
                <form onSubmit={handleOnSubmit} className="flex flex-col gap-4 mt-10 min-w-[300px]">
                    <TextInput
                        label="Username"
                        placeholder="Username"
                        handleOnChange={(text: string) => {
                            setUsername(text);
                            validateUsername(text);
                        }}
                    />
                    {usernameError && <p className="text-red text-xs font-semibold">{usernameError}</p>}
                    <TextInput
                        label="Email"
                        placeholder="Email"
                        handleOnChange={(text: string) => {
                            setEmail(text);
                            validateEmail(text);
                        }}
                    />
                    {emailError && <p className="text-red text-xs font-semibold">{emailError}</p>}
                    <TextInput
                        label="Password"
                        placeholder="Password"
                        type="password"
                        handleOnChange={(text: string) => {
                            setPassword(text);
                            validatePassword(text);
                        }}
                    />
                    {passwordError && <p className="text-red text-xs font-semibold">{passwordError}</p>}
                    <button
                        type="submit"
                        className="w-72 p-4 text-white bg-secondary font-semibold text-xl rounded-md hover:shadow-lg transition-shadow"
                    >
                        Sign up
                    </button>
                </form>
            </section>
        </main>
    );
};