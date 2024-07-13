import { useAppStore } from "@/store";


const Profile = () => {
    const {userInfo} = useAppStore()
    return (
        <div>
            profile
            <div>
               <p> Email : {userInfo.email}</p>
            </div>
        </div>
    );
};

export default Profile;