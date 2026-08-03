function VerificationStatus({ success }) {
    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-5xl mb-3">✅</div>

                <h2 className="text-2xl font-bold text-green-700">
                    Receipt Verified
                </h2>

                <p className="text-green-600 mt-2">
                    This is a genuine donation receipt issued by
                    <strong> Vidya Jyothi Foundation.</strong>
                </p>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-3">❌</div>

            <h2 className="text-2xl font-bold text-red-700">
                Invalid Receipt
            </h2>

            <p className="text-red-600 mt-2">
                The receipt you are trying to verify could not be found or has
                been cancelled.
            </p>
        </div>
    );
}

export default VerificationStatus;