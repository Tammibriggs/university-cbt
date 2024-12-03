import { useState } from "react";
import { useAdminLoginMutation } from "../redux/services/auth"
import { useDispatch } from "react-redux";
import {setCredentials} from '../redux/authSlice'

function AdminLogin() {

  const [inputValues, setInputValues] = useState({username: 'admin', password: 'admin'})
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [adminLogin, result] = useAdminLoginMutation()
  const dispatch = useDispatch()

  const inputClass = `appearance-none h-[50px] border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:shadow-none focus:outline 
    ${result?.error ? 'border-red-600' : ' border-gray-300'}
  `;

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    const response = await adminLogin(inputValues)
    if(response.data) {
      const {token, user, isAdmin} = response.data
      dispatch(setCredentials({user:{...user, isAdmin}, token}))
      sessionStorage.setItem('currentUser', JSON.stringify({...user, isAdmin}))
      sessionStorage.setItem('token', token)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues({...inputValues, [name] : value})
  };

  return (
    <div className="App bg-gray-100">
      <div className="w-screen h-screen flex items-center justify-center">
        <article className="w-1/2 px-20 max-w-[700px]">
          <h2 className="font-black text-4xl mb-4 leading-[45px] font-serif">
            WELCOME TO FACULTY OF COMPUTING EXAMINATION PORTAL
          </h2>
          <p className="text-base">LOGIN WITH YOUR ADMIN CREDENTIALS</p>
        </article>
        <div className="w-1/2 max-w-sm">
          {result?.error && (
            <div className=" bg-red-100 text-red-800 font-semibold shadow-md rounded px-8 py-2 my-4">
              {result.error.data?.message}
            </div>
          )}
          <form
            className=" bg-white shadow-xl rounded px-8 py-8 pt-8"
            onSubmit={handleAdminLogin}
          >
            <div className=" pb-4">
              <label className="text-sm block pb-2">USERNAME</label>
              <input
                type="text"
                name="username"
                value={inputValues.username || ""}
                className={inputClass}
                placeholder="Enter your username"
                onChange={handleInputChange}
              />
            </div>
            <div className="pb-4 pt-4">
              <label htmlFor="password" className="text-sm block pb-2">
                PASSWORD
              </label>
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={inputValues.password || ""}
                className={inputClass}
                placeholder="Enter your password"
                onChange={handleInputChange}
              />
              <div className="text-gray-500 flex items-center mt-3">
                <input
                  type="checkbox"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="w-5 h-5 mr-2"
                />
                Show Password
              </div>
            </div>
            <div className="w-full text-right">
              <button
                disabled={result.isLoading}
                className="bg-blue-500 disabled:bg-slate-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                SIGN IN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin
