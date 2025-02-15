import React , {useState, useEffect} from 'react';
import './chat.css'
import "react-chat-elements/dist/main.css"
import { MessageBox, Input } from "react-chat-elements"
import api from '../assest/api';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Chat = () => {
    const [cookies] = useCookies(['newUserID']);
    const [userID, setUserID] = useState(cookies.newUserID);
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [newMessageContent, setNewMessageContent] = useState('');

    const { MatchID } = useParams();

    const fetchMessages = async (matchID) => {
        const response = await api.get('/messages/match/' + MatchID);
        setMessages(response.data)
    };

    const fetchUser = async (UserID) =>{
        const response = await api.get('/users/' + UserID)
        return response
      }

    const initialize = async () => {
        await fetchMessages(MatchID);
      }
    
    useEffect (() => {
    initialize()
    }, []);

    useEffect (() => {
        const fetchMessageUsers = async (Messages) => {
          const promises = Messages.map(async (message) => {
            const response = await fetchUser(message.UserID)
            return response.data
          })
          const Users = await Promise.all(promises);
          setUsers(Users)
        }
        fetchMessageUsers(messages);
    }, [messages, ]);

    const postMessage = async () => {
        const messageData = {UserID: userID, MatchID: MatchID, Content: newMessageContent};
        try {
            const response = await api.post('/messages/', messageData);
            await fetchMessages(MatchID);
            console.log('Message posted successfully:', response.data);
        } catch (error) {
            console.error('Failed to post message:', error);
        }
    }

    const handleChange = (event) => {
        setNewMessageContent(event.target.value);
    };

    return (



        <div>
            <div id="chat">
            {messages.map((message, index) => {

                let messagePosition = '';


                const user = users[index];
                if (!user) {
                    // Optionally render a placeholder or nothing if the user data is not yet loaded
                    return <div key={index}>Loading...</div>;
                }

                if (userID == message.UserID) {
                    messagePosition = 'right';
                }
                else {
                    messagePosition = 'left';
                }

                return <MessageBox
                    position={messagePosition}
                    type={"text"}
                    title={user.FirstName + ' ' + user.LastName}
                    text={message.Content}
                />  
            })}
            </div>

            <div id="bottom">
                <Input
                placeholder="Type here..."
                multiline={true}
                rightButtons={<button onClick={postMessage} type="submit">Send</button>}
                onChange={handleChange}
                ></Input>
            </div>
        </div>
    );
};

export default Chat;
