import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    status: "Active",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Hook to navigate after successful form submission

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("age", formData.age);
    data.append("status", formData.status);
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.post("http://localhost:5001/api/students/add", data);
      setFormData({ name: "", age: "", status: "Active", image: null });
      alert("Student Added Successfully");
      navigate("/students/list"); // Navigate to the students list page after success
    } catch (error) {
      console.error("Error saving student", error);
      alert("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Add Student</h1>
      <form onSubmit={handleSubmit}>
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
          {loading ? "Saving..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
