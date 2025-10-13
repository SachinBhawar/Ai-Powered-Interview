function GettingMissingInfo({ missingFields, setMissingFields, infoFromResume, setCandidateInfo }) {
    console.log("GettingMissingInfo rendered!");

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const candidateData = { ...infoFromResume, ...data };

        setCandidateInfo(candidateData);
        setMissingFields([]);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Complete Your Information</h2>
            <p className="text-gray-600 mb-6">
                We found some missing information in your resume. Please provide the following details:
            </p>

            <form onSubmit={handleSubmit}>
                {missingFields.includes("name") && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                )}

                {missingFields.includes("email") && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                )}

                {missingFields.includes("phone") && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            name="phone"
                            type="tel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                            required
                            autoFocus
                        />
                    </div>
                )}

                {missingFields.includes("role") && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <input
                            name="role"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your phone number"
                            required
                            autoFocus
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Start Interview
                </button>
            </form>
        </div>
    );
}

export default GettingMissingInfo;
