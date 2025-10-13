import { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { extractResumeDetailsFromFile } from "../Utils/ResumeParser.js";

const ResumeUpload = ({ setInfoFromResume }) => {
    console.log("Resume upload rendered");
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a PDF or DOCX file");
            return;
        }

        setIsLoading(true);

        try {
            const parsedData = await extractResumeDetailsFromFile(file);

            setInfoFromResume(parsedData);
        } catch (error) {
            alert("Error parsing resume: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, []);

    const handleChange = useCallback((e) => {
        const file = e.target.files[0];
        handleFile(file);
    }, []);

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Upload Your Resume</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Upload your resume in PDF or DOCX format to start the interview
                </p>
            </div>

            <div
                className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleChange}
                    className="hidden"
                    id="resume-upload"
                />
                <label
                    htmlFor="resume-upload"
                    className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <span>Choose a file</span>
                    <input id="resume-upload" name="resume-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1 text-gray-600">or drag and drop</p>
                <p className="text-xs text-gray-500 mt-2">PDF, DOCX up to 10MB</p>
            </div>

            {isLoading && (
                <div className="mt-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-600">Processing your resume...</p>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
