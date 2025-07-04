import Owner from "../Models/Owner.js";

export const getTransactions = async (req, res) => {
  try {
    const owner = await Owner.findOne();
    if (owner) return res.status(200).json({ data: owner.transactions });
    return res.status(404).json({ message: "Owner not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const newTransaction = req.body;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    owner.transactions.push(newTransaction);
    await owner.save(); 
    return res.status(201).json({ message: "Transaction added", data: owner.transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.body;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    owner.transactions = owner.transactions.filter(tx => tx._id.toString() !== id);
    await owner.save();
    return res.status(200).json({ message: "Transaction deleted", data: owner.transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// EDIT a transaction
export const editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const txIndex = owner.transactions.findIndex(tx => tx._id.toString() === id);
    if (txIndex === -1) return res.status(404).json({ message: "Transaction not found" });

    owner.transactions[txIndex] = { ...owner.transactions[txIndex]._doc, ...updatedData };
    await owner.save();

    return res.status(200).json({ message: "Transaction updated", data: owner.transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};