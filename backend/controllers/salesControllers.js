import Owner from "../Models/Owner.js";

export const addSale = async (req, res) => {
  try {
    const { data } = req.body;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    const itemToBeUpdated = owner.item.find(i => i.ID === data.itemID);
    if (!itemToBeUpdated) {
      return res.status(400).json({ message: "Item not found" });
    }
    if (itemToBeUpdated.quantity <= 0) {
      return res.status(400).json({ message: "Item Quantity is not sufficient" });
    }
    itemToBeUpdated.quantity -= 1;
    const transaction = {
      transactionMode: data.paymentMethod,
      transactionAmount: data.amountPayingNow,
      customerID: data.customerID || null,
      customerName: data.customerName || null,
      date: data.date,
      status: "completed",
      description: `Sale of ${itemToBeUpdated.itemName} (${itemToBeUpdated.weight}g)`
    };
    const saleData = {
      customerID: data.customerID || null,
      metalType: itemToBeUpdated.metalType,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      itemName: itemToBeUpdated.itemName,
      itemID: itemToBeUpdated.ID,
      weight: itemToBeUpdated.weight,
      itemPurity: itemToBeUpdated.itemPurity,
      metalPrice: itemToBeUpdated.metalPrice,
      depositeAmount: data.amountPayingNow,
      orderType: data.orderType,
      pendingAmount: data.pendingAmount,
      discount: data.discount,
      notes: data.notes,
      makingCharges: data.makingCharges,
      isExistingCustomer: data.isExistingCustomer,
      paymentMethod: data.paymentMethod,
      date: data.date,
      taxes: data.taxes,
      totalPayable: data.totalPayable
    };
    owner.transactions.push(transaction);
    owner.sale.push(saleData);
    const latestSale = owner.sale[owner.sale.length - 1];
    if(data.isExistingCustomer && data.customerID) {
      const customer = owner.consumers.find(c=> c.id==data.customerID);
      if (customer) {
        customer.transactions.push(transaction);
        customer.sales.push(latestSale._id);
      }
    } else if (!data.isExistingCustomer) {
      const newCustomer = {
        id: generateCustomerId(), 
        password:"xyz",
        name: data.customerName,
        contactNumber: data.customerPhone,
        email: data.customerEmail || "",
        address: "xyz",
        image: "xyz",
        orders: [],
        purchases: [],
        loan: [],
        exchange: [],
        offers: [],
        transactions: [transaction],
        sales: [latestSale._id],
        date: new Date().toISOString().split('T')[0],
        notifications: []
      };
      owner.consumers.push(newCustomer);
    }

    await owner.save();
    return res.status(200).json({ 
      message: "Sale added successfully", 
      sale: latestSale,
      transaction: transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

function generateCustomerId() {
  return 'CUST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
