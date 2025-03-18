import express from "express";
import { addStudent, listStudents, removeStudent, updateStudent, changeStudentStatus } from "../controllers/studentController.js";
import multer from "multer";

const studentRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

studentRouter.post("/add", upload.single("image"), addStudent);
studentRouter.get("/list", listStudents);
studentRouter.post("/remove", removeStudent);
studentRouter.post("/update", updateStudent);
studentRouter.post("/change-status", changeStudentStatus);

export default studentRouter;
