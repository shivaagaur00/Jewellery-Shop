import Owner from "./../Models/Owner.js";
import bcrypt from "bcryptjs";
export const changePassword = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { current, newPassword } = req.body;
    if (!current || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    const owner = await Owner.findOne({ "consumers.id": customerId });
    if (!owner) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customer = owner.consumers.find(c => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const isMatch = await bcrypt.compare(current, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedNewPassword;
    await owner.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const editBasicInfo = async (req, res) => {
  try {
    const customerId = req.user.id;
    
    const { name,address,contactNumber,image } = req.body;
    const owner = await Owner.findOne({ "consumers.id": customerId });
    if (!owner) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const customer = owner.consumers.find(c => c.id === customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    customer.name=name;
    customer.address=address,
    customer.contactNumber=contactNumber,
    customer.image=image,
    await owner.save();
    res.status(200).json({ message: 'Details changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const addToCart = async (req, res) => {
  try {
    const { ID } = req.body;
    const customerID = req.user.id;

    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.cart.push(ID);
    await owner.save();

    return res.status(200).json({ message: "Item added to cart", cart: customer.cart });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getCartItems = async (req, res) => {
  try {
    const customerID = req.user.id;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const cartItemIDs = customer.cart;
    const cartItems = owner.item.filter((item) => cartItemIDs.includes(item.ID));

    return res.status(200).json({ cartItems });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
