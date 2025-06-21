import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod/v4";

export async function POST(request: Request){
  await  dbConnect()
  
  try {
   //destructuring the required field for user creation    
   const {username, email, password} = await request.json()

//finding user by Email
   const verifyUsernameByEmail = await UserModel.findOne(
    {
        username,
        isVerified:true
    })
    if(verifyUsernameByEmail){
        return Response.json({
            success:false,
            message:"username already exists"
        },{status:400})
    }
//finding Existing user by email
   const existingUserByEmail =  await UserModel.findOne({email})

   //hashing the verification Code
   const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

   if(existingUserByEmail){
     if(existingUserByEmail.isVerified){
      return  Response.json({
            success:false,
            message: "User already registered with this email"
    },{status:400})
     } else {
      const hashedPassword = await bcrypt.hash(password, 10)
          existingUserByEmail.password = hashedPassword;
          existingUserByEmail.verifyCode = verifyCode;
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

          await existingUserByEmail.save()
     }
   }
   else{
    //hashed the password
     const hashedPassword = await bcrypt.hash(password, 10);
     //verify Code Expiry
     const expiryDate = new Date()
     expiryDate.setHours(expiryDate.getHours() + 1)


//creating the new User
     const newUser =  new UserModel({
            username,
            email,
            password:hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptedMessage: true,
            messages: []
      })
      //save the User
       await newUser.save()
   }

   //send email verification

   const emailResponse = await sendVerificationEmail(
    email,
    username,
    verifyCode
   )
   //if email response is not coimng
   if(!emailResponse.success){
    return Response.json({
            success:false,
            message: emailResponse.message
    },{status:500})
   }
 //email send
    return Response.json({
            success:true,
            message: "User registered Successfully . Please Verify your email"
    },{status:201})

  } catch (error) {
    console.error("Error registering user",error)
    return Response.json({
        success:false,
        message:"Error registering user"
    },{
        status:500
    })
    
  }
}
