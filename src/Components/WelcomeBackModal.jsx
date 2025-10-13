import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSessionPaused, updateCandidate } from "../Store/Store.js";

const WelcomeBackModal = ({ setStartOver, setContinueInterview }) => {
    console.log("WelcomeBackModal rendered!");
    const dispatch = useDispatch();

    // Fix infinite rerendering by using useMemo with stable dependencies
    const currentCandidateEmail = useSelector((state) => state.currentCandidateEmail);
    const candidates = useSelector((state) => state.candidates);

    const calculateNoOfQuestionsInChatHistory = () => {
        const candidate = candidates.find((c) => c.email === currentCandidateEmail);
        if (candidate) {
            const attemptedQuestions = candidate.chatHistory.filter((chat) => chat.type === "question");
            return attemptedQuestions.length;
        }
    };
    const currentCandidate = useMemo(() => {
        return candidates.find((c) => c.email === currentCandidateEmail) || null;
    }, [candidates, currentCandidateEmail]);

    const handleContinue = (e) => {
        e.preventDefault();
        // Update candidate status from "paused" to "ready" to break the loop
        dispatch(
            updateCandidate({
                id: currentCandidate.id,
                status: "in-progress",
            })
        );
        dispatch(setSessionPaused(false));
        setContinueInterview(true);
        console.log("continue button clicked...");
    };

    const handleRestart = (e) => {
        e.preventDefault();
        dispatch(
            updateCandidate({
                id: currentCandidate.id,
                score: 0,
                status: "ready",
                chatHistory: [],
                currentQuestionNo: 0,
                questions: [],
            })
        );
        setStartOver(true);
        dispatch(setSessionPaused(false));
        console.log("Restart button clicked...");
    };

    return (
        <div className="fixed inset-0 bg-grey-300 bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome Back, {currentCandidate?.name}!
                </h2>
                <p className="text-gray-700 mb-6">
                    You have an interview in progress. Would you like to continue where you left off?
                </p>

                {currentCandidate && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 shadow-inner">
                        <h3 className="font-semibold text-gray-900 mb-2">Interview Progress</h3>
                        <p className="text-sm text-gray-600">Candidate: {currentCandidate.name}</p>
                        <p className="text-sm text-gray-600">
                            Questions Completed: {calculateNoOfQuestionsInChatHistory()}
                        </p>
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        onClick={(e) => handleContinue(e)}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Continue Interview
                    </button>
                    <button
                        onClick={(e) => handleRestart(e)}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeBackModal;
