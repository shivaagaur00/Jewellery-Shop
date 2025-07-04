import axios from "axios";
export const getGoldPrice = async () => {
  try {
    const response = await axios.get("https://data-asg.goldprice.org/dbXRates/INR");
    // console.log(response.data.items[0].xauPrice);
    // const perGram = response.data.items[0].xauPrice;
    // const per10Gram = Math.round(perGram * 10);
    return response;
  } catch (error) {
    console.error("Failed to fetch gold price:", error);
    return null;
  }
};