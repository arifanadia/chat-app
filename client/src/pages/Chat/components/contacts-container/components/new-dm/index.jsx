import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Lottie from "react-lottie";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";



const NewDm = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore()
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {

                const res = await apiClient.post(SEARCH_CONTACTS_ROUTE,
                    { searchTerm },
                    
                )

                console.log(res);
                if (res.status === 200 && res.data.contacts) {
                    setSearchedContacts(res.data.contacts)
                } else {
                    setSearchedContacts([])
                }

            }


        } catch (err) {
            console.log(err);
        }
    }
    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSearchedContacts([]);
        setSelectedChatType("contact")
        setSelectedChatData(contact)
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 text-opacity-90 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] text-white border-none mb-2 p-3">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className="bg-[#181920] text-white border-none w-[400px] h-[400px] flex flex-col  ">
                    <DialogHeader>
                        <DialogTitle> Please Select a Contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <input type="text" placeholder="Search Contacts"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none  w-full"
                            onChange={(e) => searchContacts(e.target.value)} />
                    </div>
                    {
                        searchedContacts.length > 0 &&
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col gap-5"
                            >
                                {
                                    searchedContacts.map(contact => (
                                        <div key={contact._id}
                                            className="flex gap-3 cursor-pointer items-center"
                                            onClick={() => selectNewContact(contact)}>
                                            <div className="w-12 h-12 relative">
                                                <Avatar className="size-12  rounded-full overflow-hidden">
                                                    {
                                                        contact.image ?
                                                            <AvatarImage src={`${HOST}/${contact.image}`} alt="profile-image" className="size-full object-cover bg-black" />
                                                            :
                                                            <div className={`uppercase size-12  border-[1px] text-xl flex items-center justify-center rounded-full ${getColor(contact.color)} `}>
                                                                {
                                                                    contact.firstName ?
                                                                        contact.firstName.split("").shift()
                                                                        :
                                                                        contact.email.split("").shift()
                                                                }
                                                            </div>
                                                    }
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span>
                                                    {
                                                        contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                    }
                                                </span>
                                                <span className="text-xs">{contact.email}</span>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        </ScrollArea>


                    }

                    {
                        searchedContacts.length <= 0 && (
                            <div className="flex-1 md:flex flex-col justify-center items-center mt-5 md:mt-0 duration-1000 transition-all ">
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions} />
                                <div className="text-opacity-80 text-white flex flex-col items-center text-center text-xl lg:text-2xl transition-all gap-5 mt-5 duration-300">
                                    <h3 className="poppins-medium">
                                        Hi<span className="text-purple-500">! </span>
                                        Search
                                        <span className="text-purple-500"> New </span>
                                        Contacts
                                    </h3>
                                </div>
                            </div>

                        )
                    }
                </DialogContent>
            </Dialog>



        </>
    );
};

export default NewDm;