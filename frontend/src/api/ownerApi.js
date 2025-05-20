import axois from "axios";
const URL = "http://localhost:5000"; 
export const ownerSignUpApi=async (req,res)=>{
    try{
        const response=await axois.post(`${URL}/register`,req);
        console.log(response.response);
        res.status(200).json(response.data);
    }
    catch(error){
        console.log(error);
    }
}