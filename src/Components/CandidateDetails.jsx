import { ArrowLeft } from "lucide-react";

const CandidateDetails = ({ candidate, onBack }) => {
    console.log("CandidateDetails rendered!");
    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <div className="flex items-center space-x-4 mb-6">
                    <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{candidate.name}</h1>
                        <p className="text-gray-600 mb-1">{candidate.email}</p>
                        <p className="text-gray-600">{candidate.phone}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-gray-900 mb-2">{candidate.score}/100</div>
                            <div
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    candidate.score >= 80
                                        ? "bg-green-100 text-green-800"
                                        : candidate.score >= 60
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {candidate.score >= 80
                                    ? "Excellent"
                                    : candidate.score >= 60
                                    ? "Good"
                                    : "Needs Improvement"}
                            </div>
                        </div>
                    </div>
                </div>

                {candidate.summary && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">AI Summary</h3>
                        <p className="text-blue-800">{candidate.summary}</p>
                    </div>
                )}
            </div>

            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Transcript</h2>

                <div className="space-y-6">
                    {candidate.chatHistory?.map((message, index) => (
                        <div
                            key={message.id || index}
                            className={`border-l-4 pl-4 py-2 ${
                                message.type === "question"
                                    ? "border-blue-500 bg-blue-50"
                                    : message.type === "answer"
                                    ? "border-gray-500 bg-gray-50"
                                    : message.type === "evaluation"
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-green-500 bg-green-50"
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm capitalize text-gray-700">
                                    {message.type}:
                                </span>
                                {message.timestamp && (
                                    <span className="text-xs text-gray-500">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-900">{message.content}</p>
                            {message.score && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-700">Score:</span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-bold ${
                                            message.score >= 80
                                                ? "bg-green-100 text-green-800"
                                                : message.score >= 60
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {message.score}/100
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateDetails;
