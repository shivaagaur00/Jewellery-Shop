import Owner from "./../Models/Owner.js";
export const getDetailsWithoutLogin=async(req,res)=>{
    try {
        const owner=await Owner.findOne();
        if(!owner){
            return res.status(400).json({message:'Owner not found'});
        }
        const data={
            item:owner.item,
        }
        return res.status(200).json({data:data});
    } catch (error) {
        return res.status(500).json({error:error});
    }
}