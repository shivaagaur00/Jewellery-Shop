import Owner from "../Models/Owner.js";
export const addOrder = async (req, res) => {
    try {
        let { data } = req.body;
        if (!data) return res.status(400).json({ message: "Data Not Found" });
        let owner = await Owner.findOne();
        if (!owner) return res.status(404).json({ message: "Owner not found" });
        let txn = {
            transactionMode: data.transactionMode,
            transactionAmount: data.depositedAmount,
            customerID: data.customerID,
            customerName: data.customerName?data.customerName:"",
            date: data.date,
            status: data.status,
            description: data.orderDescription,
        };
        let odr = {
            customerID: data.customerID,
            metalType: data.metalType,
            itemName: data.itemName,
            orderDescription: data.orderDescription,
            weightExpected: data.weightExpected,
            itemPurity: data.itemPurity,
            metalPrice: data.metalPrice,
            priceExpected: data.priceExpected,
            depositedAmount: data.depositedAmount ? data.depositedAmount : 0,
            sp: data.sp ? data.sp : 0,
            cp: data.cp ? data.cp : 0,
            date: data.date,
            transactions: [txn],
            weight: data.weight ? data.weight : 0,
            expectedDeliverDate: data.expectedDeliverDate,
            deliverDate: data.deliverDate ? data.deliverDate : "",
            status: data.status,
            image:data.image,
            
        };
        owner.orders.push(odr);
        owner.transactions.push(txn);
        let consumer = owner.consumers.find(c => c.id == data.customerID);
        if (!consumer) {
            return res.status(404).json({ message: "Consumer not found" });
        }
        consumer.orders.push(odr);
        consumer.transactions.push(txn);
        let outOrder=owner.orders[owner.orders.length-1];
        await owner.save();
        return res.status(200).json({data:outOrder});
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const editOrder = async (req, res) => {
    try {
        const { data, orderId } = req.body;
        if (!data || !orderId) {
            return res.status(400).json({ message: "Data or Order ID not found" });
        }

        const owner = await Owner.findOne();
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        const orderIndex = owner.orders.findIndex(o => o._id == orderId);
        if (orderIndex === -1) {
            return res.status(404).json({ message: "Order not found" });
        }
        const updatedOrder = {
            ...owner.orders[orderIndex],
            ...data
        };
        owner.orders[orderIndex]=updatedOrder;
        const consumer = owner.consumers.find(c => c.id == data.customerID);
        if (consumer) {
            const consumerOrderIndex = consumer.orders.findIndex(o => o._id == orderId);
            if (consumerOrderIndex !== -1) {
                consumer.orders[consumerOrderIndex] = updatedOrder;
            }
        }

        await owner.save();
        return res.status(200).json({ message: "Order updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
};
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID not found" });
        }

        const owner = await Owner.findOne();
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        const orderIndex = owner.orders.findIndex(o => o._id == orderId);
        if (orderIndex === -1) {
            return res.status(404).json({ message: "Order not found" });
        }
        const deletedOrder = owner.orders[orderIndex];
        owner.orders.splice(orderIndex, 1);
        const consumer = owner.consumers.find(c => c.id == deletedOrder.customerID);
        if (consumer) {
            const consumerOrderIndex = consumer.orders.findIndex(o => o._id == orderId);
            if (consumerOrderIndex !== -1) {
                consumer.orders.splice(consumerOrderIndex, 1);
            }
        }

        await owner.save();
        return res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID not found" });
        }
        const owner = await Owner.findOne();
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        const order = owner.orders.find(o => o._id == orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json({ order });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getOrders = async (req, res) => {
    try {
        let owner = await Owner.findOne();
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }

        const orders = [];

        // Get orders from all consumers
        for (const consumer of owner.consumers) {
            if (consumer.orders && consumer.orders.length > 0) {
                for (const order of consumer.orders) {
                    orders.push({
                        ...order._doc,
                        source: 'consumer',
                        consumerName: consumer.name,
                        consumerId: consumer.id,
                    });
                }
            }
        }

        // Get orders directly from owner.orders
        if (owner.orders && owner.orders.length > 0) {
            for (const order of owner.orders) {
                orders.push({
                    ...order._doc,
                    source: 'owner'
                });
            }
        }

        return res.status(200).json({ data: orders });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};


export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, updates } = req.body;
    const owner = await Owner.findOne();
    
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    let orderUpdated = false;
    for (const customer of owner.consumers) {
      const orderIndex = customer.notDeliverOrders.findIndex(
        order => order._id.toString() === orderId
      );

      if (orderIndex !== -1) {
        customer.notDeliverOrders[orderIndex] = {
          ...customer.notDeliverOrders[orderIndex],
          ...updates
        };
        orderUpdated = true;
        break;
      }
    }

    if (!orderUpdated) {
      return res.status(404).json({ message: "Order not found" });
    }

    await owner.save();

    return res.status(200).json({ 
      message: "Delivery status updated successfully",
      updatedOrder: updates
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};

export const getAllNotDeliveredOrders = async (req, res) => {
  try {
    const owner = await Owner.findOne();
    
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const allNotDeliveredOrders = owner.consumers.flatMap(customer => 
      customer.notDeliverOrders.map(order => ({
        ...order.toObject(),
        customerId: customer.id,
        customerName: customer.name,
        customerContact: customer.contactNumber
      }))
    );

    return res.status(200).json({ 
      message: "All not delivered orders fetched successfully",
      count: allNotDeliveredOrders.length,
      orders: allNotDeliveredOrders
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
};