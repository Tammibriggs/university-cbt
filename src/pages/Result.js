import { useDispatch, useSelector } from "react-redux"
import { useGetResultQuery } from "../redux/services/user"
import { useGetCourseByCodeQuery } from "../redux/services/course"
import { setCredentials } from "../redux/authSlice"
import { clearExamState } from "../redux/examSlice"
import { useEffect } from "react"
import { api } from "../redux/services/api"

function Result() {

  const {user} = useSelector((state) => state.auth) 
  const {data: course} = useGetCourseByCodeQuery(user.startCourse.course, {skip: !user?.startCourse.course})
  const {data: result, refetch} = useGetResultQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const dispatch = useDispatch()

  useEffect(() => {
    refetch()
  }, [refetch])

  const logout = () => {
    sessionStorage.clear()
    dispatch(setCredentials({user: null, token: null}))
    dispatch(clearExamState())
    dispatch(api.util.resetApiState());
  };

  return (
    <div className='w-[90%] m-auto min-h-screen flex items-center justify-center flex-col'>
      <h1 className='text-5xl font-mono'>Congratulation</h1>

      <table className='w-full max-w-[1100px] mt-[40px] border border-solid border-gray-200'>
        <thead className='flex px-3 bg-[#344d87] text-white'>
          <tr className="basis-[25%] py-6"><td className='text-xl'>Full Name</td></tr>
          <tr className="basis-[25%] py-6"><td className='text-xl'>Matriculation No</td></tr>
          <tr className="basis-[25%] py-6"><td className='text-xl'>Coure Code</td></tr>
          <tr className="basis-[25%] py-6"><td className='text-xl'>Score</td></tr>
        </thead>
        <tbody>
          <tr className='flex py-6 px-3 blue-400text-lg even:bg-gray-200'>
            <td className='basis-[25%]'>{user?.firstName + ' ' + user?.lastName}</td>
            <td className='basis-[25%]'>{user?.matNo}</td>
            <td className='basis-[25%]'>{user?.startCourse?.course}</td>
            <td className='basis-[25%]'>{result?.correctAnswers} / {course?.questions?.length}</td>
          </tr>
        </tbody>
      </table>
     <button className='mt-10 bg-red-300 py-3 px-5 rounded-md cursor-pointer text-white' onClick={logout}>Log out</button>
    </div>
  )
}

export default Result
