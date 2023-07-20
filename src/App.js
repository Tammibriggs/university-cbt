import { useEffect, useState } from 'react';
import './app.css';
import {setCredentials} from './redux/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import StartExam from './pages/StartExam';
import Exam from './pages/Exam';
import AdminLogin from './pages/AdminLogin';

function App() {

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const storageToken = sessionStorage.getItem('token')
  const {token, user} = useSelector((state) => state.auth) 
  const dispatch = useDispatch()

  useEffect(() => {
    if(!token) {
      dispatch(setCredentials({user: currentUser, token: storageToken}))
    }
  }, [token, dispatch])

  return (
    <div className='app'>
      <Routes>
        {!user?.isAdmin 
          ? <>
              <Route path='/' element={!token ? <Login /> : <Navigate to='/start-exam'/>}/>
              <Route path='/start-exam' element={token  ? <StartExam /> : <Navigate to='/'/>}/>
              <Route path='/exam' element={token ? <Exam /> : <Navigate to='/'/>}/>
            </>
          : <Route path='/admin' element={!token ? <AdminLogin /> : <Navigate to='/'/>}/>
        }
      </Routes> 
    </div>
  );
}

export default App;
