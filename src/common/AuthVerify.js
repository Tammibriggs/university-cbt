// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setCredentials } from "../redux/authSlice";

// const parseJwt = (token) => {
//   try {
//     return JSON.parse(atob(token.split(".")[1]));
//   } catch (e) {
//     return null;
//   }
// };

// const AuthVerify = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token = sessionStorage.getItem("token")

//     if (token) {
//       const decodedJwt = parseJwt(token);

//       if (decodedJwt.exp * 1000 < Date.now()) {
//         sessionStorage.clear();
//         dispatch(setCredentials({user: null, token: null}))
//         decodedJwt.isAdmin ? document.location.href
//       }
//     }
//   }, [])

//   return null;
// };

// export default AuthVerify;