import React , {useState, useEffect} from 'react';
import "react-chat-elements/dist/main.css"
import { ChatItem } from 'react-chat-elements'
import {useNavigate, BrowserRouter as Router, Routes, Route, Switch, Link } from 'react-router-dom';
import api from '../assest/api';
import { useCookies } from 'react-cookie';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import MessageIcon from '@mui/icons-material/Message';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WhatshotIcon from '@mui/icons-material/Whatshot';
const Messages = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['newUserID']);

  const nav = useNavigate();
  const handleClick = (MatchID) => {
    nav('/messages/' + MatchID)
  };

  const navBar = (newPage) => {
    if (newPage == 1) {
      nav('/home/')
    }
    else if (newPage == 2) {
      nav('/update/')
    }
  }

  const [userID, setUserID] = useState(cookies.newUserID);
  const [matches, setMatches] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  
  console.log(cookies.newUserID)

  const fetchMatches = async (UserID) => {
    const response = await api.get('/matches/user/' + UserID)
    setMatches(response.data);
    console.log(response.data)
    return
  };

  const fetchUser = async (UserID) =>{
    const response = await api.get('/users/' + UserID)
    return response
  }



  const initialize = async () => {
    await fetchMatches(userID);
  }

  useEffect (() => {
    initialize()
  }, []);

  useEffect (() => {
    const fetchMatchedUsers = async (Matches) => {
      const promises = Matches.map(async (match) => {
        if (userID == match.UserID) {
          const response = await fetchUser(match.UserID2)
          return response.data
        }
        else if (userID == match.UserID2) {
          const response = await fetchUser(match.UserID)
          return response.data
        }
      })
      const matchedUsers = await Promise.all(promises);
      setMatchedUsers(matchedUsers)
    }
    fetchMatchedUsers(matches);
  }, [matches]);

  return (
    <div>
    {matches.map((match, index) => {
      const user = matchedUsers[index];
        if (!user) {
          // Optionally render a placeholder or nothing if the user data is not yet loaded
          return <div key={index}>Loading...</div>;
        }
      return <ChatItem
      avatar={'https://facebook.github.io/react/img/logo.svg'}
      alt={'Reactjs'}
      title={user.FirstName + ' ' + user.LastName}
      // subtitle={'What are you doing?'}
      date={new Date()}
      unread={0}
      onClick={() => handleClick(match.MatchID)}
      />
    })}
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

export default Messages;
