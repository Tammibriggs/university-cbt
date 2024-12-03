import { useDispatch, useSelector } from 'react-redux'
import { todaysDate } from '../utils'
import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import { Warning } from '@phosphor-icons/react'
import ExamCard from '../components/ExamCard'
import { useGetCourseByCodeQuery } from '../redux/services/course'
import { skipQuestion } from '../redux/examSlice'
import { useGetQuestionsQuery } from '../redux/services/question'
import Countdown, { zeroPad } from 'react-countdown';
import { useSaveResultMutation } from '../redux/services/user'
import { useNavigate } from 'react-router-dom'

function Exam() {

  const [openModal, setOpenModal] = useState(false)
  
  const user = useSelector((state) => state.auth.user) 
  const { currentIndex, answers } = useSelector((state) => state.exam); 
  const {data: course} = useGetCourseByCodeQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const {data: questions} = useGetQuestionsQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const [submitAnswers, submitResult] = useSaveResultMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(user) {
      !user?.startCourse?.endingTime && navigate('/start-exam')
    }
  }, [user, navigate])

  const submit = async () => {
    const res = await submitAnswers({answers, courseCode: user?.startCourse?.course})
    if(res.data) navigate('/result')
  }

  const hasBeenAnswered = (question) => {
    return answers?.some(answer => answer.questionId === question._id)
  };

  const renderer = ({ hours, minutes, seconds }) => (
    <span className={`text-3xl font-bold ${minutes < 2 ? 'text-orange-500' : ''}`}>
      {zeroPad(hours)}: {zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );

  return (
    <div className="bg-gray-100 h-screen">
       <>
        <nav className="h-16 flex items-center px-8 shadow-sm">
          <p className="mr-auto">{todaysDate()}</p>
          <p className="mr-4">{user?.firstName + ' ' + user?.lastName}</p>
          <button
            className="px-2 py-2 bg-orange-200 text-orange-800 text-sm font-semibold rounded-lg"
            onClick={() => setOpenModal(true)}
          >
            Submit Exam
          </button>
        </nav>
        {openModal && 
          <Modal
            open={openModal}
            onClose={(e) => {e.stopPropagation(); setOpenModal(false)}}
          >
            <Warning className='text-orange-400 m-auto' size={100}/>
            <h3 className="text-center">
              Do you want to submit this exam?
            </h3>
            <div className="flex justify-center mt-8">
              <button
                className="text-xs px-8 py-2 rounded text-gray-500 hover:text-black shadown-none outline-none font-semibold mx-4"
                onClick={(e) => {e.stopPropagation(); setOpenModal(false)}}
              >
                Cancel
              </button>
              <button 
                disabled={submitResult.isLoading}
                className={`text-xs border px-8 py-2 rounded font-semibold mx-4  ${submitResult.isLoading ?  'bg-none border-slate-500 text-slate-800'  : 'border-orange-500 text-orange-800 bg-orange-100 hover:bg-orange-300'}`}
                onClick={submit}
              >
                {submitResult.isLoading ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </Modal>
        }
      </>
      <div className="flex px-24 py-8 max-w-[1300px] m-auto">
        <div className='w-4/5'>
          {course &&
            <h2 className='font-semibold flex gap-2 text-2xl mb-3 cursor-pointer'>
              {course?.title} ({course?.code})
            </h2>
          }
          <ExamCard  />
        </div>
        <section className="list p-4 flex w-1/5 flex-col min-w-[200px]">
          <section className="question-list flex gap-2 flex-wrap px-4 min-w-[200px]">
            {questions && questions.questions.map((question, index ) => (
               <div className="w-1/4 flex justify-center mb-4" key={index}>
                <span
                  className={`p-2 w-10 h-10 inline-block shadow rounded-full text-center hover:bg-blue-200 font-bold cursor-pointer ${
                    currentIndex === index
                      ? 'bg-blue-300  text-blue-900'
                      : hasBeenAnswered(question)
                      ? 'bg-blue-800 text-white'
                      : 'bg-white  text-blue-900'
                  }`}
                  onClick={() => dispatch(skipQuestion(index))}
                >
                  {index + 1}
                </span>
              </div>
            ))}
          </section>
          { user?.startCourse?.endingTime && 
            <section className="timer mt-auto flex justify-center">
              {console.log(user.startCourse.endingTime)}
              <Countdown date={user.startCourse.endingTime} onComplete={submit} renderer={renderer} />
            </section>
          }
        </section>
      </div>
    </div>
  )
}

export default Exam
