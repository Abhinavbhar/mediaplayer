import { v2 as cloudinary } from 'cloudinary';
import { log } from 'console';
import { response } from 'express';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    else {
      const respone = await cloudinary.uploader.upload(localFilePath, {
        resource_type: 'auto'
      })
    }
    console.log("file is uploaded on cloudinary", response.url);
    return respone;
  }
  catch (error) {
    fs.unlinkSync(localFilePath)//remove the locally saved temporary file as the upload operation got failed
    return null;
  }
}
export { uploadOnCloudinary }