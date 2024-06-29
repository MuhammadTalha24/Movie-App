import express from "express"
const router = express.Router()
import {
createUsers,
loginUser,
logoutUser,
getallUsers,
getCurrentUserProfile,
updateCurrentUserProfile,
} 
from "../controllers/userController.js"
import {authenticate , authorizeAdmin} from "../middlewares/authMiddleware.js"


router.route('/').post(createUsers)
.get(authenticate , authorizeAdmin , getallUsers)
router.route('/auth').post(loginUser)
router.route('/logout').post(logoutUser)

router.route('/profile').get(authenticate,getCurrentUserProfile).put(authenticate , updateCurrentUserProfile)

export default router