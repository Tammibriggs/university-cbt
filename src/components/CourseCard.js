import Modal from "./Modal";
import { useEffect, useState } from "react";
import { Notebook, TrashSimple, Warning } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useChangeCourseStatusMutation, useGetCoursesQuery, useDeleteCourseMutation } from "../redux/services/course";
import { toast } from "react-toastify";

function CourseCard({course, isFetching}) {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentlyPublishedCourse, setCurrentlyPublishedCourse] = useState(null)
  const [isACoursePublished, setIsACourseAlreadyPublished] = useState(false)
  const [isOngoingCourse, setIsOngoingCourse] = useState(false)
  const [isAvailable, setIsAvailable] = useState(course.isAvailable)
      
  const {data: courses} = useGetCoursesQuery()
  const [changeCourseStatus, courseStatusResult] = useChangeCourseStatusMutation()
  const [deleteCourse, courseDeleteResult] = useDeleteCourseMutation()
  const navigate = useNavigate()

  const changeStatus = async (e) => {
    setIsOngoingCourse(false);
    e.stopPropagation()
    const res = await changeCourseStatus(course._id)
    if(res.data) setIsAvailable(res.data.isAvailable)
    if(res.error) {
      toast.error(res.error.data?.message || 'Something went wrong. Please try again')
    }
    setIsACourseAlreadyPublished(false)
  }

  const handleChangeCourseStatus = async (e) => {
    e.stopPropagation();
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
      setIsOngoingCourse(true)
    }
  };

  const handleDeleteCourse = async () => {
    const res = await deleteCourse(course._id)
    if(res.error) {
      toast.error(res.error.data?.message || 'Something went wrong. Please try again')
    }
    setIsDeleteModalOpen(false);

  }

  return (
    <>
      <div
        onClick={() => navigate(`/view-questions/${course._id}`)}
        className="hover:shadow-lg hover:border-gray-200 relative p-4 rounded-2xl cursor-pointer border border-solid border-gray-300 flex-grow flex pb-7 bg-white"
      >
        <div className="text-sm text-white bg-[#344d87] shadow-lg gap-2 font-serif absolute w-[110px] h-[110px] rounded-full flex items-center justify-center top-[-30px] left-[-30px] flex-col">
          <Notebook size={25} />
          {course.code}
        </div>
        <div className="flex flex-grow flex-col ml-16">
          <div className="flex gap-1 mb-3 justify-end">
            {isAvailable ? (
              <span
                onClick={handleChangeCourseStatus}
                className="flex text-gray-500 hover:text-red-500"
              >
                {courseStatusResult.isLoading 
                  ? "Unpublishing..."
                  : "Unpublish"}
              </span>
            ) : (
              <span
                onClick={handleChangeCourseStatus}
                className={`flex text-gray-500 hover:text-green-500 ${
                  course.written ? "text-gray-400 cursor-not-allowed" : ""
                }`}
              >
                {courseStatusResult.isLoading 
                  ? "Publishing..."
                  : "Publish"}
              </span>
            )}
            <TrashSimple
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteModalOpen(true);
              }}
              className="hover:text-red-400 text-gray-500"
              size={25}
            />
          </div>

          <h2 className="text-lg">{course.title}</h2>

          <p className="text-base text-gray-500">
            <span className="font-bold">
              {course.questions.length ? course.questions.length : 0}
            </span>{" "}
            questions
          </p>
        </div>
      </div>
      {isDeleteModalOpen && (
        <Modal
          open={isDeleteModalOpen}
          onClose={(e) => {
            e.stopPropagation();
            setIsDeleteModalOpen(false);
          }}
        >
          <Warning className="text-red-400 m-auto mb-3" size={80} />
          <p className="text-xl text-center">
            Do you want to delete <strong>{course.code}</strong>
          </p>
          <button
            className={`py-2 px-5 border border-solid rounded-md mt-5 ${
              courseDeleteResult.isLoading
                ? "border-gray-400 text-gray-400 cursor-wait"
                : "border-red-400 text-red-400"
            }`}
            disabled={courseStatusResult.isLoading}
            onClick={handleDeleteCourse}
          >
            Proceed
          </button>
        </Modal>
      )}
      {isACoursePublished && (
        <Modal
          open={isACoursePublished}
          onClose={(e) => {
            e.stopPropagation();
            setIsACourseAlreadyPublished(false);
          }}
        >
          <Warning className="text-red-400 m-auto mb-3" size={80} />
          <p className="text-xl text-center">
            To publish <strong>{course.code}</strong> you will authomatically be
            unpublishing <strong>{currentlyPublishedCourse.code}</strong>
          </p>
          <button
            className={`py-2 px-5 border border-solid rounded-md mt-5 ${
              courseStatusResult.isLoading
                ? "border-gray-400 text-gray-400 cursor-wait"
                : "border-blue-500 text-blue-500"
            }`}
            disabled={courseStatusResult.isLoading}
            onClick={changeStatus}
          >
            Proceed
          </button>
        </Modal>
      )}
      {isOngoingCourse && (
        <Modal
          open={isOngoingCourse}
          onClose={(e) => {
            e.stopPropagation();
            setIsOngoingCourse(false);
          }}
        >
          <Warning className="text-red-400 m-auto mb-3" size={80} />
          <p className="text-xl text-center">
            This course is currently ongoing! Do you still wish to proceed?
          </p>
          <button
            className={`py-2 px-5 border border-solid rounded-md mt-5 ${
              courseStatusResult.isLoading
                ? "border-gray-400 text-gray-400 cursor-wait"
                : "border-blue-500 text-blue-500"
            }`}
            disabled={courseStatusResult.isLoading}
            onClick={changeStatus}
          >
            Proceed
          </button>
        </Modal>
      )}
    </>
  );
}

export default CourseCard
