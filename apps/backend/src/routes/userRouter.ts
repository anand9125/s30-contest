import { Router } from "express";
import { userSignin, userSignup, userValidater } from "../controller/userController";

const router = Router();

router.post("/signup", userSignup)

router.post("/signin", userSignin)

router.post("/signi/post",userValidater)


export const userRouter = router;