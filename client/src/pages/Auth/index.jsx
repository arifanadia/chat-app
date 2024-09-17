import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import victory from "../../assets/victory.svg"
import Background from "../../assets/login.png"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
    const { setUserInfo } = useAppStore()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate()


    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is Required")
            return false
        }
        if (!password.length) {
            toast.error("Password is Required")
            return false
        }
        if (password !== confirmPassword) {
            toast.error("Password and Confirm password Should be same")
            return false
        }
        return true
    }
    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is Required")
            return false
        }
        if (!password.length) {
            toast.error("Password is Required")
            return false
        }
        return true
    }
    const handleLogin = async () => {
        if (validateLogin()) {
            const res = await apiClient.post(LOGIN_ROUTE,
                { email, password },
              
            );
            if (res.data.user.id) {
                console.log(res.data.user);
                setUserInfo(res.data.user)
                if (res.data.user.ProfileSetup) {

                    navigate('/chat')
                } else {
                    navigate('/profile')
                }
            }
        }

    }
    const handleSignUp = async () => {


        if (validateSignup()) {
            const res = await apiClient.post(SIGNUP_ROUTE,
                { email, password },
             
            );
            if (res.status === 201) {
                setUserInfo(res.data.user)
                navigate('/profile')
            }
        }
    }
    return (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center">
            <div className="h-[80vh] border-2 border-white shadow-2xl bg-white w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] text-opacity-90 grid xl:grid-cols-2 ">
                <div className="flex flex-col justify-center items-center gap-10">
                    <div className="flex justify-center items-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
                            <img src={victory} alt="Victory Emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center">Fill in the details to get start with the best chat app </p>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger
                                    className="text-black text-opacity-90 border-b-2 w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                    value="login" >Login</TabsTrigger>
                                <TabsTrigger
                                    className="text-black text-opacity-90 border-b-2 w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                    value="signUp" >SignUp</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-10 " value="login">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-6 rounded-full"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-6 rounded-full"
                                />
                                <Button className="p-6 rounded-full" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5" value="signUp">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-6 rounded-full"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="p-6 rounded-full"
                                />
                                <Input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="p-6 rounded-full"
                                />
                                <Button className="p-6 rounded-full" onClick={handleSignUp}>SignUp</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center">
                    <img src={Background} alt="Background Login " className="size-[500px]" />
                </div>

            </div>
        </div>
    );
};

export default Auth;