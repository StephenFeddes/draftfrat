import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { GlobalProvider } from "contexts/GlobalProvider";
import { ProtectedRoute } from "@components/auth/protected-route/ProtectedRoute";
import { DirectMessagesPage } from "views/direct-messages-page/DirectMessagesPage";
import { MockDraftsPage } from "views/mock-drafts-page/MockDraftsPage";
import { DraftRoomPage } from "views/draft-room-page/DraftRoomPage";
import { SignInPage } from "views/sign-in-page/SignInPage";
import { SignUpPage } from "views/sign-up-page/SignUpPage";
import { DirectMessagesProvider } from "contexts/DirectMessagesProvider";

export const App = () => {
    return (
        <GlobalProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/sign-in" element={<SignInPage />} />
                        <Route path="/sign-up" element={<SignUpPage />} />
                        <Route path="/" element={<DirectMessagesPage />} />
                        <Route path="/messages" element={<DirectMessagesPage />} />
                        <Route path="/mock-drafts" element={<MockDraftsPage />} />
                        <Route path="/draft/:sport/:id" element={<DraftRoomPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </GlobalProvider>
    );
}
