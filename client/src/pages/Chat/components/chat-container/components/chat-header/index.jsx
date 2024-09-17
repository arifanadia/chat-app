import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
    const { closeChat, selectedChatData,selectedChatType } = useAppStore();
    return (
        <div className="h-[20vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20 ">
            <div className="flex gap-5 items-center justify-between w-full">
                <div className="flex gap-3 items-center justify-center">
                    <div className="w-12 h-12 relative">
                        <Avatar className="size-12  rounded-full overflow-hidden">
                            {
                                selectedChatData.image ?
                                    <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile-image" className="size-full object-cover bg-black" />
                                    :
                                    <div className={`uppercase size-12  border-[1px] text-xl flex items-center justify-center rounded-full ${getColor(selectedChatData.color)} `}>
                                        {
                                            selectedChatData.firstName ?
                                                selectedChatData.firstName.split("").shift()
                                                :
                                                selectedChatData.email.split("").shift()
                                        }
                                    </div>
                            }
                        </Avatar>
                    </div>
                    <div>
                        {
                            selectedChatType === "contact" && 
                            selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                            : selectedChatData.email
                        }
                    </div>
                </div>
                <div className="flex gap-5 items-center justify-center">
                    <button className=" focus:border-none focus:text-white text-neutral-500 transition-all duration-300 focus:outline-none"
                        onClick={closeChat} >
                        <RiCloseFill className="text-3xl"
                        />
                    </button>

                </div>
            </div>

        </div>
    );
};

export default ChatHeader;