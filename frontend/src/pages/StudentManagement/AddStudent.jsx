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
  const navigate = useNavigate();

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
      navigate("/students/list");
    } catch (error) {
      console.error("Error saving student", error);
      alert("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Student Name"
            required
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div>
            <input
              type="file"
              name="image"
              onChange={handleChange}
            />
            {formData.image && (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="preview"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
