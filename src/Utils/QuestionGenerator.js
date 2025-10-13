import generateAiContent from "../Services/GeminiApi";

export const getAllQuestions = async (role) => {
    console.log(role);
    const prompt = `
            Based on the following resume context for a ${role} position, generate 6 technical interview questions:
            2 Easy, 2 Medium, 2 Hard.
            
                  
            Important Guidelines:
            - Easy questions should test fundamental concepts (30-second time limit)
            - Medium questions should test practical application (60-second time limit) 
            - Hard questions should test advanced concepts and architecture (120-second time limit)
            
            Return ONLY a JSON array in this exact format:
            [
              {
                "id": 1,
                "question": "Specific technical question here...",
                "type": "easy",
                "timeLimit": 30
              },
              {
                "id": 2,
                "question": "Another fundamental question...",
                "type": "easy", 
                "timeLimit": 30
              },
              {
                "id": 3,
                "question": "Practical application question...",
                "type": "medium",
                "timeLimit": 60
              },
              {
                "id": 4,
                "question": "Problem-solving question...",
                "type": "medium", 
                "timeLimit": 60
              },
              {
                "id": 5,
                "question": "Advanced architecture question...",
                "type": "hard",
                "timeLimit": 120
              },
              {
                "id": 6,
                "question": "Complex system design question...",
                "type": "hard",
                "timeLimit": 120
              }
            ]
          `;

    try {
        const responseFromAI = await generateAiContent(prompt);

        return responseFromAI;
    } catch (error) {
        console.log("Error occured so returning fallbackquestions", error);
        return fallbackQuestions;
    }
};

// Fallback questions in case AI fetching questions error occured
const fallbackQuestions = {
    easy: [
        {
            id: 1,
            question: "What is React and what are its key features?",
            type: "easy",
            timeLimit: 30,
        },
        {
            id: 2,
            question: "Explain the difference between let, const, and var in JavaScript.",
            type: "easy",
            timeLimit: 30,
        },
    ],
    medium: [
        {
            id: 3,
            question: "How would you optimize React application performance?",
            type: "medium",
            timeLimit: 60,
        },
        {
            id: 4,
            question: "Explain REST API principles and how you would design one for a blog system.",
            type: "medium",
            timeLimit: 60,
        },
    ],
    hard: [
        {
            id: 5,
            question: "Describe how you would implement server-side rendering with React and Node.js.",
            type: "hard",
            timeLimit: 120,
        },
        {
            id: 6,
            question: "Explain microservices architecture and its trade-offs compared to monoliths.",
            type: "hard",
            timeLimit: 120,
        },
    ],
};
