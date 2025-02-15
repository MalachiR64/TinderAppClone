import React, { useState, useEffect } from 'react';
import './home.css';
import api from '../assest/api';
import { useCookies } from 'react-cookie';
import { all } from 'axios';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MessageIcon from '@mui/icons-material/Message';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import {useNavigate, BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';

const Home = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['newUserID']);
  const [profiles, setProfiles] = useState([]);
  const [profileFirstName, setProfileFirstName] = useState([]);
  const [profileLastName, setProfileLastName] = useState([]);
  const [profileBio, setProfileBio] = useState([]);
  const [profileAge, setProfileAge] = useState([]);
  const [profileGender, setProfileGender] = useState([]);
  const [profileInterests, setProfileInterests] = useState([]);
  const [userID, setUserID] = useState(cookies.newUserID);
  const [profileID, setProfileID] = useState(0);
  const [profileUserID, setProfileUserID] = useState(0);

  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)


  const nav = useNavigate();

  const navBar = (newPage) => {
    if (newPage == 0) {
      nav('/messages/')
    }
    else if (newPage == 2) {
      nav('/update/')
    }
  }


  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50 

  const onTouchStart = (e) => {
    console.log('touched')
    setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isLeftSwipe || isRightSwipe) processSwipe(isLeftSwipe ? 'left' : 'right')
    // add your conditional logic here
  }

  const fetchUser = async (UserID) =>{
    const response = await api.get('/users/' + UserID)
    setProfileFirstName(response.data.FirstName)
    setProfileLastName(response.data.LastName)
    setProfileAge(response.data.Age)
    setProfileGender(response.data.Gender)
    return response.data

  }

  const fetchInterests = async (ProfileID) =>{
    const response = await api.get('/ProfileInterests/profile/' + ProfileID)
    const interestPromises = response.data.map(async row => (await api.get('/interests/' + row.InterestID)).data.InterestName);  

    const interests = await Promise.all(interestPromises);

    setProfileInterests(interests)
  }

  const fetchProfile = async (UserID) =>{
    const response = await api.get('/profiles/user/' + UserID)
    setProfileBio(response.data.Bio)
    setProfileID(response.data.ProfileID)
    setProfileUserID(response.data.UserID)
    fetchInterests(response.data.ProfileID)
    return
  }

  // 
  
  const fetchSwipes = async (UserID) => {
    try {
      const response = await api.get(`/swipes/user/${UserID}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch matches:', error);
      return [];
    }
  };
  
  const fetchOtherProfiles = async (userID) => {
    try {
      const response = await api.get(`/profiles/other/user/${userID}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch other profiles:', error);
      return [];
    }
  };
  
  // Function to handle fetching all other users excluding matched users
  const fetchAllOtherProfiles = async (userID) => {
    try {


      const fetchedSwipes = await fetchSwipes(userID);
      const excludedProfileIDs = fetchedSwipes.map(swipe => swipe.ProfileID)
      const otherProfiles = await fetchOtherProfiles(userID);
      const profiles = otherProfiles.filter(profile => !excludedProfileIDs.includes(profile.ProfileID))
      setProfiles(profiles)

    } catch (error) {
      console.error('Failed to fetch all other users:', error);
      return [];
    }
  };


  const displayProfile = async () => {
    if (!profiles[0]) {
      return
    }
    await fetchUser(profiles[0].UserID);
    await fetchProfile(profiles[0].UserID);
  }

  const processSwipe = async (swipeDirection) => {
    const swipeData = {
      UserID: userID,
      ProfileID: profileID,
      SwipeDirection: swipeDirection,
      SwipeTime: new Date()
    };

    if (swipeDirection == 'right') {
      const matchData = {
        UserID: userID,
        UserID2: profileUserID,
        MatchTime: new Date()
      };
      const response = await api.post('/matches/', matchData);
      console.log('made match')
      console.log(response)
    }

    const response = await api.post('/swipes/', swipeData);
    console.log(response)
    fetchAllOtherProfiles(userID)
  }

  const initialize = async () => {
    //await fetchProfile();
    
    fetchAllOtherProfiles(userID);
    
  }

  

  useEffect (() => {
    initialize()
  }, [userID]);

  useEffect (() => {
    displayProfile()
  }, [profiles]);

  const fetchUser = async () => {
    const response = await api.get('/users/' + userID);
    setProfileFirstName(response.data.FirstName);
    setProfileLastName(response.data.LastName);
    setProfileAge(response.data.Age);
    setProfileGender(response.data.Gender);
  };

  const fetchProfile = async () => {
    const response = await api.get('/profiles/user/' + userID);
    setProfileBio(response.data.Bio);
    fetchInterests(response.data.ProfileID);
  };

  const fetchInterests = async ProfileID => {
    const response = await api.get('/ProfileInterests/profile/' + ProfileID);
    const interestPromises = response.data.map(async row => (
      await api.get('/interests/' + row.InterestID)
    ).data.InterestName);
    const interests = await Promise.all(interestPromises);
    setProfileInterests(interests);
  };

  useEffect(() => {
    if (userID) {
      initialize();
    }
  }, [userID]);

  const initialize = async () => {
    await fetchUser();
    await fetchProfile();
  };

  return (
    <div >
      <div className="profile-container">
        <div className='profile-card' onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <div className='profile-details'>
            <div className='profile-name'> Name: {profileFirstName} {profileLastName}</div>
            <div className='profile-age'> Age: {profileAge} {profileGender}</div>
            <div className='profile-bio'> Bio: {profileBio}</div>
            <div className='profile-interests'> Interests: {profileInterests.join(', ')}</div>
          </div>
        </div>
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

export default Home;
