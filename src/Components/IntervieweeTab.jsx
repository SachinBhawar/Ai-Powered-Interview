import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ResumeUpload from "./ResumeUpload";
import WelcomeBackModal from "./WelcomeBackModal";
import ChatInterface from "./ChatInterface";
import GettingMissingInfo from "./GettingMissingInfo";

import { addCandidate, setCurrentCandidateEmail, updateCandidate } from "../Store/Store";

const IntervieweeTab = () => {
    console.log("intervieweeTab");
    const dispatch = useDispatch();
    const { candidates, currentCandidateEmail } = useSelector(
        (state) => ({
            candidates: state.candidates,
            currentCandidateEmail: state.currentCandidateEmail,
        }),
        shallowEqual
    );

    const [showWelcomeBackModal, setShowWelcomeBackModal] = useState(false);

    const [infoFromResume, setInfoFromResume] = useState(null);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const [missingFields, setMissingFields] = useState([]);
    const [startOver, setStartOver] = useState(false);
    const [continueInterview, setContinueInterview] = useState(false);

    useEffect(() => {
        if (!startOver && !currentCandidateEmail) return;
        const candidate = candidates.find((c) => c.email === currentCandidateEmail);
        dispatch(updateCandidate({ id: candidate.id, chatHistory: [] }));
    }, [startOver]);

    useEffect(() => {
        if (!infoFromResume) return;

        const fieldsToCheck = ["name", "email", "phone", "role"];
        const newMissing = fieldsToCheck.filter((field) => !infoFromResume[field]);

        if (newMissing.length == 0) {
            setCandidateInfo(infoFromResume);
        } else {
            setMissingFields(newMissing);
        }
    }, [infoFromResume]);

    useEffect(() => {
        if (!candidateInfo || missingFields.length > 0) return;

        const { email, name, phone, role } = candidateInfo;
        const existingCandidate = candidates.find((c) => c.email === email);

        if (existingCandidate) {
            // Candidate exists.
            if (currentCandidateEmail !== existingCandidate.email) {
                dispatch(setCurrentCandidateEmail(existingCandidate.email));
            }
        } else {
            // New candidate addition.
            const newCandidate = {
                name,
                email,
                phone,
                role,
                status: "ready",
                chatHistory: [],
                questions: [],
                currentQuestionNo: 0,
            };

            dispatch(addCandidate(newCandidate));

            dispatch(setCurrentCandidateEmail(email));
        }
    }, [candidateInfo, missingFields, candidates, currentCandidateEmail, dispatch]);

    const candidate = useMemo(() => {
        return candidates.find((c) => c.email === currentCandidateEmail);
    }, [candidates, currentCandidateEmail]);

    if (!infoFromResume) {
        return <ResumeUpload setInfoFromResume={setInfoFromResume} />;
    }

    // 2. Info is incomplete and Show form
    if (missingFields.length > 0) {
        return (
            <GettingMissingInfo
                missingFields={missingFields}
                setMissingFields={setMissingFields}
                infoFromResume={infoFromResume}
                setCandidateInfo={setCandidateInfo}
            />
        );
    }

    // 3. Info is complete and candidate is loaded and then Check for existing chat history
    console.log(
        candidate &&
            candidate.chatHistory &&
            candidate.chatHistory.length > 0 &&
            !startOver &&
            !continueInterview     );
    if (showWelcomeBackModal) {
        return (
            <WelcomeBackModal
                setStartOver={(val) => {
                    setStartOver(val);
                    setShowWelcomeBackModal(false);
                }}
                setContinueInterview={(val) => {
                    setContinueInterview(val);
                    setShowWelcomeBackModal(false);
                }}
            />
        );
    }

    // 4. Ready to chat or loading
    return candidate ? (
        <ChatInterface candidate={candidate} />
    ) : (
        <div className="p-4 text-center text-gray-500 font-inter">Processing candidate data...</div>
    );
};

export default IntervieweeTab;
