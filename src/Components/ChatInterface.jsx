import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { addChatMessage, updateCandidate } from "../Store/Store.js";
import { getAllQuestions } from "../Utils/QuestionGenerator";
import { evaluateAnswer } from "../Utils/AiEvaluator.js";
import Timer from "./Timer";
import UserResponse from "./UserResponse.jsx";

// sub components
const ChatMessage = React.memo(({ msg }) => {
    const base = "max-w-3/4 rounded-lg px-4 py-2 text-sm";
    const typeStyles = {
        question: "bg-blue-100 text-blue-900",
        answer: "bg-gray-100 text-gray-900 self-end",
        evaluation: "bg-purple-100 text-purple-900",
        summary: "bg-green-100 text-green-900",
    };
    const styles = `${base} ${typeStyles[msg.type] || "bg-gray-100 text-gray-900"}`;

    return (
        <div className={`flex ${msg.type === "answer" ? "justify-end" : "justify-start"}`}>
            <div className={styles}>
                {msg.type === "question" && <div className="text-xs mt-1 font-medium">Q. No. {msg.qno}</div>}
                <p>{msg.content}</p>
                {msg.score != null && <p className="text-xs mt-1 font-medium">Score: {msg.score}/100</p>}
            </div>
        </div>
    );
});

const EvaluatingMessage = React.memo(() => (
    <div className="flex justify-start">
        <div className="bg-purple-100 text-purple-900 rounded-lg px-4 py-2 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm">Evaluating your answer...</span>
        </div>
    </div>
));

// --- Main Component ---

