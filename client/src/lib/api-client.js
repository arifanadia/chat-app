import { HOST } from "@/utils/constants"
import axios from "axios"

export const apiClient = axios.create({
    baseURL : HOST,
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token
    }
})