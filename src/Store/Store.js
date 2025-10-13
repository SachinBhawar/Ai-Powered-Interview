import { configureStore, createSlice } from "@reduxjs/toolkit";
import { loadState, saveState } from "./localStorage";

const initialState = {
    candidates: [],
    currentCandidateEmail: null,
    activeTab: "interviewee",
    sessionPaused: false,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        addCandidate: (state, action) => {
            state.candidates.push({
                id: Date.now().toString(),
                ...action.payload, // name, email, phone, role
                score: 0,
                status: "ready", // ready, in-progress, completed
                chatHistory: [],
                questions: [],
                currentQuestionNo: 0,
            });
        },
        updateCandidate: (state, action) => {
            const index = state.candidates.findIndex((c) => c.id === action.payload.id);
            if (index !== -1) {
                state.candidates[index] = { ...state.candidates[index], ...action.payload };
            }
        },
        setCurrentCandidateEmail: (state, action) => {
            state.currentCandidateEmail = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        addChatMessage: (state, action) => {
            const { id, msg } = action.payload;
            const candidate = state.candidates.find((c) => c.id === id);
            if (candidate) {
                const lastMsg = candidate.chatHistory[candidate.chatHistory.length - 1];
                if (lastMsg?.type === "answer" && msg.type === "answer") return;

                candidate.chatHistory.push(msg);

                if (candidate.status === "ready") {
                    candidate.status = "in-progress";
                }
            }
        },
        updateProgress: (state, action) => {
            const { candidateId, status } = action.payload;
            const candidate = state.candidates.find((c) => c.id === candidateId);
            if (candidate) {
                candidate.status = status;
            }
        },
        setSessionPaused: (state, action) => {
            state.sessionPaused = action.payload;
        },
    },
});

export const {
    addCandidate,
    updateCandidate,
    setCurrentCandidateEmail,
    setActiveTab,
    addChatMessage,
    updateProgress,
    setSessionPaused,
} = appSlice.actions;

// Load from localStorage
const preloadedState = loadState();

export const store = configureStore({
    reducer: appSlice.reducer,
    preloadedState,
});

// Save to localStorage on every change
store.subscribe(() => {
    saveState(store.getState());
});
