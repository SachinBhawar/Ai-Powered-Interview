import React, { useEffect, useRef, useState } from "react";

const UserResponse = ({ isEvaluating, handleSubmit, currAnsRef, setStartTimer }) => {
    const [currAns, setCurrAns] = useState("");
    const textareaRef = useRef(null);
    const handleSubmitButton = (e) => {
        handleSubmit(currAns);
        setCurrAns("");
        setStartTimer(false);
        textareaRef.current.value = "";
    };

    useEffect(() => {
        currAnsRef.current = currAns;
    }, [currAns]);

    return (
        <div className="border-t p-4">
            <textarea
                value={currAns}
                placeholder="Type your answer here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={isEvaluating}
                onChange={(e) => setCurrAns(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitButton();
                    }
                }}
            />
            <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-gray-500"></span>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmitButton();
                    }}
                    ref={textareaRef}
                    disabled={isEvaluating || !currAns.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Answer
                </button>
            </div>
        </div>
    );
};

export default UserResponse;
