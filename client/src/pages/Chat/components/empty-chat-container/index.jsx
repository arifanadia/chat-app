import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";


const EmptyChatContainer = () => {
    return (
        <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-1000 transition-all ">
            <Lottie
            isClickToPauseDisabled={true}
            height={200}
            width={200}
            options={animationDefaultOptions}/>
            <div className="text-opacity-80 text-white flex flex-col items-center text-center text-3xl lg:text-4xl transition-all duration-300 gap-5 mt-10">
                <h3 className="poppins-medium">
                    Hi<span className="text-purple-500">! </span>
                    Welcome to 
                    <span className="text-purple-500"> Chat</span>
                    App
                </h3>
            </div>
        </div>
    );
};

export default EmptyChatContainer;