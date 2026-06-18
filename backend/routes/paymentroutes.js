import express from 'express'
import { createPaymentIntent } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
const router = express.Router()
router.post("/create-payment-intent", authUser, createPaymentIntent);