import { DashboardLayout } from "@components/layouts/dashboard/DashboardLayout";
import { MockDraftsToggle } from "./components/mock-drafts-toggle/MockDraftsToggle";
import { useState } from "react";
import { MockDraftItem } from "./components/mock-draft-item/MockDraftItem";
import { Draft } from "types/drafts";
import { PiGridNineLight } from "react-icons/pi";
import { useGetMockDrafts } from "@hooks/mock-drafts/useGetMockDrafts";
import { useCreateMockDrafts } from "@hooks/mock-drafts/useCreateMockDraft";

export const MockDraftsPage = () => {
    const [isActiveDrafts, setIsActiveDrafts] = useState(true);
    const { mockDrafts } = useGetMockDrafts();
    const { createFootballDraft } = useCreateMockDrafts();
    const defaultFootballDraftSettings = {
        teamCount: 10,
        scoringFormat: "ppr",
        pickOrderFormat: "snake",
        pickTimeLimit: 60,
        sport: "football",
        quarterbackLimit: 1,
        runningBackLimit: 2,
        wideReceiverLimit: 2,
        tightEndLimit: 1,
        kickerLimit: 1,
        defenseLimit: 1,
        flexLimit: 2,
        benchLimit: 4,
        isDraftStarted: false
    };

    return (
        <>
            <DashboardLayout
                header={
                    <div className="flex items-center gap-5">
                        <h1 className="text-2xl font-bold text-white">Mock Drafts</h1>
                        <p className="text-sm text-grey">Practice your draft strategies</p>
                    </div>
                }
                leftPanel={
                    <div className="p-8">
                        <MockDraftsToggle
                            active={isActiveDrafts}
                            handleOnToggle={() => setIsActiveDrafts(!isActiveDrafts)}
                        />
                        {mockDrafts.length > 0 ? (
                            <ul className="mt-5 max-h-[65vh] overflow-auto">
                                {mockDrafts.map((draft: Draft) => (
                                    <li key={draft.id} className="py-2.5">
                                        <MockDraftItem draft={draft} />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center mt-52">
                                <PiGridNineLight className="w-16 h-16 mb-5 text-gray-500" />
                                <h4 className="text-xl font-medium text-grey">No drafts available</h4>
                                <p className="text-md font-semi-bold text-grey-1">Create your own or join your friend's</p>
                            </div>
                        )}
                    </div>
                }
                rightPanel={
                    <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
                        <PiGridNineLight className="w-32 h-32 p-5 text-gray-400 bg-gray-500 rounded-full" />
                        <h3 className="mt-2 mb-[-10px] text-lg font-light text-white">Mock Drafts</h3>
                        <p className="text-sm font-light text-white">Practice your draft strategies</p>
                        <button
                            type="button"
                            className="h-10 w-56 rounded-md bg-green text-sm font-semibold text-white hover:bg-green-500"
                            onClick={() => createFootballDraft(defaultFootballDraftSettings)}
                        >
                            Create Football Draft
                        </button>
                    </div>
                }
            />
        </>
    );
};