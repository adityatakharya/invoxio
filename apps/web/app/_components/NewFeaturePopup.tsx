"use client";

import React from "react";
import saGIF from "../../public/Invoxio SA Feture.gif"

interface PopupProps {
    closePopup: () => void;
}

const NewFeaturePopup: React.FC<PopupProps> = ({ closePopup }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-lg p-4 w-96">
                <button
                    className="absolute top-4 right-2 text-purple-800 hover:text-purple-500"
                    onClick={closePopup}
                >
                    <span className="cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>

                </button>
                <h3 className="text-xl font-semibold text-gray-400 mb-4 top-2">Sentiment Analysis</h3>
                <p className="mb-4 text-gray-600 text-sm">
                    Now AI will analyze the tone of messages for free with our new feature. Tap and hold (on mobile) and Right-click (on Desktop) to use and avoid misnderstandings.
                </p>
                <img
                    src={saGIF.src}
                    alt="Sentiment Analysis Guide"
                    className="w-full rounded-md"
                />
            </div>
        </div>
    );
};

export default NewFeaturePopup;
