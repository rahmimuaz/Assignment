import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const EditStudent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = location.state?.studentId;

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    status: 'Active',
    image: null,
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/students/${studentId}`);
        const student = res.data?.data;
        if (student) {
          setFormData({
            name: student.name,
            age: student.age,
            status: student.status,
            image: null,
            imageUrl: student.image || '',
          });
        }
      } catch (error) {
        console.error("Error fetching student", error);
      }
    };

    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0], imageUrl: URL.createObjectURL(e.target.files[0]) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('status', formData.status);
    if (formData.image) formDataToSend.append('image', formData.image);

    try {
      await axios.put(`http://localhost:5001/api/students/edit/${studentId}`, formDataToSend);
      setLoading(false);
      navigate("/students");
    } catch (error) {
      console.error("Error updating student", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Edit Student</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            value={formData.status || 'Active'}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="form-control"
          />
          {formData.imageUrl && (
            <div className="mt-3">
              <img
                src={`http://localhost:5001/images/${formData.imageUrl}`}
                alt="Student"
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
          {loading ? "Updating..." : "Update Student"}
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
