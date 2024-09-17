import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";




const Profile = () => {
    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileInputRef = useRef(null)
    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName)
            setSelectedColor(userInfo.color)

        }
        if (userInfo.image) {
            setImage(`${HOST}/${userInfo.image}`)
        }
    }, [userInfo])

    console.log(setImage);
    const validateProfile = () => {
        if (!firstName) {
            toast.error("First Name is Required")
            return false
        }
        if (!lastName) {
            toast.error("Last Name is Required")
            return false
        }
        return true
    }

    const saveChanges = async () => {
        try {
            if (validateProfile()) {
                const res = await apiClient.post(UPDATE_PROFILE_ROUTE,
                    { firstName, lastName, color: selectedColor },
                   
                );
                if (res.status === 200 && res.data) {
                    setUserInfo({ ...res.data.user });
                    toast.success("Profile updated successfully")
                    navigate("/chat")
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat")
        } else {
            toast.error("Please setup profile.")
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    }
    const handleImageChange = async (e) => {
        const file = e.target.files[0]
        console.log(file);
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file);
            const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData);
            console.log(res);
            if (res.status === 200 && res.data.user.image) {
                setUserInfo({ ...userInfo, image: res.data.user.image });
                toast.success("Image Updated Successfully.")
            }

        }

    }
    const handleDeleteImage = async () => {
        try {
            const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, { withCredentials: true });
            console.log(res);
            if (res.status === 200 && res.data.image) {
                setUserInfo({ ...userInfo, image: null });

            }
            toast.success("Image removed Successfully.");
            setImage(null)


        } catch (err) {
            console.log(err);
        }

    }
    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
            <div className="flex flex-col gap-10 w-[80vw] md:w-max "
                onClick={handleNavigate}>
                <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
            </div>
            <div className="grid grid-cols-2">
                <div className="h-full w-32 md:w-48 md:h-48 flex items-center relative  justify-center"
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)} >
                    <Avatar className="size-32 md:size-48 rounded-full overflow-hidden">
                        {
                            image ?
                                <AvatarImage src={image} alt="profile-image" className="size-full object-cover bg-black" />
                                :
                                <div className={`uppercase size-32 md:size-48 border-[1px] text-5xl flex items-center justify-center rounded-full ${getColor(selectedColor)} `}>
                                    {
                                        firstName ?
                                            firstName.split("").shift()
                                            :
                                            userInfo.email.split("").shift()
                                    }
                                </div>
                        }
                    </Avatar>
                    {
                        hovered &&
                        (<div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/50 rounded-full ring-fuchsia-50"
                            onClick={image ? handleDeleteImage : handleFileInputClick}>

                            {
                                image ?
                                    <FaTrash className="text-3xl cursor-pointer text-white" />
                                    :
                                    <FaPlus className="text-3xl cursor-pointer text-white" />
                            }

                        </div>)

                    }
                    <input type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageChange}
                        name="profile-image"
                        accept=".png, .jpg, .jpeg,.webp, .svg" />

                </div>
                <div className="min-w-32 md:min-w-64 text-white flex flex-col items-center justify-center gap-5">
                    <div className="w-full">
                        <input type="email"
                            placeholder="Email"
                            value={userInfo.email}
                            disabled
                            className="p-6 border-none rounded-lg bg-[#2c2e3b]" />
                    </div>
                    <div className="w-full">
                        <input type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => (setFirstName(e.target.value))}
                            className="p-6 border-none rounded-lg bg-[#2c2e3b]" />
                    </div>
                    <div className="w-full">
                        <input type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => (setLastName(e.target.value))}
                            className="p-6 border-none rounded-lg bg-[#2c2e3b]" />
                    </div>
                    <div className="w-full flex gap-5">
                        {
                            colors.map((color, index) => (
                                <div key={index}
                                    className={`${color} size-8 rounded-full cursor-pointer transition-all duration-300
                                 ${selectedColor === index ? "outline outline-white/50 outline-1" : ""}`}
                                    onClick={() => setSelectedColor(index)}>

                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className="w-full">
                <Button className="w-full bg-purple-700 h-16 hover:bg-purple-900 transition-all duration-300"
                    onClick={() => saveChanges()}>Save Changes</Button>
            </div>
        </div>
    );
};

export default Profile;