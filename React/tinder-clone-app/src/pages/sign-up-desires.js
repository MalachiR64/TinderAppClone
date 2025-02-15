import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './sign-up.css';
import api from '../assest/api';

const SignUpDesires = () => {
    const navigate = useNavigate();
    const [newProfileID, setNewProfileID] = useState(null);
    const [cookies, setCookie] = useCookies(['profile', 'desire']);
    const [desires, setDesires] = useState([]);
    const [formData, setFormData] = useState({
        ProfileID: 0,
        MinAge: 0,
        MaxAge: 0,
        SexOrientation: ''
    });

    useEffect(() => {
        const cookieValue = document.cookie.split('; ').find(row => row.startsWith('newProfileID='));
        if (cookieValue) {
            const newprofileID = cookieValue.split('=')[1];
            setNewProfileID(newprofileID);

            setFormData(prevState => ({
                ...prevState,
                ProfileID: newprofileID,
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
        const response = await api.post('/desires/', formData);
        const newDersire = response.data;
        const newDesireID = newDersire.DesireID;

        setCookie('newDesireID', newDesireID, { path: '/' });

        setFormData({
            ProfileID: newProfileID,
            MinAge: 0,
            MaxAge: 0,
            SexOrientation: ''
        });

        navigate('/signup/interest');
    }

    return (
        <div className="wrapper">
            <div>What is your desired partner?</div>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <div className='input-box'>
                        <label>Minimum Age</label>
                        <input type='text' id='MinAge' name='MinAge' onChange={handleInputChange} value={formData.MinAge} />
                    </div>
                    <div className='input-box'>
                        <label>Maximum Age</label>
                        <input type='text' id='MaxAge' name='MaxAge' onChange={handleInputChange} value={formData.MaxAge} />
                    </div>
                    <div className='input-box'>
                        <label>Your Sex Orientation</label>
                        <select id='SexOrientation' name='SexOrientation' onChange={handleInputChange} value={formData.SexOrientation}>
                            <option value=''>Select...</option>
                            <option value='Straight'>Straight</option>
                            <option value='Gay'>Gay</option>
                            <option value='Bisexual'>Bisexual</option>
                            <option value='Other'>Other</option>
                        </select>
                    </div>
                    <div className='input-box button'>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpDesires;
