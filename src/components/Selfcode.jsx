/*
1 đầu tiên import useState và axios
2 tạo 1 hàm của components và cấu trúc
3 khai bấo các use state trong hàm cpn
4 tiép đến viết 1 hàm trong biến xử lý nút bấm gửi đi
    1 nếu input có giá trị và không có khoảng tróng thừa thì trả về
    2 tạo biến là mảng nhận tin nhắn mới bao gồm lấy tất cả tin nhắn cũ và 1 đối tượng
    là text và sender với giá trị là input và người gửi sau đó set trạng thái cho message
    3 tạo các thứ cần thiết khi xử lý nút gửi như set input rỗng  và trạng thái đang load
    4 gọi try catch để xử lý api trong đó tạo biến response bằng đọi axios post link đi... 
    5 tạo 1 biến  nhận kết quả trả về từ api nếu ko có thì báo text lỗi
    6 tạo biến xong thì set trạng thái cho mess bao gồm biến đó ...
    7 catch lỗi là error xong sau đó in ra lỗi trong console kiểu lỗi với text đây là lỗi và kèm biến lỗi phía sau
    8 kết thúc catch và cúi cùng load xong
5 tiếp theo code giao diện cho tầm 2 lớp container 
6

*/

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, SparklesIcon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';
import bg from "../assets/bg.jpg";
import {useLocation} from 'react-router-dom';
// import {name} from './Welcome'

