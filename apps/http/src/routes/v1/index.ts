import {Router} from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SignupSchema } from "../../types";
import client from "@repo/db/client";

export const router = Router() ;

router.post("/signup" , (req , res)  => {
   const parseData  =  SignupSchema.safeParse(req.body)
   if(!parseData.success) {
      res.status(400).json({message : "validation failed "})
      return ;
   }

   try {
    client
   } catch (error) {
    
   }
})


router.post("/signin" , (req , res) => {
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