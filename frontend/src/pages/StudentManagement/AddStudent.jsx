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

  const handleNavigateToList = () => {
    navigate("/students/list");
  };

  return (
    <div className="container mt-4">
      <h1>Add Student</h1>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Student Name"
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="form-control"
            placeholder="Age"
            required
          />
        </div>
        <div className="mb-3">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-3">
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="form-control"
          />
          {formData.image && (
            <div className="mt-3">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="preview"
                className="img-fluid"
                style={{ maxHeight: "200px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Student"}
        </button>
      </form>
      <button
        className="btn btn-secondary w-100 mt-3"
        onClick={handleNavigateToList}
      >
        Go to Student List
      </button>
    </div>
  );
};

export default AddStudent;
