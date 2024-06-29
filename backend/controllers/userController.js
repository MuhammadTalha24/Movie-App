import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js"


export const createUsers = asyncHandler( async( req, res )=>{
    const {username,email,password} = req.body;
    if (!username || !email || !password){
        throw new Error('Please fill all the fields')
    }

    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400).send("User already exist")
    }

    //hash the user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    const newUser = new User({username , email , password : hashedPassword})


    try {
        await newUser.save()
        createToken(res , newUser._id);
        res.status(201).json({
            id: newUser._id,
            username:newUser.username,
            email:newUser.email,
            isAdmin:newUser.isadmin
        })
    } catch (error) {
        req.status(400)
        throw new Error("Invalid User Data")
    }
})

// Login User

export const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
        const isPasswordValid = await bcrypt.compare(password , existingUser.password)

        if(isPasswordValid){
            createToken(res,existingUser._id)

            res.status(201).json({
                success:true,
                msg:"Logged in Successfully"
            })
        }else{
            res.status(400).json({
                msg:"Invalid Password"
            })
        }

    }else{

        res.status(401).json({
            msg:"User not Found"
        })

    }

})


//logout User
export const logoutUser = asyncHandler( async( req ,res)=> {
          res.cookie('jwt', '' ,{
            httpOnly :true,
            expires: new Date(0)
          })

          res.status(200).json({
            msg:"Logged out Successfully "
          })
})


//Get All Users
export const getallUsers = asyncHandler(async(req,res)=>{
    const Users = await User.find({})

    res.status(200).json({
        Users
    })
})

//Get Current User Profile 

export const getCurrentUserProfile = asyncHandler ( async (req,res)=> {
    const userProfile = await User.findById(req.user._id)
    res.status(200).json({
      userProfile
    })
})


//Update Profile Of Current User


export const updateCurrentUserProfile = asyncHandler (async(req,res)=>{
    const user = await User.findById(req.user._id)
    
    if(user){
        user.email = req.body.email || user.email,
        user.username = req.body.username || user.username
        
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword
        }

        const updateUser = await user.save()

        res.status(200).json({
            msg:"Profile Updated Successfully"
        })

    }else{
        res.status(400)
        throw new Error("User not found")
    }
})