import express from "express";
import { addDoctor,adminDashboard,allDoctors,appointmentCancel,appointmentsAdmin,loginAdmin } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { chnageAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// Route for adding a doctor ||post request
adminRouter.post("/add-doctor",authAdmin, upload.single("image"), addDoctor);
// Route for admin login || post request
adminRouter.post("/login", loginAdmin);
// Route for geeting all doctors in admin pannel
adminRouter.post("/all-doctors",authAdmin,allDoctors)
adminRouter.post("/change-availability",authAdmin,chnageAvailability)
// Route for getting all appointments at admin pannel
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
//Route fot cancel appintment for admin pannel
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
//Route for gettig all data for admin pannel at dasboard
adminRouter.get('/dashboard',authAdmin,adminDashboard)



export default adminRouter;