import axios from "axios";
const URL="http://localhost:8000"

// const URL="https://jewellery-shop-izh1.onrender.com"
export const login=async (data)=>{
    try{
        console.log(0);
        // console.log("Yess Frontend Working Good");
        let res=await axios.post(`${URL}/ownerLogin`,data);
        console.log(res);
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
        console.log(data);
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

export const addCustomer=async(data)=>{
    try {
        const res=await axios.post(`${URL}/addCustomer`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getCustomers=async()=>{
    try {
        let res=await axios.post(`${URL}/getCustomers`);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const updateCustomer=async()=>{
    try {
        let res=await axios.post(`${URL}/getCustomers`);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const deleteCustomer=async(data)=>{
    try {
        let res=await axios.post(`${URL}/deleteCustomer`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getSpecificCustomer=async(data)=>{
    try {
        let res=await axios.post(`${URL}/getSpecificCustomer`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const addSale=async(data)=>{
    try {
        console.log(data);
        let res=await axios.post(`${URL}/addSale`,data);
        return res;
    } catch (error) {
        console.log(error);   
    }
}
export const getTransactions=async()=>{
    try {
        let res=await axios.post(`${URL}/getTransactions`);

        return res;
    } catch (error) {
        console.log(error);
    }
}
export const addTransactions=async(data)=>{
    try {
        let res=await axios.post(`${URL}/addTransaction`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const editTransaction=async(data)=>{
    try {
        let res=await axios.post(`${URL}/editTransaction`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const deleteTransaction=async(data)=>{
    try {
        console.log(data);
        let res=await axios.post(`${URL}/deleteTransaction`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const getInfo=async()=>{
    try {
        let res=await axios.post(`${URL}/getInfo`);
    } catch (error) {
        console.log(error);
    }
}
export const edit=async()=>{
    try {
        let res=await axios.post(`${URL}/editInfo`);
    } catch (error) {
        console.log(error);
    }
}
export const addOrder=async(data)=>{
    try {
        let res=await axios.post(`${URL}/addOrder`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const editOrder=async(data)=>{
    try {
        let res=await axios.post(`${URL}/editOrder`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const deleteOrder=async(data)=>{
    try {
        let res=await axios.post(`${URL}/deleteOrder`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getOrders=async()=>{
    try {
        let res=await axios.post(`${URL}/getOrders`);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getOrder=async()=>{
    try {
        let res=await axios.post(`${URL}/getOrder`);

        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getDashBoard=async()=>{
    try {
        let res=await axios.post(`${URL}/getDashBoard`);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getAllNotDeliveredOrders =async()=>{
    try {
        let res=await axios.get(`${URL}/getAllNotDeliveredOrders`);
        return res;
    } catch (error) {
        console.log(error);
    }
}

export const updateDeliveryStatus =async(data)=>{
    try {
        let res=await axios.post(`${URL}/updateStatus`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}

