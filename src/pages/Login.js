import { useState } from "react";
import { useLoginMutation } from "../redux/services/auth"
import {FormControl, MenuItem, Select } from '@mui/material';
import { useDispatch } from "react-redux";
import {setCredentials} from '../redux/authSlice'
import { useGetCourseCodesQuery } from "../redux/services/course";

function Login() {

  const [inputValues, setInputValues] = useState({})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [login, result] = useLoginMutation()
  const {data: courseCodes} = useGetCourseCodesQuery()
  const dispatch = useDispatch()
  
  const inputClass = `appearance-none h-[50px] border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-none focus:outline 
    ${result?.error ? 'border-red-600' : ' border-gray-300'}
  `;

  const handleLogin = async (e) => {
    e.preventDefault()
    const response = await login(inputValues)
    if(response.data) {
      const {token, user, isAdmin} = response.data
      dispatch(setCredentials({user:{...user, isAdmin}, token, isAdmin}))
      sessionStorage.setItem('currentUser', JSON.stringify({...user, isAdmin}))
      sessionStorage.setItem('token', token)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({...inputValues, [name]: name === 'matNo' ? value.toUpperCase() : value})
  };

  return (
    <div className="App bg-gray-100">
      <div className="w-screen h-screen flex items-center justify-center">
        <article className="w-1/2 px-20 max-w-[700px]">
          <h2 className="font-black text-4xl mb-4 leading-[45px] font-serif">
            WELCOME TO FACULTY OF COMPUTING EXAMINATION PORTAL
          </h2>
          <p className="text-base">
            LOGIN WITH YOUR CREDENTIALS TO BEGIN YOUR EXAMINATION
          </p>
        </article>
        <div className="w-1/2 max-w-sm">
          {result?.error && (
            <div className=" bg-red-100 text-red-800 font-semibold shadow-md rounded px-8 py-2 my-4">
              {result.error.data.message}
            </div>
          )}
          <form
            className=" bg-white shadow-xl rounded px-8 py-8 pt-8"
            onSubmit={handleLogin}
          >
            <div className=" pb-4">
              <label htmlFor="email" className="text-sm block pb-2">
                MATRICULATION NUMBER
              </label>
              <input
                type="text"
                name="matNo"
                value={inputValues.matNo || ''}
                className={inputClass}
                placeholder="U2019/557020"
                onChange={handleInputChange}
              />
            </div>
            <FormControl fullWidth style={{position: 'relative'}}>
              <label id="course" className="text-sm pb-2">COURSE</label>
              <Select
                labelId="course"
                id="course-of-study"
                value={inputValues.courseCode || ''}
                name='courseCode'
                required
                sx = {{
                  'fontSize': '16px',
                  'height': '50px',
                  'position': 'relative',
                  'color': inputValues.course === '' ? '#b7b9bb': '#1E293B'
                }}
                MenuProps={{
                  sx: {
                    '& .MuiPaper-root' : {
                      'maxHeight': '400px',
                      'maxWidth': '300px'
                    }
                  },
                  MenuListProps:{
                    sx: {
                      '& .MuiMenuItem-root': {
                        'fontSize': "14px",
                        'whiteSpace': 'normal',
                      }
                    }
                  }
                }}
                displayEmpty
                renderValue={(value) => value || 'Select-course-code' }
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={handleInputChange}
              >
                {courseCodes?.map(courseCode => (
                  <MenuItem key={courseCode.code} value={courseCode.code}>{`${courseCode.title} (${courseCode.code})`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="pb-4 pt-4">
              <label
                htmlFor="password"
                className="text-sm block pb-2"
              >
                PASSWORD
              </label>
              <input
                type={isPasswordVisible ? 'text' : "password"}
                name="password"
                value={inputValues.password || ''}
                className={inputClass}
                placeholder="Enter your password"
                onChange={handleInputChange}
              />
              <div className="text-gray-500 flex items-center mt-3">
                <input 
                  type="checkbox" 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="w-5 h-5 mr-2"/> 
                Show Password
              </div>
            </div>
            <div className="w-full text-right">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
