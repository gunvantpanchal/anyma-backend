exports.test=async(req,res)=>{
    try {
        res.status(200).json("working fine")
    } catch (error) {
        res.status(500).json({message:error?.message})
    }
}