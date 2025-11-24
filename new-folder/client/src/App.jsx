import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Discover from '../pages/discover';
import Messages from '../pages/messages';
import Chatbox from '../pages/chatBox';
import Connection from '../pages/connection';
import Profile from '../pages/profiles';
import Feed from '../pages/feed';
import Createpost from '../pages/createPost';
import { useUser } from '@clerk/clerk-react';
import Layout from '../pages/layout'; // Fixed import - removed { }
import {Toaster} from "react-hot-toast";
const App = () => {
  const { user } = useUser(); // Destructure user from useUser()
  
  return (
    <>
        <Toaster/>
      <Routes>
        {/* Fixed the logic - show Layout when user exists, Login when no user */}
        <Route path='/' element={user ? <Layout/> : <Login/>}>
          {/* Nested routes inside Layout */}
          <Route path='messages' element={<Messages/>} />
          <Route index element={<Feed/>}/>
          <Route path='messages/:userId' element={<Chatbox/>} />
          <Route path='discover' element={<Discover/>} />
          <Route path='connections' element={<Connection/>} />
          <Route path='profile' element={<Profile/>} />
          <Route path='profiles/:profileId' element={<Profile/>} />
          <Route path ='create-post' element={<Createpost/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;