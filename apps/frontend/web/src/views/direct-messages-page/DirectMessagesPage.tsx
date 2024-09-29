import { DashboardLayout } from "@components/layouts/dashboard/DashboardLayout";
import { RightPanel } from "./components/right-panel/RightPanel";
import { LeftPanel } from "./components/left-panel/LeftPanel";
import { UserList } from "./components/user-list/UserList";
import { DirectMessagesProvider } from "contexts/DirectMessagesProvider";

export const DirectMessagesPage = () => {
    return (
        <DirectMessagesProvider>
            <DashboardLayout
                header={
                    <div className="flex items-center gap-5">
                        <UserList />
                        <div className="flex items-center gap-5">
                            <h1 className="text-2xl font-bold text-white">Messages</h1>
                            <p className="text-sm text-grey">Send and receive messages</p>
                        </div>
                    </div>
                }
                leftPanel={<LeftPanel />}
                rightPanel={<RightPanel />}
            />
        </DirectMessagesProvider>
    );
};