const Selfcode = () => {
  const [message, setMessage] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [typingIndex, setTypingIndex] = useState(-1);
  const [displayedText, setDisplayedText] = useState("");
  const [fullText, setFullText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingSpeed = 10; // milliseconds per character
  const location = useLocation();
  // const cusMess = useRef(null);
  const [cusMess, setCusMess] = useState("");
  const name = location.state?.name || "Bạn chưa đặt tên";


  // Auto scroll to bottom when messages change or during typing
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message, displayedText]);

  // Typing effect
  useEffect(() => {
    if (isTyping && typingIndex >= 0 && typingIndex < message.length) {
      if (message[typingIndex].sender === "bot" && !message[typingIndex].isError) {
        const text = fullText;
        let currentIndex = displayedText.length;
        
        if (currentIndex < text.length) {
          const timer = setTimeout(() => {
            setDisplayedText(text.substring(0, currentIndex + 1));
          }, typingSpeed);
          
          return () => clearTimeout(timer);
        } else {
          setIsTyping(false);
          
          // Update the message with the full text once typing is complete
          const updatedMessages = [...message];
          updatedMessages[typingIndex] = {
            ...updatedMessages[typingIndex],
            text: fullText,
            isTypingComplete: true
          };
          setMessage(updatedMessages);
        }
      }
    }
  }, [isTyping, displayedText, fullText, typingIndex, message]);
  
  
  const pElement = (event) => {
    setInput(event.target.textContent);
    if (input === event.target.textContent) {
      handleSend();
    }
  };
  

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = [...message, { text: input, sender: "user"}];
    setMessage(newMessage);

    setInput("");
    setLoading(true);

    try {
      // Gọi API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{ parts: [{ text: input }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
          params: { key: "AIzaSyDS1TH2eBVBO3vdpP2lmCow0xO_Ph4KIPo" },
        }
      );
      
      let result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Đã xảy ra lỗi ở máy chủ";
      console.log(result);
      
      if (result === "Tôi là một mô hình ngôn ngữ lớn, được Google huấn luyện."  && result === "Tôi là một mô hình ngôn ngữ lớn, được Google huấn luyện."){
        result = "Tôi là trợ lý của " .concat(name);
      }
      console.log(result);
      // Add the bot response with empty text initially
      
      const updatedMessages = [...newMessage, {
        text: "", 
        sender: "bot", 
        isTypingComplete: false
      }];
      
      setMessage(updatedMessages);
      setLoading(false);
      
      // Start the typing effect
      setTypingIndex(updatedMessages.length - 1);
      setFullText(result);
      setDisplayedText("");
      setIsTyping(true);
      
    } catch (error){
      console.error("Xảy ra lỗi này nè: ", error);
      setMessage([...newMessage, {
        text: "Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.", 
        sender: "bot", 
        isError: true,
        isTypingComplete: true
      }]);
      setLoading(false);
    }
    
  };

  const enterSubmit = (event) => {
    if(event.key === "Enter"){
      handleSend();
    }
  };

  const clearChat = () => {
    setMessage([]);
    setTypingIndex(-1);
    setIsTyping(false);
  };

  const renderMessageText = (mess, index) => {
    if (mess.sender === "bot" && index === typingIndex && isTyping && !mess.isTypingComplete) {
      return <span>{displayedText}<span className="ml-1 inline-block w-1 h-4 bg-current animate-pulse"></span></span>;
    }
    return mess.text;
  };

  return (
    <div className={`min-h-screen bg-cover bg-center p-4 md:p-6 transition-all duration-500`}
      style={{ backgroundImage: `url(${bg})` }}>
      
      <div className={`max-w-6xl mx-auto rounded-2xl overflow-hidden ${darkMode 
        ? 'bg-gray-800 border border-gray-700 shadow-[0_0_30px_rgba(56,189,248,0.2)]' 
        : 'bg-white border border-sky-100 shadow-[0_10px_50px_rgba(0,0,0,0.1)]'} 
        backdrop-blur-sm transition-all duration-300`}>
        
        {/* Header */}
        <div className={`${darkMode 
          ? 'bg-gradient-to-r from-[#0b839f] to-cyan-900' 
          : 'bg-gradient-to-r from-[#0b839f] to-cyan-500'} 
          py-2 px-6 relative transition-all duration-300`}>
          
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-2xl md:text-3xl text-white flex items-center">
              <SparklesIcon className="h-8 w-8 mr-3 animate-bounce" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">{name} AI</span>
            </h1>
            
            <div className="flex space-x-3">
              <button 
                onClick={clearChat} 
                className="p-2 rounded-full hover:bg-white/10 transition-all text-white/90 hover:text-white"
                title="Clear chat">
                <XMarkIcon className="h-5 w-5" />
              </button>
              
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full hover:bg-white/10 transition-all text-white/90 hover:text-white"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className={`h-[65vh] overflow-y-auto ${darkMode 
          ? 'bg-gray-900 scrollbar-thumb-gray-600' 
          : 'bg-gradient-to-br from-white to-blue-50/50 scrollbar-thumb-blue-200'} 
          p-4 md:p-6 scrollbar-thin scrollbar-track-transparent transition-all duration-300`}>
          
          {message.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} max-w-md p-8 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-blue-100'} transition-all duration-300`}>
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className={`h-12 w-12 ${darkMode ? 'text-[#0b839f]' : 'text-cyan-400'} animate-pulse`} />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0b839f] to-cyan-500 opacity-20 blur-xl animate-pulse"></div>
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Your AI Assistant</h3>
                <p className="text-lg">Chào mừng bạn! Bạn có thể bắt đầu hỏi bất kỳ điều gì.</p>
              </div>
            </div>
          )}
          
          {message.map((mess, index) => (
            
            <div 
              key={index}
              className={`flex ${mess.sender === "user" ? "justify-end" : "justify-start"} mb-5 animate-fade-in`}
            >
              {mess.sender !== "user" && (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0b839f] to-cyan-500 p-0.5 mr-2 flex-shrink-0 shadow-md">
                  <div className={`h-full w-full rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <SparklesIcon className="h-5 w-5 text-cyan-500" />
                  </div>
                </div>
              )}
              
              <div 
                className={`rounded-2xl py-3 px-4 max-w-xs md:max-w-md lg:max-w-lg transition-all duration-300 ${
                  mess.sender === "user"
                    ? `${darkMode ? 'bg-[#0b839f]/40' : 'bg-gradient-to-r from-[#0b839f] to-cyan-500'} text-white rounded-tr-none shadow-lg`
                    : mess.isError
                      ? `${darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'} ${darkMode ? 'text-red-200' : 'text-red-800'} rounded-tl-none`
                      : `${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} ${darkMode ? 'text-gray-200' : 'text-gray-800'} rounded-tl-none shadow-md`
                }`}
              >
                {renderMessageText(mess, index)}
              </div>
              
              {mess.sender === "user" && (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0b839f] to-teal-400 p-0.5 ml-2 flex-shrink-0 shadow-md">
                  <div className={`h-full w-full rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <UserCircleIcon className="h-6 w-6 text-[#0b839f]" />
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0b839f] to-cyan-500 p-0.5 mr-2 flex-shrink-0 shadow-md">
                <div className={`h-full w-full rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <SparklesIcon className="h-5 w-5 text-cyan-500" />
                </div>
              </div>
              <div className={`${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'} text-gray-800 rounded-2xl py-3 px-5 rounded-tl-none ${darkMode ? 'text-gray-200' : 'text-gray-800'} shadow-md`}>
                <div className="flex space-x-2">
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-[#0b839f]'} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-[#0b839f]'} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-3 h-3 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-[#0b839f]'} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} transition-all duration-300`}>
          <div className={`flex rounded-full border ${darkMode ? 'bg-gray-900 border-gray-700 focus-within:border-[#0b839f]' : 'bg-gray-50 border-gray-200 focus-within:border-[#0b839f]/60'} overflow-hidden transition-all duration-300 focus-within:shadow-lg`}>
            <input 
              type="text" 
              placeholder="Nhập tin nhắn của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={enterSubmit}
              className={`flex-grow py-3 px-5 bg-transparent outline-none ${darkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-700 placeholder:text-gray-400'} transition-all duration-300`} 
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !input.trim() || isTyping} 
              className={`px-5 flex items-center justify-center transition-all duration-300 ${
                loading || !input.trim() || isTyping
                  ? `${darkMode ? 'text-gray-600' : 'text-gray-400'}`
                  : `${darkMode ? 'text-[#0b839f] hover:text-blue-300' : 'text-[#0b839f] hover:text-[#0b839f]/80'} hover:bg-gradient-to-r ${darkMode ? 'hover:from-gray-800 hover:to-gray-700' : 'hover:from-blue-50 hover:to-cyan-50'}`
              }`}
            >
              <PaperAirplaneIcon className="h-6 w-6 transform rotate-270" />
            </button>
          </div>
          
          <div className={`flex justify-center gap-3 text-center text-xs md:text-sm mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className='p-1'>Hãy thử với các gợi ý sau:</p>
            <p onClick={pElement} className='px-2 py-1 border-1 rounded-full cursor-pointer'>Bạn là ai</p>
            <p onClick={pElement} className='px-2 py-1 border-1 rounded-full cursor-pointer'>J97 có bỏ con không</p>
            <p onClick={pElement} className='px-2 py-1 border-1 rounded-full cursor-pointer'>Khi nào thì bán được 1 tỷ gói mè</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selfcode;
