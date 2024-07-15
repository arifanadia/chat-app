import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { UseSocket } from "@/context/SocketContext";

const MessageBar = () => {
    const emojiRef = useRef();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
    const [message, setMessage] = useState("");
    const { selectedChatType, selectedChatData, userInfo } = useAppStore();
    const socket = UseSocket();


    useEffect(() => {
        function handleClickOutside(e) {
            if (emojiRef.current && !emojiRef.current.contains(e.target)) {
                setEmojiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.addEventListener("mousedown", handleClickOutside)
        }

    }, [])

    const handleAddEmoji = async (emoji) => {
        setMessage((msz) => msz + emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            })
        }
    }
    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
            <div className="flex-1 bg-[#2a2b33] flex items-center rounded-md gap-5 pr-5">
                <input type="text"
                    className="flex-1 bg-transparent rounded-md p-5 focus:border-none focus:outline-none"
                    placeholder="Enter Messages"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} />
                <button className=" focus:border-none focus:text-white text-neutral-500 transition-all duration-300 focus:outline-none">
                    <GrAttachment className="text-2xl" />
                </button>
                <div className="relative">
                    <button className=" focus:border-none focus:text-white text-neutral-500 transition-all duration-300 focus:outline-none"
                        onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-0" ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className=" focus:border-none  focus:text-white bg-[#8417ff] flex items-center justify-center rounded-md p-5 transition-all duration-300 focus:outline-none hover:bg-[#741bda] focus:bg-[#741bda] "
                onClick={handleSendMessage}>
                <IoSend className="text-2xl" />
            </button>
        </div>
    );
};

export default MessageBar;