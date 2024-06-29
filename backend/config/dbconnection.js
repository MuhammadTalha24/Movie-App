import mongoose from "mongoose";

const dbConnection = async ( ) => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Database Connected Successfully!")
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}


export default dbConnection