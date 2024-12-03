import { useDispatch, useSelector } from "react-redux"
import { useDeleteResultMutation, useGetResultQuery } from "../redux/services/user"
import { useGetCourseByCodeQuery } from "../redux/services/course"
import { setCredentials, setUser } from "../redux/authSlice"
import { clearExamState } from "../redux/examSlice"
import { useEffect } from "react"
import { api } from "../redux/services/api"
import { useNavigate } from "react-router-dom"

function Result() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector((state) => state.auth) 

  const {data: course} = useGetCourseByCodeQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const {data: result, refetch, isUninitialized} = useGetResultQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const [deleteResult, deleteState] = useDeleteResultMutation()

  useEffect(() => {
    if(!isUninitialized) {
      refetch()
    }
  }, [])

  const logout = () => {
    sessionStorage.clear()
    dispatch(setCredentials({user: null, token: null}))
    dispatch(clearExamState())
    dispatch(api.util.resetApiState());
  };

  const handleRetry = async () => {
     const res = await deleteResult(user?.startCourse?.course)
    if(res.data) {
      dispatch(setUser({user: res.data}))
      dispatch(clearExamState())
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({ ...res.data })
      );
      navigate('/start-exam')
    }
  }

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
     <button className='mt-10 bg-red-400 hover:bg-red-500 py-3 px-5 rounded-md cursor-pointer text-white' onClick={logout}>Log out</button>
     <span className="mt-5 py-3 px-5 text-slate-600">
        Test Mode Privilage: {" "}
        <span
          onClick={handleRetry}
          className={`font-medium text-slate-800 cursor-pointer ${
            deleteState.isLoading ? "cursor-wait" : ""
          }`}
        >
          {deleteState.isLoading ? "Processing..." : "Retry"}
        </span>
      </span>
    </div>
  )
}

export default Result
