import { RiCloseFill  } from "react-icons/ri";

const ChatHeader = () => {
    return (
        <div className="h-[20vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
            <div className="flex gap-5 items-center">
                <div className="flex gap-3 items-center justify-center"></div>
                <div className="flex gap-5 items-center justify-center">
                    <button  className=" focus:border-none focus:text-white text-neutral-500 transition-all duration-300 focus:outline-none">
                    <RiCloseFill className="text-3xl" />
                    </button>
                   
                </div>
            </div>

        </div>
    );
};

export default ChatHeader;