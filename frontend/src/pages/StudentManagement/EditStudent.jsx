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
    imageUrl: '', // Added this for storing the image URL to show preview
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/students/list`);
        const student = res.data?.data.find(student => student._id === studentId);
        if (student) {
          setFormData({
            name: student.name,
            age: student.age,
            status: student.status,
            image: null, // Reset image to null if it's being updated
            imageUrl: student.image || '', // Assuming image field contains URL
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
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Edit Student</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status || 'Active'}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
          {formData.imageUrl && (
            <img src={`http://localhost:5001/images/${formData.imageUrl}`} alt="Student" className="mt-4 w-32 h-32 object-cover rounded-md" />
          )}
        </div>

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {loading ? "Updating..." : "Update Student"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;
