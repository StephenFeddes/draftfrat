type Props = {
    active: boolean;
    handleOnToggle: () => void;
}

export const MockDraftsToggle = ({ active, handleOnToggle }: Props) => {
    return (
        <div
            className="w-full h-8 p-1 rounded-full bg-gray-900 cursor-pointer"
            onClick={handleOnToggle}
        >
            <button
                type="button"
                className={`w-1/2 h-full rounded-full border-none bg-secondary font-semibold text-md transition-transform duration-300 
                    ${active ? "" : "translate-x-full"}`}
            >
                {active ? "Active Drafts" : "Finished Drafts"}
            </button>
        </div>
    );
};