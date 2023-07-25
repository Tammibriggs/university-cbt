import React from 'react'

const useSession = () => {
  const setSessions = (session) => {
    sessionStorage.setItem("answers", JSON.stringify(session))
  }

  const getSession = () => {
    let parsedData;
    if(sessionStorage) {
     parsedData = sessionStorage.getItem("answers")
    }
    const answers = JSON.parse(parsedData);
    return answers
  }

  return {
     setSessions: setSessions,
     getSession: getSession
  }
}

export default useSession
