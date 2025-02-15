import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './sign-up.css';
import api from '../assest/api';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Age: 0,
    Gender: '',
    Location: ''
  });
  const [cookies, setCookie] = useCookies(['user']); // Initialize cookies

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const response = await api.post('/users/', formData);
    const newUser = response.data;
    const newUserID = newUser.UserID;

    console.log(newUserID);
    setCookie('newUserID', newUserID, { path: '/' });
    setFormData({
      FirstName: '',
      LastName: '',
      Email: '',
      Age: 0,
      Gender: '',
      Location: ''
    });

    navigate('/signup/photos' );
  }

  return (
    <div className='wrapper'>
      <div className="welcome-banner">
        <h3>Welcome to Tinder!</h3>
      </div>
      <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleFormSubmit}>
          <div className='input-row'>
            <div className='input-box'>
              <label>First Name</label>
              <input type='text' id='FirstName' name='FirstName' onChange={handleInputChange} value={formData.FirstName} />
            </div>
            <div className='input-box'>
              <label>Last Name</label>
              <input type='text' id='LastName' name='LastName' onChange={handleInputChange} value={formData.LastName} />
            </div>
          </div>
          <div className='input-box'>
            <label>Email</label>
            <input type='text' id='Email' name='Email' onChange={handleInputChange} value={formData.Email} />
          </div>
          <div className='input-box'>
            <label>Age</label>
            <input type='text' id='Age' name='Age' onChange={handleInputChange} value={formData.Age} />
          </div>
          <div className='input-box'>
            <label>Gender</label>
            <input type='text' id='Gender' name='Gender' onChange={handleInputChange} value={formData.Gender} />
          </div>
          <div className='input-box'>
            <label>Location</label>
            <input type='text' id='Location' name='Location' onChange={handleInputChange} value={formData.Location} />
          </div>
          <div className='input-box button'>
            <button type='submit'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;

  return (
    <div className='wrapper'>
      <div className="welcome-banner">
        <h3>Welcome to Tinder!</h3>
      </div>
      <div className="form-container">
        <h2>Create Account</h2>
        <form onSubmit={handleFormSubmit}>
          <div className='input-row'>
            <div className='input-box'>
              <label>First Name</label>
              <input type='text' id='FirstName' name='FirstName' onChange={handleInputChange} value={formData.FirstName} />
            </div>
            <div className='input-box'>
              <label>Last Name</label>
              <input type='text' id='LastName' name='LastName' onChange={handleInputChange} value={formData.LastName} />
            </div>
          </div>
          <div className='input-box'>
            <label>Email</label>
            <input type='text' id='Email' name='Email' onChange={handleInputChange} value={formData.Email} />
          </div>
          <div className='input-box'>
            <label>Age</label>
            <input type='text' id='Age' name='Age' onChange={handleInputChange} value={formData.Age} />
          </div>
          <div className='input-box'>
            <label>Gender</label>
            <select id='Gender' name='Gender' onChange={handleInputChange} value={formData.Gender}>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
              <option value='Choose not to say'>Choose not to say</option>
            </select>
          </div>
          <div className='input-box'>
            <label>Location</label>
            <input type='text' id='Location' name='Location' onChange={handleInputChange} value={formData.Location} />
          </div>
          <div className='input-box button'>
            <button type='submit'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
