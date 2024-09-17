import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoPowerSharp } from "react-icons/io5";
import { apiClient } from "@/lib/api-client";


const ProfileInfo = () => {
    const { userInfo,setUserInfo } = useAppStore();
    const navigate = useNavigate();


    const logOut = async () => {
        try {
            const res = await apiClient.post(LOGOUT_ROUTE,
                {},
                { withCredentials: true }
            )
            console.log(res);
            if(res.status === 200){
                navigate('/auth')
                setUserInfo(null)
               
            }

        } catch (err) {
            console.log(err);
        }

    }
    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 bg-[#212b33] w-full ">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="size-12  rounded-full overflow-hidden">
                        {
                            userInfo.image ?
                                <AvatarImage src={`${HOST}/${userInfo.image}`} alt="profile-image" className="size-full object-cover bg-black" />
                                :
                                <div className={`uppercase size-12 border-[1px] text-2xl flex items-center justify-center rounded-full ${getColor(userInfo.color)} `}>
                                    {
                                        userInfo.firstName ?
                                            userInfo.firstName.split("").shift()
                                            :
                                            userInfo.email.split("").shift()
                                    }
                                </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className="text-purple-500 font-medium text-xl"
                                onClick={() => navigate("/profile")} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] text-white border-none">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp className="text-red-500 font-medium text-xl"
                                onClick={logOut} />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] text-white border-none">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

        </div>
    );
};

export default ProfileInfo;