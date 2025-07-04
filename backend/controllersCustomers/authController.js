import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import Owner from "./../Models/Owner.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const signup = async (req, res) => {
  try {
    const { id, password, name, address, contactNumber,profileImage } = req.body;
    const db=await Owner.findOne();
const existingCustomer = db.consumers.find(customer => customer.id === id);
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = {
      id,
      password: hashedPassword,
      name,
      address,
      contactNumber,
      image: profileImage || '',

      date: new Date().toISOString()
    };
    db.consumers.push(newCustomer);
    await db.save();
    res.status(201).json({ message: 'Customer created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const db = await Owner.findOne();
    if (!db) {
      return res.status(400).json({ message: 'Invalid credentials'});
    }
    const customer = db.consumers.find(c => c.id === id);
    if (!customer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {

      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: customer.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const getCustomer = async (req, res) => {
  try {
    const customerId = req.user.id;
    const owner = await Owner.findOne({ 'consumers.id': customerId });
    if (!owner) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const customer = owner.consumers.find(c => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const { password, ...customerData } = customer.toObject();
    res.status(200).json(customerData);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const addEmailForNewsLetter = async (req, res) => {
  try {
    const { email } = req.body;

    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const alreadyExist = owner.newLetterEmails.find((e) => e === email);
    if (alreadyExist) {
      return res.status(201).json({ message: 'Already Subscribed' });
    }

    owner.newLetterEmails.push(email);
    await owner.save();

    return res.status(200).json({ message: 'Added Successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
