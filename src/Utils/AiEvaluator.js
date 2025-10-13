import generateAiContent from "../Services/GeminiApi";

export const evaluateAnswer = async (questionInput, answer) => {
    const questionText = typeof questionInput === "string" ? questionInput : questionInput?.question || "";
    const difficultyLavel =
        typeof questionInput === "object" && questionInput?.type ? questionInput.type : "unspecified";

    console.log("question text is :" + questionText + "and the difficulty level : " + difficultyLavel);
    const prompt = `
    Evaluate this technical interview answer for a ${difficultyLavel} difficulty question.
    
    Question: ${questionText}
    Candidate's Answer: ${answer}
    
    Please evaluate based on:
    1. Technical accuracy and correctness
    2. Depth of understanding
    3. Clarity and communication
    4. Relevance to the question
    
    Provide a score from 1-100 and constructive feedback (2-3 sentences).
    
    Return ONLY JSON in this exact format:
    {
      "score": 85,
      "feedback": "Your feedback here..."
    }
  `;

    try {
        const response = await generateAiContent(prompt);

        console.log("AI evaluation of the question:", response);
        return response;
    } catch (error) {
        console.error("Error evaluating answer:", error);
        return {
            score: 50,
            feedback:
                "Unable to evaluate at this time. Please ensure your answer addresses the technical concepts mentioned in the question.",
        };
    }
};
