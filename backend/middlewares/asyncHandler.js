const asyncHandler = (fnc) => (req,res,next) => {
    Promise.resolve(fnc(req,res,next)).catch((err)=>{
        res.status(500).json({
            message: err.message
        })
    })
}

export default asyncHandler