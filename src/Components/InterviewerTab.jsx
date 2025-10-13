import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Search, SortAsc, User } from "lucide-react";
import CandidateDetails from "./CandidateDetails";

const InterviewerTab = () => {
    console.log("InterviewerTab rendered!");
    const candidates = useSelector((state) => state.candidates);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("score");
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        console.log("candidates updated");
    }, [candidates]);

    const filteredAndSortedCandidates = candidates
        .filter(
            (candidate) =>
                candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "score") {
                return (b.score || 0) - (a.score || 0);
            } else if (sortBy === "name") {
                return (a.name || "").localeCompare(b.name || "");
            }
            return 0;
        });

    if (selectedCandidate) {
        return <CandidateDetails candidate={selectedCandidate} onBack={() => setSelectedCandidate(null)} />;
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Dashboard</h2>

                {/* Search and Sort */}
                <div className="flex space-x-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <SortAsc className="text-gray-400 h-5 w-5" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="score">Sort by Score</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-4">
                    {filteredAndSortedCandidates.map((candidate) => (
                        <div
                            key={candidate.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => setSelectedCandidate(candidate)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 rounded-full p-2">
                                        <User className="h-6 w-6 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {candidate.name || "Unknown Candidate"}
                                        </h3>
                                        <p className="text-sm text-gray-600">{candidate.email}</p>
                                        <p className="text-sm text-gray-600">{candidate.phone}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            candidate.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : candidate.status === "in-progress"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {candidate.status?.replace("-", " ") || "pending"}
                                    </div>
                                    {candidate.score && (
                                        <p className="text-lg font-bold text-gray-900 mt-1">
                                            {candidate.score}/100
                                        </p>
                                    )}
                                </div>
                            </div>

                            {candidate.summary && (
                                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{candidate.summary}</p>
                            )}
                        </div>
                    ))}

                    {filteredAndSortedCandidates.length === 0 && (
                        <div className="text-center py-8">
                            <User className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by having candidates upload their resumes in the Interviewee tab.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewerTab;
