import React, { useEffect, useRef, useState } from 'react';
import { dummyMessagesData, dummyUserData } from '../src/assets/assets';
import { Image, X, Send } from 'lucide-react';

export default function Chatbox(){
    const messages = dummyMessagesData;
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [user, setUser] = useState(dummyUserData);
    const messageEndRef = useRef(null);
    const fileInputRef = useRef(null);
    
    const sendMessage = () => {
        if (text.trim() || images.length > 0) {
            // Your send message logic here
            console.log('Sending message:', { text, images });
            setText('');
            setImages([]);
        }
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        e.target.value = ''; // Reset input
    }

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    }

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, user, images]);

    return user && (
        <div className='flex flex-col h-screen bg-gray-50'>
            {/* Header */}
            <div className='flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 shadow-sm'>
                <img 
                    src={user.profile_picture} 
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full border-2 border-white shadow" 
                />
                <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.full_name}</p>
                    <p className="text-xs text-gray-500 -mt-1">@{user.username}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
                {messages.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message, index) => (
                    <div key={index} className={`flex flex-col ${message.to_user_id !== user._id ? 'items-start' : 'items-end'}`}>
                        <div className={`p-3 max-w-xs md:max-w-md rounded-2xl shadow ${
                            message.to_user_id !== user._id 
                                ? 'bg-white text-gray-800 rounded-bl-none border border-gray-100' 
                                : 'bg-blue-500 text-white rounded-br-none'
                        }`}>
                            {message.message_type === 'image' && (
                                <img 
                                    src={message.media_url}
                                    className='w-full rounded-lg mb-2 shadow-sm' 
                                    alt="Shared content" 
                                />
                            )}
                            <p className="text-sm break-words">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                                message.to_user_id !== user._id ? 'text-gray-400' : 'text-blue-100'
                            }`}>
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                
                {/* Preview selected images */}
                {images.length > 0 && (
                    <div className="flex flex-col items-end space-y-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 max-w-xs">
                            <p className="text-xs text-blue-600 font-medium mb-2">Ready to send ({images.length} image{images.length > 1 ? 's' : ''})</p>
                            <div className="grid grid-cols-2 gap-2">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img 
                                            src={URL.createObjectURL(image)} 
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messageEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
                {/* Image preview row */}
                {images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                        {images.map((image, index) => (
                            <div key={index} className="relative flex-shrink-0">
                                <img 
                                    src={URL.createObjectURL(image)} 
                                    alt={`Preview ${index + 1}`}
                                    className="w-16 h-16 object-cover rounded-lg border"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="flex gap-2 items-end">
                    {/* Image upload button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    >
                        <Image className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    
                    {/* Text input */}
                    <div className="flex-1">
                        <input 
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type your message..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                    </div>
                    
                    {/* Send button */}
                    <button 
                        onClick={sendMessage}
                        disabled={!text.trim() && images.length === 0}
                        className="flex-shrink-0 px-4 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-1"
                    >
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                    </button>
                </div>
                
                {/* File info */}
                {images.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        {images.length} image{images.length > 1 ? 's' : ''} selected • Click send to share
                    </p>
                )}
            </div>
        </div>
    )
}