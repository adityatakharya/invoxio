import React from "react";

interface MessageInputProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ message, setMessage, handleSendMessage }) => {
    return(
        <div className="p-4 bg-black border-t border-gray-800 flex sticky bottom-0 z-30">
                <input
                type="text"
                className="input input-bordered bg-gray-800 flex-1 mr-2 text-gray-200"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message"
                value={message}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage() }}
                />
                <button 
                className="btn btn-primary"
                onClick={handleSendMessage}>
                Send
                </button>
            </div>
    );
}

interface MessageInputStrangersRoomProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleSendMessage: () => void;
    handleStartChat: () => void;
    handleStopChat: () => void;
    searchingToast: boolean;
    chatIsStopped: boolean;
}

export const MessageInputStrangersRoom: React.FC<MessageInputStrangersRoomProps> = ({ message, setMessage, handleSendMessage, handleStartChat, handleStopChat, searchingToast, chatIsStopped }) => {
    return(
        <div className="p-4 bg-black border-t border-gray-800 flex sticky bottom-0 z-50">
            {chatIsStopped ? (<button 
                                className="btn btn-primary"
                                onClick={handleStartChat}>
                                Start
                            </button>) :
                            (<button 
                                className="btn btn-primary"
                                onClick={handleStopChat}>
                                {searchingToast ? (<span className="loading loading-ring loading-md text-white"></span>) : (<span> Stop </span>)}
                            </button>)
                }
            <input
                type="text"
                className="input input-bordered bg-gray-800 flex-1 ml-2 text-gray-200"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message"
                value={message}
                onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage() }}
            />
        </div>
    );
}