import { useDispatch, useSelector } from 'react-redux'
import { useGetCourseByCodeQuery } from '../redux/services/course'
import { millisToMinutesAndSeconds } from '../utils'
import { setCredentials } from '../redux/authSlice'
import { useGetResultQuery, useStartExamMutation } from '../redux/services/user'
import { useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { setAnswers } from '../redux/examSlice'
import { api } from '../redux/services/api'

function StartExam() {

  const user = useSelector((state) => state.auth.user) 
  const {data: course, isLoading} = useGetCourseByCodeQuery(user?.startCourse?.course)
  const {data: result, isLoading: resultIsLoading, isFetching: resultIsFetching} = useGetResultQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const [startExam, startExamResult] = useStartExamMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(!resultIsLoading) {
      if(result && user?.startCourse?.endingTime) navigate('/result');
      else if (user?.startCourse?.endingTime) navigate('/exam')
    }
  }, [user, resultIsLoading, resultIsFetching, navigate, result])

  const startCourse = async () => {
    const res = await startExam({studentId: user._id, courseCode: user.startCourse.course})
    sessionStorage.setItem('currentUser', JSON.stringify(res.data))
    dispatch(setCredentials({user: res.data}))
  }

  const logout = () => {
    sessionStorage.clear()
    dispatch(setCredentials({user: null, token: null}))
    dispatch(setAnswers([]))
    dispatch(api.util.resetApiState());
  }; 

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center p-4 bg-gray-100'>
      {course?.isAvailable && !result && !resultIsLoading
       ?  <>
            <h1 className='text-7xl font-bold'>Take Your Exams</h1>
            <p className='text-2xl'>You have {millisToMinutesAndSeconds(course.completeTime)} minutes to complete the following courses.</p> 
            <div className='mt-5 flex flex-wrap gap-2 justify-center'>
            <div className='border border-solid border-gray-400 py-2 px-3 rounded-lg text-normal'>
              {course.title} ({course.code})
            </div>
            </div>
            <div className='flex gap-5'>
              <button onClick={logout} className='mt-5 border border-solid border-red-400 rounded-md text-red-400 py-2 px-5'>Logout</button>
              <button 
                disabled={startExamResult.isLoading} 
                className='bg-blue-500 py-3 px-5 disabled:bg-slate-500 rounded-lg mt-5 cursor-pointer text-white' 
                onClick={startCourse}>{startExamResult.isLoading ? 'STARTING...' : 'START EXAMS'}
              </button>
            </div>

          </>
        :  isLoading  || resultIsLoading || resultIsFetching
          ? <></>
          : <>
            <img src='info.png' className='w-96 h-96' alt='info'/>
            <h3 className='text-3xl mt-5 mb-2'>Not Yet Available</h3>
            <p>{user.startCourse.course} has not been published</p>
            <button onClick={logout} className='mt-5 border border-solid border-red-400 rounded-md text-red-400 py-2 px-5'>Logout</button>
           </>
      }
    </div>  
  )
}

export default StartExam
