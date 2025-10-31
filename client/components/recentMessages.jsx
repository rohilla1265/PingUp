import React, { useEffect, useState } from 'react';
import { dummyRecentMessagesData } from '../src/assets/assets';
import { Link } from "react-router-dom";
import moment from 'moment';

const RecentMessages = () => {
    const [messages, setMessages] = useState([]);
    
    const fetchRecentMessages = async() => {
        setMessages(dummyRecentMessagesData);
    };
    
    useEffect(() => {
        fetchRecentMessages();
    }, []);
    
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {messages.map((message, index) => (
                <Link to={`/messages/${message.from_user_id._id}`}
                    key={index} 
                    className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                >
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                        <img 
                            src={message.from_user_id?.profile_picture} 
                            alt={message.from_user_id?.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        {/* Online indicator (optional) */}
                        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                    </div>
                    
                    {/* Message Content */}
                    <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {message.from_user_id?.full_name}
                            </p>
                            <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500 whitespace-nowrap">
                                    {moment(message.createdAt).fromNow()}
                                </p>
                                {!message.seen && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                                        1
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">
                            {message.text ? message.text : '📎 Media'}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default RecentMessages;