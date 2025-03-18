import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  date: { type: Date, default: Date.now },
});

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
