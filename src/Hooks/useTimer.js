import { useState, useEffect, useRef } from "react";

export const useTimer = (initialTime, onTimeUp) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef();

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            onTimeUp?.();
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft, onTimeUp]);

    const start = () => setIsRunning(true);
    const pause = () => setIsRunning(false);
    const reset = (newTime = initialTime) => {
        setIsRunning(false);
        setTimeLeft(newTime);
    };

    return { timeLeft, isRunning, start, pause, reset };
};
