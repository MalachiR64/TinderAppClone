import React , {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import './sign-up-profile.css';
import './update.css';
import api from '../assest/api';
import { useCookies } from 'react-cookie';
import  SignUp from './sign-up';
const Update = () => {
    const navigate =useNavigate();
    const [newProfileID, setNewProfileID] = useState(null);
    const [newUserID, setNewUserID] = useState(null);
    const [cookies, setCookie] = useCookies(['user', 'profile']);
    const [profiles, setProfiles] =useState([]);
    const [formData, setFormData] = useState({
        UserID: 0,
        ProfileID: 0,
        Bio: ''
    });

  
    useEffect(() => {
      // Read the value of the newUserID cookie
      const newUserIDCookie = document.cookie.split('; ').find(row => row.startsWith('newUserID='));
      // Read the value of the newProfileID cookie
      const newProfileIDCookie = document.cookie.split('; ').find(row => row.startsWith('newProfileID='));
    
      // Extract the user ID from the newUserID cookie value
      if (newUserIDCookie) {
        const newUserID = newUserIDCookie.split('=')[1];
        setNewUserID(newUserID);
    
        // Update the UserID in formData
        setFormData(prevState => ({
          ...prevState,
          UserID: newUserID,
        }));
      }
    
      // Extract the profile ID from the newProfileID cookie value
      if (newProfileIDCookie) {
        const newProfileID = newProfileIDCookie.split('=')[1];
        setNewProfileID(newProfileID);
    
        // Update the ProfileID in formData
        setFormData(prevState => ({
          ...prevState,
          ProfileID: newProfileID,
        }));
      }
    }, []);
    
        
    
      
    const handleInputChange = (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      setFormData({
        ...formData,
        [event.target.name]: value,
      });
    };
    
    const handleFormSubmit = async (event) => {
      event.preventDefault();
    
      // Assuming newUserID and newProfileID are available in the component's scope
      // Update User
      try {
        const userResponse = await api.put(`/users/${newUserID}`, formData);
        console.log('User updated:', userResponse.data);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    
      // Update Profile
      if (newProfileID) {
        try {
          const profileResponse = await api.put(`/profiles/${newProfileID}`, formData);
          const newProfile = profileResponse.data;
          const updatedProfileID = newProfile.ProfileID;
    
          console.log('Profile updated:', updatedProfileID);
          setCookie('newProfileID', updatedProfileID, { path: '/' });
          //fetchProfiles(); // Uncomment if you have this function defined to refresh profiles
    
          // Reset formData if needed or handle as per your requirements
          setFormData({
            UserID: newUserID,
            Bio: ''
          });
    
          navigate('/home');
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      } else {
        console.error('Error: newProfileID is not initialized.');
      }
    }
  return (
    <div className='wrapper'>
     <h2>Update Profile Information</h2>
    <div>
      <form onSubmit={handleFormSubmit}>
       <div className='input-row'>
        <div className='input-box'>
          <label>First Name</label>
          <input type='text' id = 'FirstName' name = 'FirstName' onChange={handleInputChange} value={formData.FirstName} />
        </div>
        <div className='input-box'>
          <label>Last Name</label>
          <input type='text' id = 'LastName' name = 'LastName' onChange={handleInputChange} value={formData.LastName} />
        </div>
        </div>
        <div className='input-box'>
          <label>Email</label>
          <input type='text' id = 'Email' name = 'Email' onChange={handleInputChange} value={formData.Email} />
        </div>
        <div className='input-box'>
          <label>Age</label>
          <input type='text' id = 'Age' name = 'Age' onChange={handleInputChange} value={formData.Age} />
        </div>
        <div className='input-box'>
          <label>Gender</label>
          <input type='text' id = 'Gender' name = 'Gender' onChange={handleInputChange} value={formData.Gender} />
        </div>
        <div className='input-box'>
          <label>Location</label>
          <input type='text' id = 'Location' name = 'Location' onChange={handleInputChange} value={formData.Location} />
        </div>
        <div className='input-box'>
          <label>Bio</label>
          <input type='text' id = 'Bio' name = 'Bio' onChange={handleInputChange} value={formData.Bio} />
        </div>
        <div className='input-box'>
          <label>Interests</label>
          <input type='text' id = 'Interests' name = 'Interests' onChange={handleInputChange} value={formData.Interests} />
        </div>
        <div className='input-box button'>
        <button type='sumbit'>
          Submit
        </button>  
        </div>
      </form>
    </div>
    </div>
  );
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MessageIcon from '@mui/icons-material/Message';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {useNavigate, BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

const Update = () => {

  const nav = useNavigate();

  const navBar = (newPage) => {
    if (newPage == 0) {
      nav('/messages/')
    }
    else if (newPage == 1) {
      nav('/home/')
    }
  }


  const [users, setUsers] = useState ([]);
  const [formData, setFormData] = useState ({
    FirstName: '',
    LastName: '',
    Email: '',
    Age: 0,
    Gender: '',
    Location: '',
    Bio: '',
    Interests: ''
  });

  
  const fetchUsers = async () =>{
    const response = await api.get('/users/')
    setUsers (response.data)
  }

  useEffect (() => {
    fetchUsers();

  }, []);

  const handleInputChange = (event) =>{
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) =>{
    event.preventDefault();
    await api.post('/users/', formData);
    await api.post('/profiles/',{
      Bio: formData.Bio,
      Interests: formData.Interests
    });
    fetchUsers();
    setFormData({
    FirstName: '',
    LastName: '',
    Email: '',
    Age: 0,
    Gender: '',
    Location: '',
    Bio: '',
    Interests: ''
    });
  }
 return (
   <div class='wrapper'>
    <h2>Update Profile Information</h2>
   <div>
     <form onSubmit={handleFormSubmit}>
      <div className='input-row'>
       <div className='input-box'>
         <label>First Name</label>
         <input  type='text' id = 'FirstName' name = 'FirstName' onChange={handleInputChange} value={formData.FirstName} />
       </div>
       <div className='input-box'>
         <label>Last Name</label>
         <input  type='text' id = 'LastName' name = 'LastName' onChange={handleInputChange} value={formData.LastName} />
       </div>
       </div>
       <div className='input-box'>
         <label>Email</label>
         <input  type='text' id = 'Email' name = 'Email' onChange={handleInputChange} value={formData.Email} />
       </div>
       <div className='input-box'>
         <label>Age</label>
         <input  type='text' id = 'Age' name = 'Age' onChange={handleInputChange} value={formData.Age} />
       </div>
       <div className='input-box'>
         <label>Gender</label>
         <input  type='text' id = 'Gender' name = 'Gender' onChange={handleInputChange} value={formData.Gender} />
       </div>
       <div className='input-box'>
         <label>Location</label>
         <input  type='text' id = 'Location' name = 'Location' onChange={handleInputChange} value={formData.Location} />
       </div>
       <div className='input-box'>
         <label>Bio</label>
         <input  type='text' id = 'Bio' name = 'Bio' onChange={handleInputChange} value={formData.Bio} />
       </div>
       <div className='input-box'>
         <label>Interests</label>
         <input  type='text' id = 'Interests' name = 'Interests' onChange={handleInputChange} value={formData.Interests} />
       </div>
       <div className='input-box button'>
       <button type='sumbit'>
         Submit
       </button>  
       </div>
     </form>
   </div>
   <BottomNavigation
        id = 'bottom'
        showLabels
        onChange={(event, newValue) => {
          navBar(newValue);
        }}
      >
        <BottomNavigationAction label="Messages" icon={<MessageIcon />} />
        <BottomNavigationAction label="Home" icon={<WhatshotIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountBoxIcon />} />
      </BottomNavigation>
   </div>
   
 );
};

export default Update;
