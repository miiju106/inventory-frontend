import axios from "axios"
import Cookies from "js-cookie"


const api = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true
})

api.interceptors.request.use((config:any):any=>{
 const token= Cookies.get("token")

 if(token){
    config.headers.Authorization = `Bearer ${token}`
 }
 return config;

})
export default api;