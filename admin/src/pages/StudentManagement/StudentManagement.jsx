import { useState, useEffect } from "react";
import axios from "axios";

const StudentManagement = () => {
  const [students, setStudents] = useState([]); // Ensure students is always an array
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    status: "Active",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/students/list");  // Update to full backend URL
      console.log("Fetched Students:", res.data); // Log API response
      setStudents(res.data?.data || []); // Ensure students is always an array
    } catch (error) {
      console.error("Error fetching students", error);
      setStudents([]); // Prevent undefined errors
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Add or update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("status", formData.status);

    // Append the new or existing image
    if (formData.image && formData.image !== null) {
      data.append("image", formData.image);
    } else if (formData.image === null && editId) {
      // If no new image is selected, include the old image path for update
      data.append("image", formData.image);
    }

    try {
      if (editId) {
        await axios.post("http://localhost:5001/api/students/update", { id: editId, ...formData });
      } else {
        await axios.post("http://localhost:5001/api/students/add", data);
      }
      fetchStudents();
      setFormData({ name: "", age: "", status: "Active", image: null });
      setEditId(null);
    } catch (error) {
      console.error("Error saving student", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      age: student.age,
      status: student.status,
      image: student.image || null, // Ensure the image is kept for update if it's not being changed
    });
    setEditId(student._id);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.post("http://localhost:5001/api/students/remove", { id });
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  // Toggle student status
  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.post("http://localhost:5001/api/students/change-status", { id, status: currentStatus === "Active" ? "Inactive" : "Active" });
      fetchStudents();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Student Management</h1>

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
            className="border p-2 rounded"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex items-center">
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="border p-2 rounded"
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="preview"
                className="w-10 h-10 ml-2 rounded-full"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Saving..." : editId ? "Update Student" : "Add Student"}
        </button>
      </form>

      {/* Student List */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students?.length > 0 ? (
            students.map((student) => (
              <tr key={student._id} className="border">
                <td className="border p-2">
                  {student.image ? (
                    <img
                      src={`http://localhost:5001/images/${student.image}`} // Updated image path to backend
                      alt="student"
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.age}</td>
                <td className="border p-2">
                  <button
                    onClick={() => toggleStatus(student._id, student.status)}
                    className={`px-3 py-1 rounded ${
                      student.status === "Active" ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {student.status}
                  </button>
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(student)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;
