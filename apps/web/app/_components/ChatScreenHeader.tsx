import React from "react";
import logo from "../../public/Purple_logo.png";

interface ChatScreenHeaderProps {
    headingText: string
}

const ChatScreenHeader: React.FC<ChatScreenHeaderProps> = ({headingText}) => {
    return (
        <div className="border-b border-gray-700 bg-black text-white p-4 sticky top-0 z-10 flex justify-between items-center">
            <h1 className="text-2xl font-bold">{headingText}</h1>
            <a href="/">
                <img src={logo.src} alt="Purple Logo" className="h-14"/>
            </a>
        </div>
    );
};
export default ChatScreenHeader;