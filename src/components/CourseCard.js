import Modal from "./Modal";
import { useState } from "react";
import { Eye, EyeSlash, Notebook, TrashSimple, Warning } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useChangeCourseStatusMutation, useGetCoursesQuery, useDeleteCourseMutation } from "../redux/services/course";
import Countdown, { zeroPad } from 'react-countdown';

function CourseCard({course}) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentlyPublishedCourse, setCurrentlyPublishedCourse] = useState(null)
  const [isACoursePublished, setIsACourseAlreadyPublished] = useState(false)
  const [isOngoingCourse, setIsOngoingCourse] = useState(false)

  const {data: courses} = useGetCoursesQuery()
  const [changeCourseStatus, courseStatusResult] = useChangeCourseStatusMutation()
  const [deleteCourse, courseDeleteResult] = useDeleteCourseMutation()
  const navigate = useNavigate()

  const changeStatus = async (e) => {
    e.stopPropagation()
    await changeCourseStatus(course._id)
    setIsACourseAlreadyPublished(false)
    setIsOngoingCourse(false)
  }

  const handleChangeCourseStatus = async (e) => {
    e.stopPropagation();
    if(course.written) return;
    // Publish course
    if(!course.isAvailable) {
      const alreadyPublishedCourse = courses.find(course => course.isAvailable === true)
      if(!alreadyPublishedCourse) {
        await changeStatus(e)
      }else {
        setCurrentlyPublishedCourse(alreadyPublishedCourse)
        setIsACourseAlreadyPublished(true)
      }
    }else { // Unpublish course
      if(course.endingTime > Date.now()) setIsOngoingCourse(true)
      else changeStatus(e)
    }
  };

  const renderer = ({ hours, minutes, seconds }) => (
    <span className="text-xl mt-2 text-[#344d87]">
      {zeroPad(hours)}: {zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );

  return (
    <>
    <div
      onClick={() => navigate(`/view-questions/${course._id}`)}
      className="hover:shadow-lg hover:border-gray-200 relative p-4 rounded-2xl cursor-pointer border border-solid border-gray-300 flex-grow flex pb-7 bg-white"
    >
      <div className='text-sm text-white bg-[#344d87] shadow-lg gap-2 font-serif absolute w-[110px] h-[110px] rounded-full flex items-center justify-center top-[-30px] left-[-30px] flex-col'>
        <Notebook size={25} />{course.code}
      </div>
      <div className='flex flex-grow flex-col ml-16'>
        <div className='flex gap-1 mb-3 justify-end'>
          {course.written && <span className="text-green-600">Written</span>}
          {course.isAvailable 
            ? <i title="unpublish"><Eye size={25} className="text-green-500 hover:text-gray-500" onClick={handleChangeCourseStatus}/></i> 
            : <i title="publish">
                <EyeSlash 
                  className={`text-gray-500 hover:text-green-500 ${course.written ? 'text-gray-400 cursor-not-allowed' : ''}`} 
                  onClick={handleChangeCourseStatus} 
                  size={25} />
              </i>
          }
          <TrashSimple onClick={(e) => {e.stopPropagation(); setIsDeleteModalOpen(true)}} className='hover:text-red-400 text-gray-500' size={25} />
        </div>

        <h2 className="text-lg">{course.title}</h2>

        <p className="text-base text-gray-500">
          <span className="font-bold">{course.questions.length ? course.questions.length : 0}</span> questions
        </p>
        {course.endingTime !== 0 && <Countdown date={course.endingTime} onComplete={() => changeCourseStatus(course._id)}  renderer={renderer} />}
      </div>
    </div>
    {isDeleteModalOpen &&
      <Modal
        open={isDeleteModalOpen}
        onClose={(e) => {e.stopPropagation(); setIsDeleteModalOpen(false)}}
      >
        <Warning className="text-red-400 m-auto mb-3" size={80} />
        <p className="text-xl text-center">Do you want to delete <strong>{course.code}</strong></p>
        <button 
          className={`py-2 px-5 border border-solid rounded-md mt-5 ${courseDeleteResult.isLoading ? 'border-gray-400 text-gray-400 cursor-wait' : 'border-red-400 text-red-400'}`}
          disabled={courseStatusResult.isLoading}
          onClick={async () => await deleteCourse(course._id)}>
            Proceed
        </button>
      </Modal>
    }
    {isACoursePublished &&
      <Modal
        open={isACoursePublished}
        onClose={(e) => {e.stopPropagation(); setIsACourseAlreadyPublished(false)}}
      >
        <Warning className="text-red-400 m-auto mb-3" size={80} />
        <p className="text-xl text-center">
          To publish <strong>{course.code}</strong> you will authomatically be unpublishing <strong>{currentlyPublishedCourse.code}</strong>
        </p>
        <button 
          className={`py-2 px-5 border border-solid rounded-md mt-5 ${courseStatusResult.isLoading ? 'border-gray-400 text-gray-400 cursor-wait' : 'border-blue-500 text-blue-500'}`}
          disabled={courseStatusResult.isLoading}
          onClick={changeStatus}>
            Proceed
        </button>
      </Modal>
    }
    {isOngoingCourse &&
      <Modal
        open={isOngoingCourse}
        onClose={(e) => {e.stopPropagation(); setIsOngoingCourse(false)}}
      > 
        <Warning className="text-red-400 m-auto mb-3" size={80} />
        <p className="text-xl text-center">This course is currently ongoing! Do you still wish to proceed?</p>
        <button 
          className={`py-2 px-5 border border-solid rounded-md mt-5 ${courseStatusResult.isLoading ? 'border-gray-400 text-gray-400 cursor-wait' : 'border-blue-500 text-blue-500'}`}
          disabled={courseStatusResult.isLoading}
          onClick={changeStatus}>
            Proceed
        </button>
      </Modal>
    }
    </>
  )
}

export default CourseCard
