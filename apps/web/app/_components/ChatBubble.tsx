interface ChatMessageProps {
    key: any;
    message: any;
    isOwn: boolean;
    timestamp: string;
    onContextMenu: (e: React.MouseEvent, message: string, side: string) => void;
    onTouchStart: (e: React.TouchEvent, message: string, side: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ key, message, isOwn, timestamp, onContextMenu, onTouchStart }) => {

    const getCurrentTime = (dateobj: Date) => {
        const hour = dateobj.getHours();
        const minute = dateobj.getMinutes();
        return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
    };

    return (
        <>
        {isOwn ? (
            <div className="chat chat-end mb-4">
            <div className="chat-header text-sm opacity-50 text-gray-100 pr-2 mb-1">
                You
                <time className="text-xs opacity-50 ml-1">{getCurrentTime(new Date(timestamp))}</time>
            </div>
            <div 
                className="chat-bubble bg-gray-800 text-blue-300"
                onContextMenu={(e) => onContextMenu(e, message.message, "right")}
                onTouchStart={(e) => onTouchStart(e, message.message, "right")}
            >
                {message.message}
            </div>
        </div>) : (
            <div className="chat chat-start mb-4">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="User avatar"
                            src="https://i.pinimg.com/originals/ed/63/5c/ed635c29fffe09d3c1f706ca2cc6e404.jpg" 
                        />
                    </div>
                </div>
                <div className="chat-header text-sm opacity-50 text-gray-100 pl-2 mb-1">
                    {message.username}
                    <time className="text-xs opacity-50 ml-1">{getCurrentTime(new Date(timestamp))}</time>
                </div>
                <div 
                    className="chat-bubble text-green-300"
                    onContextMenu={(e) => onContextMenu(e, message.message, "left")}
                    onTouchStart={(e) => onTouchStart(e, message.message, "left")}
                >
                    {message.message}
                </div>
            </div>
        )}
        </>

    );
};
export default ChatMessage;
