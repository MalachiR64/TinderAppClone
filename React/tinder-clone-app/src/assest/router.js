import React , {useState, useEffect} from 'react'
import { useCookies } from 'react-cookie'
import api from './api';                                                         //only one dot because both api and Router are in components file
import { BrowserRouter, Router, Route, Switch, Routes, Navigate } from 'react-router-dom';
import SignUp from '../pages/sign-up';                                                  //two dot because signup and Router are in differnt files
import SignUpPhotos from '../pages/sign-up-photos.js';
import SignUpProfile from '../pages/sign-up-profile';
import SignUpDesires from '../pages/sign-up-desires';
import SignUpInterest from '../pages/sign-up-interest';
import SignUpInterestDesired from '../pages/sign-up-interest-desired';
import Home from '../pages/home';
import Messages from '../pages/messages';
import Update from '../pages/update';
import Chat from '../pages/chat.js';


export default function WebRouter(){
    const [cookies] = useCookies(['newUserID', 'newPhotoID', 'newProfileID','newDesireID']);
    
    const BrowserRoutes = () =>{
        return(
            
            <BrowserRouter>
            <Routes>
                <Route path="/signup" element={<SignUp />} />
                    <Route path="/signup/photos" element={<SignUpPhotos />} />
                    <Route path="/signup/profile" element={<SignUpProfile />} />
                    <Route path="/signup/desires" element={<SignUpDesires />} />
                    <Route path="/signup/interest" element={<SignUpInterest />} />
                    <Route path="/signup/interestDesired" element={<SignUpInterestDesired />} />
                <Route path="/messages" element={<Messages />} />
                    <Route path="/messages/:MatchID" element={<Chat />} />
                <Route path="/update" element={<Update />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<Navigate to="/signup" />} />
            </Routes>
        </BrowserRouter>
        
        )

    }
    
    return(
        <BrowserRoutes/>
    )
}