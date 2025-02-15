import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './sign-up-profile.css';
import api from '../assest/api';
import { useCookies } from 'react-cookie';
import SignUp from './sign-up';

const SignUpProfile = () => {
    const navigate = useNavigate();
    const [newUserID, setNewUserID] = useState(null);
    const [newPhotoID, setNewPhotoID] = useState(null);
    const [cookies, setCookie] = useCookies(['user','photo', 'profile']);
    const [profiles, setProfiles] =useState([]);
    const [formData, setFormData] = useState({
        UserID: 0,
        PhotoID: 0,
        Bio: ''
    });

    useEffect(() => {
            // Read the value of the newUserID cookie
            const newUserIDCookie = document.cookie.split('; ').find(row => row.startsWith('newUserID='));
            // Read the value of the newProfileID cookie
            const newPhotoIDCookie = document.cookie.split('; ').find(row => row.startsWith('newPhotoID='));
          
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
            if (newPhotoIDCookie) {
              const newPhotoID = newPhotoIDCookie.split('=')[1];
              setNewPhotoID(newPhotoID);
          
              // Update the ProfileID in formData
              setFormData(prevState => ({
                ...prevState,
                PhotoID: newPhotoID,
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
        const response = await api.post('/profiles/', formData);
        const newProfile = response.data;
        const newProfileID = newProfile.ProfileID;
    
        console.log(newProfileID);
        setCookie('newProfileID', newProfileID, { path: '/' });
        //fetchProfiles();
        setFormData({
          UserID: newUserID,
          PhotoID: newPhotoID,
          Bio: ''
        });
    
        navigate('/signup/desires');
      }

        setCookie('newProfileID', newProfileID, { path: '/' });

        setFormData({
            UserID: newUserID,
            Bio: ''
        });

        navigate('/signup/desires');
    }

    return (
        <div className="wrapper">
            <div><h2>Add Bio</h2></div>
        
            <div>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label>Bio</label>
                        <input type='text' id='Bio' name='Bio' onChange={handleInputChange} value={formData.Bio} />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
};

export default SignUpProfile;
