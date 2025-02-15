import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import api from '../assest/api';
import './sign-up-interest.css'; // Reusing the same CSS file for styling

const SignUpInterest = () => {
  const navigate = useNavigate();
  const [newProfileID, setNewProfileID] = useState(null);
  const [cookies, setCookie] = useCookies(['profile', 'profileInterest']);
  const [formData, setFormData] = useState({ ProfileID: 0, InterestID: 0 });
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('newProfileID='));
    if (cookieValue) {
      const newprofileID = cookieValue.split('=')[1];
      setNewProfileID(newprofileID);
      setFormData(prevState => ({ ...prevState, ProfileID: newprofileID }));
    }
  }, []);

  const handleSelect = e => {
    const selectedOption = options.find(option => option.label === e.target.value);
    if (!selectedOption) return;
    const newSelectedValues = [...selectedValues];
    if (newSelectedValues.length >= 5) {
      alert('You can only select up to 5 values.');
      return;
    }
    newSelectedValues.push(selectedOption);
    setSelectedValues(newSelectedValues);
  };

  const handleDelete = value => {
    const newSelectedValues = selectedValues.filter(option => option.label !== value);
    setSelectedValues(newSelectedValues);
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
    for (const selectedOption of selectedValues) {
      const formDataForOption = { ...formData, InterestID: selectedOption.value };
      const response = await api.post('/ProfileInterests/', formDataForOption);
      const newProfileInterest = response.data;
      const newProfileInterestID = newProfileInterest.ProfileInterestID;
      console.log(newProfileInterestID);
      setCookie('newProfileInterestID', newProfileInterestID, { path: '/' });
    }
    setFormData({ ProfileID: newProfileID, InterestID: 0 });
    navigate('/signup/interestDesired');
  };

  const options = [
    { value: 1, label: 'Adventure Sports' }, { value: 2, label: 'Art' }, { value: 3, label: 'Coding' }, { value: 4, label: 'Coffee' },
    { value: 5, label: 'Cooking' }, { value: 6, label: 'Creativity' }, { value: 7, label: 'Dogs' }, { value: 8, label: 'Fitness' },
    { value: 9, label: 'Food' }, { value: 10, label: 'Gadgets' }, { value: 11, label: 'Gaming' }, { value: 12, label: 'Hiking' },
    { value: 13, label: 'Mindfulness' }, { value: 14, label: 'Movies' }, { value: 15, label: 'Music' }, { value: 16, label: 'Nature' },
    { value: 17, label: 'Nature Conservation' }, { value: 18, label: 'Nutrition' }, { value: 19, label: 'Photography' },
    { value: 20, label: 'Programming' }, { value: 21, label: 'Reading' }, { value: 22, label: 'Sports' }, { value: 23, label: 'Technology' },
    { value: 24, label: 'Travel' }, { value: 25, label: 'Writing' }, { value: 26, label: 'Yoga' }
  ];

  const handleInputChange = (event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index].value = event.target.value;
    setSelectedValues(newSelectedValues);
  };

  return (
<div className='wrapper'>
  <div className="form-container">
    <h2>Select your interests</h2>
    <form onSubmit={handleFormSubmit}>
      <select onChange={handleSelect}>
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.label}>{option.label}</option>
        ))}
      </select>
      <div className="selected-values">
        <ul>
          {selectedValues.map((option, index) => (
            <li key={option.value}>
              {option.label}
              <button className="button" onClick={() => handleDelete(option.label)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      <button className="submit-button" type="submit">Submit</button>
    </form>
  </div>
</div>

  );
};

export default SignUpInterest;
