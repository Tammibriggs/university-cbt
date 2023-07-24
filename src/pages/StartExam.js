import React from 'react'
import { millisToMinutesAndSeconds } from '../utils'

function StartExam() {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center p-4 bg-gray-100'>
      {/* <h1 className='text-5xl font-bold'>Take Your Exams</h1>
      <p className='text-xl'>You have {millisToMinutesAndSeconds((20 * courses.length) * 60 * 1000)} minutes to complete the following courses.</p> 
      <div className='mt-5 flex flex-wrap gap-2 justify-center'>
        {courses.map(course =>
          <div className='border border-solid border-gray-400 py-2 px-3 rounded-lg text-sm'>
            {course.code?.toUpperCase()}
          </div>
          )
        }
      </div>
      <button className='bg-blue-500 py-3 px-5 rounded-lg mt-5 cursor-pointer text-white' onClick={() => history.push('/exam')}>START EXAMS</button> */}
    </div>
  )
}

export default StartExam
