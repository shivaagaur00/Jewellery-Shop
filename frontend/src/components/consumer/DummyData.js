// src/dummyData.js
export const dummyConsumer = {
  id: "CUST001",
  password: "password123",
  name: "John Doe",
  address: "123 Jewel St, Gem City",
  contactNumber: "+1 555-123-4567",
  image: "https://randomuser.me/api/portraits/men/1.jpg",
  date: "2023-05-15",
  sales: ["SALE001", "SALE002"],
  notifications: [
    {
      type: "PAYMENT_DUE",
      message: "Your loan payment of $150 is due tomorrow",
      date: "2023-06-10",
      isRead: false
    },
    {
      type: "GENERAL",
      message: "New gold collection available with 10% discount",
      date: "2023-06-08",
      isRead: true
    }
  ]
};

export const dummyItems = [
  {
    ID: "ITEM001",
    metalType: "Gold",
    itemName: "Gold Wedding Ring",
    weight: "5.2",
    itemPurity: "18K",
    metalPrice: "1850",
    quantity: 10,
    tags: ["wedding", "ring"],
    category: "Rings",
    date: "2023-05-20",
    image: "https://via.placeholder.com/150"
  },
  {
    ID: "ITEM002",
    metalType: "Silver",
    itemName: "Silver Pendant",
    weight: "8.5",
    itemPurity: "92.5%",
    metalPrice: "250",
    quantity: 15,
    tags: ["pendant", "necklace"],
    category: "Pendants",
    date: "2023-05-18",
    image: "https://via.placeholder.com/150"
  }
];

export const dummyOrders = [
  {
    customerID: "CUST001",
    metalType: "Gold",
    itemName: "Custom Gold Chain",
    orderDescription: "24 inch gold chain with lobster clasp",
    weightExpected: "10.5",
    itemPurity: "18K",
    metalPrice: "1850",
    priceExpected: "19425",
    depositedAmount: 5000,
    date: "2023-05-25",
    expectedDeliverDate: "2023-06-25",
    status: "In Progress",
    transactions: [
      {
        transactionMode: "Credit Card",
        transactionAmount: 5000,
        date: "2023-05-25",
        status: "Completed"
      }
    ]
  }
];

export const dummyLoans = [
  {
    customer: "John Doe",
    customerID: "CUST001",
    itemType: "Gold Bracelet",
    itemDescription: "22K gold bracelet with diamond accents",
    loanAmount: 2000,
    loanPaidedAmount: 500,
    interestRate: 12,
    weight: "15.2",
    purity: "22K",
    dateIssued: "2023-04-15",
    dueDate: "2023-07-15",
    status: "Active",
    collateralImages: ["https://via.placeholder.com/150"],
    totalPayable: "2240",
    remainingAmount: "1740"
  }
];

export const dummyPurchases = [
  {
    cutomerId: "CUST001",
    amountToBePaid: "1200",
    amountPaid: "1200",
    itemId: "ITEM002",
    quantity: "1",
    date: "2023-06-01"
  }
];

export const dummyTransactions = [
  {
    transactionMode: "Credit Card",
    transactionAmount: 5000,
    customerID: "CUST001",
    customerName: "John Doe",
    date: "2023-05-25",
    status: "Completed",
    description: "Deposit for custom gold chain"
  },
  {
    transactionMode: "Bank Transfer",
    transactionAmount: 500,
    customerID: "CUST001",
    customerName: "John Doe",
    date: "2023-06-05",
    status: "Completed",
    description: "Loan repayment"
  }
];