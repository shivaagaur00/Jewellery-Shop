import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_EXPIRES_IN=process.env.JWT_EXPIRES_IN;

export const generateToken=(id)=>{
    return jwt.sign({id},JWT_SECRET,{
        expiresIn:JWT_EXPIRES_IN,
    });
};

export const hashPassword=async(password)=>{
    const salt= await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
};

export const comparePassword=async (candidatePassword,hashedPassword)=>{
    return await bcrypt.compare(candidatePassword,hashedPassword);
}