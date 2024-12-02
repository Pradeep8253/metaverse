import {Router} from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../../config";

export const router = Router() ;

router.post("/signup" , async  (req , res)  => {
   const parseData  =  SignupSchema.safeParse(req.body)
   if(!parseData.success) {
      res.status(400).json({message : "validation failed "})
      return ;
   }

   const hashPassword =  await  bcrypt.hash(parseData.data.password , 10)

   try {
    const user = await  client.user.create({
        data : {
            username : parseData.data.username,
            password : hashPassword,
            role :  parseData.data.type === "admin" ? "Admin" : "User" ,
        }
    })
    res.json({userId : user.id})
   } catch (e) {
     res.status(400).json( {message : "User Already Exists "})
   }
})


router.post("/signin" , async (req , res) => {

     const parseData =  SigninSchema.safeParse(req.body);
     if(!parseData.success){
        res.status(403).json({message : "Validation  failed"})
        return ;
     }

     try {
         const user = await  client.user.findUnique({
            where : {
                username : parseData.data.username
            }
         })
         if(!user){
             res.status(403).json({message : "User Not Found"})
             return ;
         }

         const isValid = await bcrypt.compare(parseData.data.password, user.password)
         if(!isValid){
             res.status(403).json({message : "Invalid Password"})
             return ;
         }

         const token  =  jwt.sign({
             userId : user.id,
             role : user.role
         } , JWT_PASSWORD)
        
         res.json({token})
     } catch (error) {
        
     }

    res.json({
        message : "signin Success"
    })
})

router.get("/elements" ,  (req , res) => {

})

router.get("/avatars" , (req , res) => {

})

router.use("/user" , userRouter);
router.use("/space" , spaceRouter);
router.use("/admin" , adminRouter);