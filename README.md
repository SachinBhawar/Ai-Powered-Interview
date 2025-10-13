# AI-Powered Interview

An AI-powered interview platform built with React that helps candidates and interviewers conduct smart interviews with AI-generated questions, timed answers, and real-time evaluation.

## Demo

Try it live:  
[https://ai-powered-interview-by-sachin.vercel.app/](https://ai-powered-interview-by-sachin.vercel.app/)

## Features

### Interviewee Tab
- Upload resume in PDF or DOCX format
- Auto-extract candidate details (name, email, phone, role)
- Manually enter missing details if not parsed from resume
- AI generates 6 interview questions (2 easy, 2 medium, 2 hard) based on role
- Candidate answers questions within a set timer
- AI evaluates answers and provides score out of 100 per question
- Final summary with average score and detailed feedback
- Saves interview results to store

### Interviewer Tab
- View list of all candidates with their scores and interview statuses
- See real-time updates: interview in progress or completed
- Syncs automatically with interviewee progress

## Tech Stack

- React.js (with hooks and context/state management)
- AI models for question generation and answer evaluation
- Resume parsing libraries for PDF and DOCX
- Real-time data synchronization (e.g., WebSockets or Firebase)
- Deployment on Vercel

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
git clone https://github.com/SachinBhawar/Ai-Powered-Interview.git
cd Ai-Powered-Interview
npm install

text

### Running Locally
npm start

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Future Enhancements

- Add user authentication & role-based access control
- Improve AI question and answer evaluation intelligence
- Support for additional resume file types and parsing accuracy
- Analytics dashboard for interviewers
- Export interview results and reports

## Contributing

Contributions, issues, and feature requests welcome!  
Feel free to check [issues page](https://github.com/SachinBhawar/Ai-Powered-Interview/issues).

Please ensure any PRs follow existing code style and add appropriate tests.

## License

This project is licensed under the MIT License.  
See the [LICENSE](./LICENSE) file for details.

---

Made with ❤️ by Sachin Bhawar
