import { ChangeEvent, useState } from "react";

interface Props {
    placeholder: string;
    label: string;
    type?: string;
    handleOnChange: (input: string) => void;
}

export const TextInput = ({ placeholder, label, type = "text", handleOnChange }: Props) => {
    const [showPassword, setShowPassword] = useState(type === "password");

    return (
        <div className="relative flex flex-col">
            <label className="text-md font-medium text-grey-3">{label}</label>
            <input
                type={showPassword ? "password" : "text"}
                placeholder={placeholder}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleOnChange(event.target.value)}
                className="p-3 border-none text-md font-normal shadow-lg focus:shadow-xl transition-shadow"
            />
            {type === "password" && (
                <img
                    src={`icons/${showPassword ? "eyehide" : "eye"}.png`}
                    alt="Show password"
                    className="absolute top-1/2 right-3 w-5 h-5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                />
            )}
        </div>
    );
};