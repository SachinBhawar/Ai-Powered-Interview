import React, { useState, useEffect, useRef } from "react";

const Timer = ({ initialTime = 0, onTimeUp, startTimer = false }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const onTimeUpRef = useRef(onTimeUp);

    useEffect(() => {
        onTimeUpRef.current = onTimeUp;
    }, [onTimeUp]);

    useEffect(() => {
        if (!startTimer || initialTime <= 0) return;

        setTimeLeft(initialTime);

        let interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUpRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [startTimer, initialTime]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const getTimerColor = () => {
        if (initialTime !== 0 && timeLeft / initialTime > 0.6) return "text-green-600";
        if (initialTime !== 0 && timeLeft / initialTime > 0.3) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className={`text-lg font-mono font-bold ${getTimerColor()}`}>
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </div>
    );
};

export default React.memo(Timer);
