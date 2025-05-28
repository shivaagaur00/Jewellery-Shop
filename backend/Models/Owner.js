import mongoose, { Schema } from "mongoose";
const ownersInfo=new mongoose.Schema({
    ID:{
        type:String,
        required: true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
});
const transactionInfo=new mongoose.Schema({
    transactionMode:{
        type:String,
        required:true,
    },
    transactionAmount:{
        type:Number,
        // required:true,
    },
    customerID:{
        type:String,
    },
    date:{
        type:String,
        required:true,
    },
    status:{
        type:String,
    },
    description: {
        type: String,
    }
})
const ordersInfo=new mongoose.Schema({
    customerID:{
        type:String,
        required:true,
    },
    metalType:{
        type:String,
        required:true,
    },
    itemName:{
        type:String,
        required:true,
    },
    orderDescription:{
        type:String,
        required:true,
    },
    weightExpected:{
        type:String,
        required:true,
    },
    itemPurity:{
        type:String,
        required:true,
    },
    metalPrice:{
        type:String,
        required:true,
    },
    priceExpected:{
        type:String,
        required:true,
    },
    paidAmount:{
        type:Number,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    transactions:{
        type:[transactionInfo],
        required:true,
    }   
});
const purchaseInfo=new mongoose.Schema({
    cutomerId:{
        type:String,
        required:true,
    },
    amountToBePaid:{
        type:String,
        required:true,
    },
    amountPaid:{
        type:String,
        required:true,
    },
    itemId:{
        type:String,
        required:true,
    },
    quantity:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
});
const itemsInfo=new mongoose.Schema({
    ID:{
        type:String,
        required:true,
    },
    metalType:{
        type:String,
        required:true,
    },
    itemName:{
        type:String,
        required:true,
    },
    weight:{
        type:String,
        required:true,
    },
    itemPurity:{
        type:String,
        required:true,
    },
    metalPrice:{
        type:String,
    },
    quantity:{
        type:Number,
        required:true,
    },
    tags:{
        type:[],
    },
    category:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    }    
});
const loansInfo= new mongoose.Schema({
    customer:{
        type:String,
        required:true,
    },
    itemType:{
        type:String,
        required:true,
    },
    itemDescription:{
        type:String,
        required:true,
    },
    loanAmount:{
        type:Number,
        required:true,
    },
    loanPaidedAmount:{
        type:Number,
        default: 0
    },
    interestRate:{
        type:Number,
        required:true,
    },
    weight:{
        type:String,
        required:true,
    },
    purity:{
        type:String,
        required:true,
    },
    dateIssued:{
        type:String,
        required:true,
    },    
    dueDate:{
        type:String,
        required:true,
    },  
    datePaid:{
        type:String,
    },
    holderName:{
        type:String,
    },
    status:{
        type:String,
        required:true,
        enum: ['Active', 'Completed', 'Defaulted'],
        default: 'Active'
    },
    collateralImages:{
        type:[],
        required:true,
    },
    totalPayable: {
        type: String
    },
    remainingAmount: {
        type: String
    }
});
const salesInfo=new mongoose.Schema({
    customerID:{
        type:String,
        // required:true,
    },
    metalType:{
        type:String,
        required:true,
    },
    customerName:{
        type:String,
    },
    customerPhone:{
        type:String,
    },
    itemName:{
        type:String,
        required:true,
    },
    weight:{
        type:String,
        required:true,
    },
    itemPurity:{
        type:String,
        required:true,
    },
    metalPrice:{
        type:Number,
    },
    depositeAmount:{
        type:Number,
    },
    orderType:{
        type:String,
    },
    pendingAmount:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
    },
    notes:{
        type:String,
    },
    makingCharges:{
        type:String,
    },
    isExistingCustomer:{
        type:Boolean,
    },
    paymentMethod:{
        type:String,
    },
    date:{
        type:String,
        required:true,
    },
    taxes:{
        type:Number,
    }      
});
const exchangeInfo=new mongoose.Schema({
    customerId:{
        type:String,
        required:true,
    },
    metalType:{
        type:String,
        required:true,
    },
    itemName:{
        type:String,
        required:true,
    },
    weight:{
        type:String,
        required:true,
    },
    itemPurity:{
        type:String,
        required:true,
    },
    metalPrice:{
        type:String,
    },
    amountToBeGiven:{
        type:String,
        required:true,
    }
});
const offerInfo=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    discountPercentage:{
        type:String,
        required:true,
    },
    offerDescription:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    validity:{
        type:String,
        required:true,
    },
    conditionalAmount:{
        type:String,
        required:true,
    },
    metalConditional:{
        type:String,
        required:true,
    },
})
const notificationInfo = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['LOAN_CREATED', 'EMI_OVERDUE', 'LOW_STOCK', 'PAYMENT_DUE', 'GENERAL']
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
});
const consumerInfo=new mongoose.Schema({
    id:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    contactNumber:{
        type:String,
        required:true,
    },
    // email:{
    //     type:String,
    // },
    orders:{
        type:[ordersInfo],
        required:true,
    },
    purchases:{
        type:[purchaseInfo],
        required:true,
    },
    loan:{
        type:[loansInfo],
        required:true,
    },
    exchange:{
        type:[exchangeInfo],
        required:true,
    },
    offers:{
        type:[offerInfo],
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    transactions:{
        type:[transactionInfo],
        required:true,
    },
    date:{
        type:String,
        // required:true,
    },
    sales:{
        type:[String],
    },
    notifications: {
        type: [notificationInfo],
        required: true,
    }
});
const ownerSchema=new mongoose.Schema({
    owners:[ownersInfo],
    item:[itemsInfo],
    sale:[salesInfo],
    orders:[ordersInfo],
    loans:[loansInfo],
    pendingAmount:[salesInfo],
    purchaseExchange:[exchangeInfo],
    consumers:[consumerInfo],
    transactions:[transactionInfo],
});
const Owner = mongoose.model("owner", ownerSchema);

export default Owner;