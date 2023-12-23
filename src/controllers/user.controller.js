import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
// get the user details from frontend 
//validation not empty
//check if user already exists from username or email beacuse these two are unique
//check for images , check for avatar(compulsary)
//if available upload them to cloudinary ,avatar
//create a user data (mongo db has object based databse)
//get the url as a string from cloudinary 
//give details to frontend except password annd refresh token 
//check for user creation 
//return respone succesfully user created 
const registerUser = asyncHandler(async (req, res) => {

  const { fullname, email, username, password } = req.body
  console.log("fullname is :", fullname)
  if ([username, password, fullname, email].some((field) => field?.trim() === '')) {
    throw new ApiError(400, "every filed is required")
  }
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  if (existingUser) {
    throw new ApiError(409, "user already exists ")
  }
  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.file?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  console.log("avatar object is", avatar
  )
  console.log("url is ", avatar)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
    username: username.toLowerCase()
  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )
})


export { registerUser }