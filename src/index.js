import dotenv from 'dotenv'

import connectDB from './db/index.js';
import { app } from './app.js';
dotenv.config({
  path: './env'
})


/*(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    app.listen(process.env.PORT, () => {
      console.log("App is running on port ", process.env.PORT);
    });
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
})(); */
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at ${process.env.PORT}`);
    })
  })
  .catch((err) => {
    console.log("mongodb connection failed !!!")
    console.log(err);
  })
