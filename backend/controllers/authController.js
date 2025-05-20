import Owner from "./../Models/Owner.js";

export const ownerLogin = async (req, res) => {
  try {
    console.log("Yes Request in Controller");
    const { username, password } = req.body;
    const user = await Owner.findOne({ "owners.ID": username });
    if (!user) {
      return res.status(203).json({ message: "Owner not Found" });
    }
    const ownerUser = user.owners.find((o) => o.ID == username);
    if (ownerUser.password == password)
      return res.status(200).json({ message: "Done" });
    else res.status(201).json({ message: "User Password is wrong" });
  } catch (error) {
    console.log(error);
  }
};

export const getItems = async (req, res) => {
  try {
    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({
        status: 1,
        message: "Owner not found",
      });
    }
    res.status(200).json({
      status: 0,
      data: owner.item,
      message: "Items retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: error.message,
    });
  }
};

export const getLoans = async (req, res) => {
  try {
    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({
        status: 1,
        message: "Owner not found",
      });
    }
    res.status(200).json({
      status: 0,
      data: owner.loans,
      message: "Items retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: error.message,
    });
  }
};
// @desc    Add new item
// @route   POST /api/items
// @access  Private
export const addItem = async (req, res) => {
  try {
    const { 
      ID,
      metalType,
      itemName,
      weight,
      itemPurity,
      metalPrice,
      quantity,
      tags,
      category,
      date,
      image
    } = req.body;

    if (!ID || !itemName || !weight || !itemPurity || !quantity || !category || !date || !image) {
      return res.status(400).json({
        status: 1,
        message: "Please provide all required fields",
      });
    }

    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({
        status: 1,
        message: "Owner not found",
      });
    }
    const existingItem = owner.item.find(item => item.ID === ID);
    if (existingItem) {
      return res.status(400).json({
        status: 1,
        message: "Item with this ID already exists",
      });
    }
    const newItem = {
      ID,
      metalType,
      itemName,
      weight,
      itemPurity,
      metalPrice,
      quantity: Number(quantity),
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',') : []),
      category,
      date,
      image,
    };
    owner.item.push(newItem);
    await owner.save();
    console.log(newItem);

    res.status(201).json({
      status: 0,
      data: newItem,
      message: "Item added successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 1,
      message: error.message,
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const { id } = req.body;
    const {updateData} = req.body;

    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({
        status: 1,
        message: "Owner not found",
      });
    }
    const itemIndex = owner.item.findIndex(item =>item._id.toString()=== id);
    if (itemIndex === -1) {
      return res.status(404).json({
        status: 1,
        message: "Item not found",
      });
    }

    // Prepare updated item
    const updatedItem = {
      ...owner.item[itemIndex].toObject(),
      ...updateData
    };

    // Convert quantity to number if it exists in update data
    if (updateData.quantity !== undefined) {
      updatedItem.quantity = Number(updateData.quantity);
    }

    // Convert tags to array if it exists in update data
    if (updateData.tags !== undefined) {
      updatedItem.tags = Array.isArray(updateData.tags) 
        ? updateData.tags 
        : (updateData.tags ? updateData.tags.split(',') : []);
    }

    // Update the item
    owner.item[itemIndex] = updatedItem;
    await owner.save();

    res.status(201).json({
      status: 0,
      data: updatedItem,
      message: "Item updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: error.message,
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.body;

    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({
        status: 1,
        message: "Owner not found",
      });
    }

    // Find the item index
    const itemIndex = owner.item.findIndex(item => item._id.toString() === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        status: 1,
        message: "Item not found",
      });
    }
    const deletedItem = owner.item.splice(itemIndex, 1);
    await owner.save();

    res.status(200).json({
      status: 0,
      data: deletedItem,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: error.message,
    });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Private
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({
        status: 1,
        message: "Owner not found",
      });
    }

    const item = owner.item.find(item => item.ID === id);
    if (!item) {
      return res.status(404).json({
        status: 1,
        message: "Item not found",
      });
    }

    res.status(200).json({
      status: 0,
      data: item,
      message: "Item retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 1,
      message: error.message,
    });
  }
};
export const addLoan = async (req, res) => {
  console.log(req.body);
  try {
    const { 
      customer,
      itemType,
      itemDescription,
      loanAmount,
      interestRate,
      weight,
      purity,
      dateIssued,
      dueDate,
      status,
      collateralImages
    } = req.body;
    if (
      !customer ||
      !itemType ||
      !itemDescription||
      !loanAmount ||
      !interestRate ||
      !weight ||
      !purity ||
      !dateIssued ||
      !dueDate ||
      !status ||
      !collateralImages) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    let owner = await Owner.findOne();
    const newLoan = {
      customer: customer,
      itemType:itemType,
      itemDescription:itemDescription,
      loanAmount:loanAmount,
      interestRate:interestRate,
      weight:weight,
      purity:purity,
      dateIssued:dateIssued,
      dueDate:dueDate,
      status:status,
      collateralImages:collateralImages,
    };
    owner.loans.push(newLoan);
    await owner.save();

    res.status(201).json({
      success: true,
      message: 'Loan added successfully',
      loan: newLoan
    });

  } catch (error) {
    console.error('Error adding loan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add loan',
      error: error.message 
    });
  }
};
export const updateLoan = async (req, res) => {
  try {
    const {id,updateData} = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Loan ID is required' });
    }
    const owner = await Owner.findOne();

    if (!owner) {
      return res.status(404).json({ message: 'Owner document not found' });
    }
    const loanIndex = owner.loans.findIndex(loan => loan._id.toString() === id);

    if (loanIndex === -1) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    owner.loans[loanIndex] = {
      ...owner.loans[loanIndex].toObject(),
      ...updateData
    };
    await owner.save();

    res.status(200).json({
      success: true,
      message: 'Loan updated successfully',
      loan: owner.loans[loanIndex]
    });

  } catch (error) {
    console.error('Error updating loan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update loan',
      error: error.message 
    });
  }
};

// Delete loan
export const deleteLoan = async (req, res) => {
  console.log(req.body);
  try {
    const { loanId } = req.body;
    loanId
    if (!loanId) {
      return res.status(400).json({ message: 'Loan ID is required' });
    }

    // Find owner document
    const owner = await Owner.findOne();

    if (!owner) {
      return res.status(404).json({ message: 'Owner document not found' });
    }

    // Find the loan to delete
    const loanIndex = owner.loans.findIndex(loan => loan._id.toString() === loanId);

    if (loanIndex === -1) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    const deletedLoan = owner.loans.splice(loanIndex, 1);
    await owner.save();

    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully',
      loan: deletedLoan[0]
    });

  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete loan',
      error: error.message 
    });
  }
};