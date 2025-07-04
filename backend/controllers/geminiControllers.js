import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const generateResponse = async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" }); // <- latest & supported
//     const result = await model.generateContent([prompt]);
//     const response = await result.response;
//     const text = response.text();
//     console.log(text);
//     res.status(200).json({ response: text });
//   } catch (err) {
//     console.error("Gemini Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

export const generateResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      `Based on recent market trends, provide a realistic estimate for 24K gold price 
       in Firozabad, Uttar Pradesh today. Format the response as only a number 
       prefixed with ₹ without any additional text or explanation. Example: "₹5,200"`,
    ]);
    
    const response = await result.response;
    const text = response.text();
    console.log(text);
    res.status(200).json({ response: text });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};