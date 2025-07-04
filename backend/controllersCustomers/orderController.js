import Owner from "../Models/Owner.js";

export const addOrder = async (req, res) => {
  try {
    const customerID = req.user.id;
    const { orderForm } = req.body;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    const data = {
      customerID: customerID,
      metalType: orderForm.metal,
      itemName: orderForm.item,
      orderDescription: orderForm.description,
      weightExpected: orderForm.weight,
      itemPurity: orderForm.purity,
      metalPrice: orderForm.metalPrice || "10",
      priceExpected: orderForm.priceExpected || "10",
      depositedAmount: orderForm.deposit,
      date: new Date().toISOString(),
      transactions: [],
      expectedDeliverDate: orderForm.delivery,
      status: "Pending",
      image: orderForm.samplePhoto,
    };
    customer.orders.push(data);
    await owner.save();

    return res.status(200).json({ message: "Order added successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const fetchCustomOrders = async (req, res) => {
  try {
    const customerID = req.user.id;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ data: customer.orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const customerID = req.user.id;
    const { itemId } = req.body;

    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });

    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const initialLength = customer.cart.length;
    customer.cart = customer.cart.filter((item) => item !== itemId);
    if (customer.cart.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    await owner.save();
    return res
      .status(200)
      .json({ message: "Item removed from cart successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const placeOrder = async (req, res) => {
  try {
    const customerID = req.user.id;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    const customer = owner.consumers.find((c) => c.id === customerID);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 6);

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    const newOrder = {
      items: req.body.itemIds,
      orderCost: req.body.orderCost,
      orderDate: new Date(),
      expectedDeliveryDate: deliveryDate,
      deliveryStatus: "not_delivered",
      paymentStatus: "pending",
    };
    customer.notDeliverOrders.push(newOrder);
    customer.cart=[];
    await owner.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNotDeliverOrders = async (req, res) => {
  try {
    const customerID = req.user.id;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    
    res
      .status(201)
      .json({ message: "Fetched SuccessFully", notDeliveredOrders:customer.notDeliverOrders});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getNotDeliveredOrderModalItems = async (req, res) => {
  try {
    const owner = await Owner.findOne();
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    const { itemsIds } = req.body;
    const filteredItems = owner.item.filter((i) =>
      itemsIds.includes(i.ID)
    );
    res.status(200).json({
      message: "Fetched Successfully",
      notDeliveredOrderModalItems: filteredItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLoansOfCustomer = async (req, res) => {
  try {
    const customerID = req.user.id;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    const customer = owner.consumers.find((c) => c.id === customerID);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    
    res
      .status(201)
      .json({ message: "Fetched SuccessFully", loans:customer.loan});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getPurchasesOfCustomer = async (req, res) => {
  try {
    const customerID = req.user.id;
    const owner = await Owner.findOne();
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    const customer = owner.consumers.find(c => c.id === customerID);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    const dataToSend = [];
    for (const saleID of customer.sales) {
      const saleSpecific = owner.sale.find(i => i._id.toString() === saleID);
      const item=owner.item.find(i=> i.ID===saleSpecific.itemID);
      // console.log(owner.item);
      const itemInfo = item
        ? {
            ID: item.ID,
            metalType: item.metalType,
            itemName: item.itemName,
            weight: item.weight,
            itemPurity: item.itemPurity,
            category: item.category,
            image: item.image,
          }
        : null;
      dataToSend.push({
        cutomerId: saleSpecific.cutomerID,
        amountToBePaid: saleSpecific.pendingAmount,
        amountPaid: saleSpecific.depositeAmount,
        itemId: saleSpecific.itemID,
        date: saleSpecific.date,
        itemInfo
      });
    }
    
    // console.log(dataToSend);
    res.status(200).json({ message: "Fetched Successfully", data: dataToSend });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

