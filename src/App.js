import { useEffect } from 'react';
import './app.css';
import {setCredentials} from './redux/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import StartExam from './pages/StartExam';
import Exam from './pages/Exam';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Questions from './pages/Questions';
import Result from './pages/Result';

function App() {

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  const storageToken = sessionStorage.getItem('token')
  const {token, user} = useSelector((state) => state.auth) 
  const dispatch = useDispatch()

  useEffect(() => {
    if(!token) {
      dispatch(setCredentials({user: currentUser, token: storageToken}))
    }
  }, [token, dispatch, currentUser, storageToken])

  return (
    <div className='app'>
      <Routes>
      {!user?.isAdmin 
          ? <>
              <Route path='/start-exam' element={token  ? <StartExam /> : <Navigate to='/'/>}/>
              <Route path='/exam' element={token ? <Exam /> : <Navigate to='/'/>}/>
              <Route path='/result' element={token ? <Result /> : <Navigate to='/'/>}/>
            </>
          : <>
              <Route path='/' element={token ?  <Admin /> : <Navigate to='/admin'/> }/>
              <Route path='/view-questions/:courseId' element={token ?  <Questions /> : <Navigate to='/' />}/>
            </> 
        }
        <Route path='/' element={token && !user?.isAdmin ? <Navigate to='/start-exam'/> : <Login />}/>
        <Route path='/admin' element={token && user?.isAdmin ? <Navigate to='/' /> : <AdminLogin />}/>
      </Routes> 
    </div>
  );
}

export default App;
