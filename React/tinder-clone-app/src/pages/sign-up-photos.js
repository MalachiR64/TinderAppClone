import React , {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { useCookies } from 'react-cookie';
import './sign-up-photos.css';
import api from '../assest/api';
const SignUpPhotos = () => {
    const navigate =useNavigate();
    
    const [formData, setFormData] = useState ({
        file_name: '',
        file_path: '',
        UploadTime: ''
        });
    const [selectedFile, setSelectedFile] = useState(null);
    const [cookies, setCookie] = useCookies(['photo']); // Initialize cookies for photo
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);
  
        try {
          const response = await api.post('/photos/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          const uploadedPhoto = response.data;
          const  newPhotoID = uploadedPhoto.PhotoID
          console.log(newPhotoID);
          setCookie('newPhotoID', newPhotoID, { path: '/' }); // Set cookie for PhotoID
          navigate('/signup/profile');
        } catch (error) {
          console.error('Error uploading photo:', error);
        }

        
      }
    };
  
    return (
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload Photo</button>
      </form>
    );
  };
export default SignUpPhotos;