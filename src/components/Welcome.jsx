import bg from "../assets/bg.jpg";
import { useState } from "react";
import {useNavigate} from "react-router-dom"
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

const Welcome = () => {
    const [input, setInput] = useState("")
    const navigate = useNavigate()
    // const name = input
    const handleClick = (e) => {
        if (input === "") {
            e.preventDefault();

        } else {
        navigate('/home',{state:{name:input}})
        }
    }
    const handleEnter = (event) => {
        if (event.key === "Enter")
        return handleClick()
    }
    return (
        <div className="relative w-full h-screen bg-cover bg-center flex justify-center items-center backdrop-blur-md"
        style={{ backgroundImage: `url(${bg})` }} // ✅ Dùng style để đặt ảnh nền
        >
        {/* Nội dung nằm trên ảnh nền */}
            <div className="bg-gray-500/10 backdrop-blur-2xl w-sm md:w-xl h-auto p-10 rounded-lg shadow-2xl ">
                <h1 className="text-xl font-bold text-center">Hãy đặt tên cho AI của bạn</h1>
                <div className="relative flex justify-end mt-4">
                    <input value={input} onKeyDown={handleEnter} onChange={(e) => setInput(e.target.value)} type="text" name="" id=""  className="bg-[#0b839f] w-full p-2 pl-4 rounded-full pr-14 outline-none focus:ring-1 ring-gray-700"/>
                    <PaperAirplaneIcon onClick={handleClick} className="absolute  h-10 w-10 text-black p-1 rounded-e-full hover:text-white" />
                </div>
            </div>
        </div>
    );
    };
 
export default Welcome;
