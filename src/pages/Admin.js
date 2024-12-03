import { useState } from "react";
import CoursesAdmin from "../components/CoursesAdmin";
import StudentsAdmin from "../components/StudentsAdmin";
import ResultsAdmin from "../components/ResultsAdmin";
import { setCredentials } from "../redux/authSlice";
import {useDispatch} from 'react-redux'

function Admin() {

  const [currentSection, setCurrentSection] = useState('courses');
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(setCredentials({user: null, token: null}))
    sessionStorage.clear()
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 mx-auto">
      <nav className="shadow-sm flex justify-end px-8 py-4">
        <button
          className="rounded text-slate-800 px-4 py-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
      <div className="flex justify-center my-3 w-[90%] mx-auto max-2-w-[1]">
        <h1
          className={`px-20 py-3 cursor-pointer rounded border-b-2 ${
            currentSection === 'courses' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          onClick={() => setCurrentSection('courses')}
        >
          Courses
        </h1>
        <h1
          className={`px-20 py-3 rounded cursor-pointer border-b-2 ${
            currentSection === 'students' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          onClick={() => setCurrentSection('students')}
        >
          Students
        </h1>
        <h1
          className={`px-20 py-3 rounded cursor-pointer border-b-2 ${
            currentSection === 'results' ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          onClick={() => setCurrentSection('results')}
        >
          Results
        </h1>
      </div>
      <div className="w-[90%] max-w-[1100px] flex flex-grow m-auto">
        {currentSection === 'courses' && <CoursesAdmin />}
        {currentSection === 'students' && <StudentsAdmin />}
        {currentSection === 'results' && <ResultsAdmin />}
      </div>
    </div>
  )
}

export default Admin