const ChatInterface = ({ candidate }) => {
    console.log("ChatInterface rendered");
    const dispatch = useDispatch();
    const [questions, setQuestions] = useState([]);
    const [fetchingQue, setFetchingQue] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [currQue, setCurrQue] = useState(null);
    const [startTimer, setStartTimer] = useState(false);
    const messagesEndRef = useRef(null); // this is for scrolling

    const currQueIdx = candidate.currentQuestionNo;
    const currAnsRef = useRef(""); // this sent to userRespose component and collect answer from user

    const questionsInitializedRef = useRef(false);
    const isSubmittingRef = useRef(false);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    /*Helper Methods */
    const addQuestion = useCallback(
        (question) => {
            if (!question) return;
            const quesObj = {
                id: Date.now(),
                type: "question",
                content: question.question,
                qno: question.id,
            };
            dispatch(addChatMessage({ id: candidate.id, msg: quesObj }));
            console.log("Question added:", question.question);
        },
        [dispatch, candidate.id]
    );

    const addAnswer = useCallback(
        (answerText) => {
            const ansObj = {
                id: Date.now(),
                type: "answer",
                content: answerText || "No answer provided",
            };
            dispatch(addChatMessage({ id: candidate.id, msg: ansObj }));
            return ansObj;
        },
        [dispatch, candidate.id]
    );

    const addEvaluation = useCallback(
        async (question, answerText) => {
            const evaluation = await evaluateAnswer(question, answerText || "No answer provided");
            const evalMsg = {
                id: Date.now(),
                type: "evaluation",
                content: `Score: ${evaluation.score}/100 - ${evaluation.feedback}`,
                score: evaluation.score,
            };
            dispatch(addChatMessage({ id: candidate.id, msg: evalMsg }));
            return evalMsg;
        },
        [dispatch, candidate.id]
    );

    const addSummary = useCallback(
        (finalSummary) => {
            const summaryMsg = {
                id: Date.now(),
                type: "summary",
                content: finalSummary,
            };
            dispatch(addChatMessage({ id: candidate.id, msg: summaryMsg }));
        },
        [dispatch, candidate.id]
    );

    useEffect(() => {
        if (candidate?.question) return;
        const initQuestionBank = async () => {
            if (questionsInitializedRef.current || fetchingQue) return;

            setFetchingQue(true);
            try {
                const questionsToSet = candidate.questions?.length
                    ? candidate.questions
                    : await getAllQuestions(candidate.role);

                setQuestions(questionsToSet);
                questionsInitializedRef.current = true;

                if (!candidate.questions?.length) {
                    dispatch(
                        updateCandidate({
                            id: candidate.id,
                            questions: questionsToSet,
                        })
                    );
                }
            } catch (err) {
                console.error("Failed to fetch questions:", err);
            } finally {
                setFetchingQue(false);
            }
        };

        if (!questions.length && !fetchingQue && !questionsInitializedRef.current) {
            initQuestionBank();
        }
    }, [candidate, dispatch, questions.length, fetchingQue]);

    useEffect(() => {
        if (candidate.chatHistory.length === 0 && questions.length) {
            addQuestion(questions[0]);
            setCurrQue(questions[0]); // added first question to the chatHistory and currQue
            setStartTimer(true);
            return;
        }

        const processChatState = async () => {
            if (candidate.chatHistory.length === 0) return;

            const lastMessage = candidate.chatHistory[candidate.chatHistory.length - 1];
            console.log("Processing chat state, last message type:", lastMessage.type);

            switch (lastMessage.type) {
                case "question": // Last object in chatHistory is of type question
                    const currentQuestionIndex =
                        candidate.chatHistory.filter((msg) => msg.type === "question").length - 1;
                    if (questions[currentQuestionIndex]) {
                        setCurrQue(questions[currentQuestionIndex]);
                    }
                    setStartTimer(true);
                    break;

                case "answer": // Last object in chatHistory is of type answer
                    if (!isEvaluating) {
                        setIsEvaluating(true);
                        setStartTimer(false);

                        const questionCount = candidate.chatHistory.filter(
                            (msg) => msg.type === "question"
                        ).length;

                        // The question for this answer should be the one at index (questionCount - 1)
                        const questionObj = questions[questionCount - 1];

                        if (questionObj) {
                            console.log("Evaluating answer for question:", questionObj);
                            await addEvaluation(questionObj, lastMessage.content);
                        } else {
                            console.error(
                                "Could not find question object for evaluation. Using currQue state as fallback."
                            );
                            if (currQue) {
                                await addEvaluation(currQue, lastMessage.content);
                            } else {
                                console.error("No question found for evaluation, skipping.");
                            }
                        }

                        setIsEvaluating(false);
                    }
                    break;

                case "evaluation":
                    // Last message is evaluation and check if we need to add next question or summary
                    const questionCount = candidate.chatHistory.filter(
                        (msg) => msg.type === "question"
                    ).length;
                    const answerCount = candidate.chatHistory.filter((msg) => msg.type === "answer").length;
                    const evaluationCount = candidate.chatHistory.filter(
                        (msg) => msg.type === "evaluation"
                    ).length;

                    console.log(
                        `Counts - Questions: ${questionCount}, Answers: ${answerCount}, Evaluations: ${evaluationCount}, Total Questions: ${questions.length}`
                    );

                    // Check if a question-answer-evaluation cycle is complete and there are more questions
                    if (
                        questionCount < questions.length &&
                        questionCount === answerCount &&
                        answerCount === evaluationCount
                    ) {
                        // Add next question
                        const nextQuestionIndex = questionCount;
                        if (nextQuestionIndex < questions.length) {
                            const nextQuestion = questions[nextQuestionIndex];
                            console.log("Adding next question:", nextQuestionIndex);

                            addQuestion(nextQuestion);
                            setCurrQue(nextQuestion);
                            setStartTimer(true);
                            dispatch(
                                updateCandidate({
                                    id: candidate.id,
                                    currentQuestionNo: nextQuestionIndex,
                                })
                            );
                        }
                    } else if (
                        questionCount === questions.length &&
                        questionCount === answerCount &&
                        answerCount === evaluationCount
                    ) {
                        // All questions completed so add summary
                        console.log("All questions completed, adding summary");
                        setIsEvaluating(true);

                        // Calculate final score
                        const evaluations = candidate.chatHistory.filter(
                            (msg) => msg.type === "evaluation" && msg.score != null
                        );
                        const scores = evaluations.map((evalMsg) => evalMsg.score);
                        const finalScore =
                            scores.length > 0
                                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                                : 0;

                        const summary = `Interview completed! Average score: ${finalScore}/100.`;
                        addSummary(summary);

                        setIsEvaluating(false);
                    }
                    break;

                case "summary":
                    // Last message is summary - mark interview as completed
                    console.log("Summary detected, marking interview as completed");

                    // Calculate final score for the candidate record (redundant calculation from above, but for persistence)
                    const evaluations = candidate.chatHistory.filter(
                        (msg) => msg.type === "evaluation" && msg.score != null
                    );
                    const scores = evaluations.map((evalMsg) => evalMsg.score);
                    const finalScore =
                        scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

                    dispatch(
                        updateCandidate({
                            id: candidate.id,
                            status: "completed",
                            score: finalScore,
                            summary: lastMessage.content,
                        })
                    );
                    break;

                default:
                    console.warn("Unknown message type:", lastMessage.type);
                    break;
            }
        };

        if (questions.length > 0 && !fetchingQue) {
            processChatState();
        }
    }, [
        candidate.chatHistory,
        questions,
        fetchingQue,
        dispatch,
        candidate.id,
        addQuestion,
        addEvaluation,
        addSummary,
        isEvaluating,
        currQue,
    ]);

    /* Handle answer submit */
    const handleSubmit = useCallback(
        async (isTimeUp = false) => {
            if (isSubmittingRef.current) return;

            const answerText = currAnsRef.current?.trim() || "";
            if (!answerText && !isTimeUp) return;

            isSubmittingRef.current = true;
            setStartTimer(false);

            try {
                addAnswer(answerText);
            } finally {
                isSubmittingRef.current = false;
                currAnsRef.current = "";
            }
        },
        [addAnswer]
    );

    const handleTimeUp = useCallback(() => {
        handleSubmit(true);
    }, [handleSubmit]);

    useEffect(() => {
        scrollToBottom();
    }, [candidate.chatHistory, isEvaluating, scrollToBottom]);

    if (candidate.status === "completed") {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-2">Interview Complete!</h2>
                <p className="text-lg">Final Score: {candidate.score}/100</p>
                <p className="text-gray-700">{candidate.summary}</p>
            </div>
        );
    }

    if (fetchingQue) {
        return (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold flex items-center gap-4">
                    {candidate.name} - Preparing questions...
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <div className="border-b p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                    {candidate.name} - {candidate.role}
                </h2>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                        Question {Math.min(currQueIdx + 1, questions.length)} of {questions.length}
                    </span>
                    {startTimer && currQue && (
                        <Timer
                            key={`timer-${currQueIdx}`}
                            initialTime={currQue.timeLimit}
                            onTimeUp={handleTimeUp}
                            startTimer={startTimer}
                        />
                    )}
                </div>
            </div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
                {candidate.chatHistory.map((msg) => (
                    <ChatMessage key={msg.id} msg={msg} />
                ))}
                {isEvaluating && <EvaluatingMessage />}
                <div ref={messagesEndRef} />
            </div>

            <UserResponse
                isEvaluating={isEvaluating}
                handleSubmit={handleSubmit}
                currAnsRef={currAnsRef}
                currentQuestion={currQue}
                setStartTimer={setStartTimer}
            />
        </div>
    );
};

export default ChatInterface;
