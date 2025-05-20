import axios from "axios";
const URL="http://localhost:8000"
export const login=async (data)=>{
    try{
        // console.log("Yess Frontend Working Good");
        let res=await axios.post(`${URL}/ownerLogin`,data);
        // console.log("Yess Reponse");
        return res;
    }
    catch(error){
        console.log(error.message);
    }
};
export const getItems=async (data)=>{
    try{
        // console.log("Yes addItem Comes");
        // let res={status:400,message:"Hello"};
        let res=await axios.post(`${URL}/getItems`);
        // console.log(res);
        return res;
    }
    catch(error){
        console.log(error.message);
    }
}

export const getLoans=async (data)=>{
    try{
        // console.log("Yes addItem Comes");
        // let res={status:400,message:"Hello"};
        let res=await axios.post(`${URL}/getLoans`);
        // console.log(res);
        return res;
    }
    catch(error){
        console.log(error.message);
    }
}
export const addItem=async (data)=>{
    try{
        // console.log("Yes addItem Comes");
        // let res={status:400,message:"Hello"};
        let res=await axios.post(`${URL}/addItem`,data);
        return res;
    }
    catch(error){
        console.log(error.message);
    }
}
export const updateItem=async (data)=>{
    try{
        // console.log("Yes Update Comes");
        
        // let res={status:400,message:"Hello"};
        let res=await axios.post(`${URL}/updateItem`,data);
        return res;
    }
    catch(error){
        console.log(error.message);
    }
}

export const deleteItem=async (data)=>{
    try{
        // console.log("Yes addItem Comes");
        // let res={status:400,message:"Hello"};
        let res=await axios.post(`${URL}/deleteItem`,data);
        return res;
    }
    catch(error){
        console.log(error.message);
    }
}

export const addLoan=async(data)=>{
    try{
        console.log("Hello");
        let res=await axios.post(`${URL}/addLoan`,data);
        return res;
    }
    catch(error){
        console.log(error.message);
    }
};
export const updateLoan=async(data)=>{
    try {
        let res=await axios.post(`${URL}/updateLoan`,data);
    } catch (error) {
        console.log(error);
    }
}
export const deleteLoan=async(data)=>{
    try {
        let res=await axios.post(`${URL}/deleteLoan`,data);
    } catch (error) {
        console.log(error);
    }
}