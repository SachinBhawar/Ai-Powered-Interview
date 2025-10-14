import React, { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store } from "./Store/Store.js";
import IntervieweeTab from "./Components/IntervieweeTab.jsx";
import InterviewerTab from "./Components/InterviewerTab.jsx";
import WelcomeBackModal from "./Components/WelcomeBackModal.jsx";
import { setActiveTab } from "./Store/Store.js";

const AppContent = () => {
    const dispatch = useDispatch();
    const activeTab = useSelector((state) => state.activeTab);
    const sessionPaused = useSelector((state) => state.sessionPaused);
    const currentCandidateEmail = useSelector((state) => state.currentCandidateEmail);
    const candidates = useSelector((state) => state.candidates);

    // Find the actual current candidate
    const currentCandidate = currentCandidateEmail
        ? candidates.find((c) => c.email === currentCandidateEmail)
        : null;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl h-16 bg-green-300 mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">AI Interview Assistant</h1>
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => dispatch(setActiveTab("interviewee"))}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                activeTab === "interviewee"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Interviewee
                        </button>
                        <button
                            onClick={() => dispatch(setActiveTab("interviewer"))}
                            className={`px-3 py-2 rounded-md text-sm font-medium ${
                                activeTab === "interviewer"
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Interviewer
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "interviewee" && <IntervieweeTab />}
                {activeTab === "interviewer" && <InterviewerTab />}
            </main>

            {/* {currentCandidate.status === "in-progress" && <WelcomeBackModal />} */}
        </div>
    );
};

const App = () => (
    <Provider store={store}>
        <AppContent />
    </Provider>
);

export default App;
