import Student from "../models/Student.js"; // Assuming you have a Student model

// Add student
export const addStudent = async (req, res) => {
  const { name, age, status } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newStudent = new Student({ name, age, status, image });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error adding student", error);
    res.status(500).json({ message: "Error adding student" });
  }
};

// List all students
export const listStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ data: students });
  } catch (error) {
    console.error("Error fetching students", error);
    res.status(500).json({ message: "Error fetching students" });
  }
};

// Remove student
export const removeStudent = async (req, res) => {
  const { id } = req.body;
  try {
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student removed successfully" });
  } catch (error) {
    console.error("Error removing student", error);
    res.status(500).json({ message: "Error removing student" });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age, status } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, status, image },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error updating student", error);
    res.status(500).json({ message: "Error updating student" });
  }
};

// Change student status
export const changeStudentStatus = async (req, res) => {
  const { studentId, status } = req.body;
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { status },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Error changing student status", error);
    res.status(500).json({ message: "Error changing student status" });
  }
};
