import axios from "axios"
const URL="http://localhost:8000";
export const signUp=async (data)=>{
    try {
        let res=axios.post(`${URL}/signup`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const login=async (data)=>{
    try {
        console.log(data);
        let res=axios.post(`${URL}/login`,data);
        return res;
    } catch (error) {
        console.log(error);
    }
}
export const getCustomer = async (token) => {
  try {
    const res = await axios.get(`${URL}/customer`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch customer data", error);
    throw error;
  }
};
export const resetPassword = async (data, token) => {
  try {
    const res = await axios.post(`${URL}/resetPassword`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to reset password", error);
    throw error;
  }
};
export const editBasicInfo = async (data, token) => {
  try {
    const res = await axios.post(`${URL}/editBasicInfo`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to Edit Basic Info", error);
    throw error;
  }
};
export const getDetailsWithoutLogin=async()=>{
  try {
    let res=await axios.post(`${URL}/getDetailsWithoutLogin`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
export const addToCart=async(data,token)=>{
  try {
    const res = await axios.post(`${URL}/addToCart`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
      console.log(error);
  }
}
export const cartItems = async (token) => {
  try {
    const res = await axios.get(`${URL}/getCartItems`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch cart items", error);
    throw error;
  }
};
export const removeFromCart = async (data,token) => {
  try {
    const res = await axios.post(`${URL}/removeFromCart`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to removeFromCart", error);
    throw error;
  }
};
export const apiSendEmailtoBackend=async(data)=>{
  try {
    const res=await axios.post(`${URL}/addEmailForNewsLetter`,data);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
}
export const addOrder=async(data,token)=>{
  try {
    console.log(data);
    const res=await axios.post(`${URL}/addCutomerOrder`,data,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
export const fetchCustomOrders = async (token) => {
  try {
    const res = await axios.get(`${URL}/fetchCustomOrders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetchCustomOrders", error);
    throw error;
  }
};
export const placeOrder=async(data,token)=>{
  try {  
  let res=await axios.post(`${URL}/placeOrder`,data,{
    headers:{
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
  } catch (error) {
    console.log(error);
  }

};
export const notDeliveredOrdersAPI= async (token) => {
  try {
    const res = await axios.get(`${URL}/getNotDeliverOrders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch getNotDeliverOrders items", error);
    throw error;
  }
};

export const fetchNotDeliveredOrderModalItems= async (data,token) => {
  try {
    const res = await axios.post(`${URL}/fetchNotDeliveredOrderModalItems`,data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch NotDeliveredOrderModalItems items", error);
    throw error;
  }
};

export const getLoansOfCustomer= async (token) => {
  try {
    const res = await axios.get(`${URL}/fetchLoansOfCustomer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch fetchLoansOfCustomer items", error);
    throw error;
  }
};

export const getPurchasesOfCustomer= async (token) => {
  try {
    const res = await axios.get(`${URL}/fetchPurchasesOfCustomer`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch fetchPurchasesOfCustomer items", error);
    throw error;
  }
};

