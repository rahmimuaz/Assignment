import studentModel from "../models/studentModel.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Add student
export const addStudent = async (req, res) => {
  const image_filename = req.file ? req.file.filename : "";

  const { name, age, status } = req.body;
  const studentId = `STU-${uuidv4()}`;

  try {
    const student = new studentModel({
      studentId,
      image: image_filename,
      name,
      age,
      status,
      date: new Date(),
    });

    await student.save();
    res.json({ success: true, message: "Student added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding student" });
  }
};

// List students
export const listStudents = async (req, res) => {
  try {
    const students = await studentModel.find({});
    res.json({ success: true, data: students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error retrieving students" });
  }
};

// Remove student
export const removeStudent = async (req, res) => {
  try {
    const student = await studentModel.findById(req.body.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    if (student.image) {
      fs.unlink(`uploads/${student.image}`, (err) => {
        if (err) console.error("Error deleting image file:", err);
      });
    }

    await studentModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Student removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error removing student" });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { id, name, age, status } = req.body;
    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      { name, age, status },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: updatedStudent, message: "Student updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Change student status
export const changeStudentStatus = async (req, res) => {
  const { studentId, status } = req.body;

  if (!["Active", "Inactive"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const student = await studentModel.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    student.status = status;
    await student.save();

    res.json({ success: true, message: "Student status updated", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
