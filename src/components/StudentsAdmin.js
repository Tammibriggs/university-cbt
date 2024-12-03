import { useState } from "react"
import { useDeleteCoursePasswordsMutation, useGenerateCoursePasswordsMutation, useGetCourseStudentsQuery } from "../redux/services/user"
import { FormControl, MenuItem, Select } from "@mui/material"
import { useGetCourseCodesQuery } from "../redux/services/course";

function StudentsAdmin() {

  const [courseCode, setCourseCode] = useState('')
  
  const [generateCoursePasswords, generateCoursePasResult] = useGenerateCoursePasswordsMutation()
  const [deleteCoursePasswords] = useDeleteCoursePasswordsMutation()
  const {data: students, isLoading, isFetching, refetch } = useGetCourseStudentsQuery(courseCode, {skip: !courseCode})
  const {data: courseCodes} = useGetCourseCodesQuery()

  const hasPassword = () => {
    if(students?.length && !isFetching && students[0].passwords) {
      return (Object.keys(students[0].passwords).some(code => code === courseCode.substring(0, (courseCode.length - 2))))
    }else {
      return false
    }
  }

  return (
    <div className="w-full">
      {!courseCode
        ? <div className="h-full flex items-center justify-center flex-col">
            <img src='select.jpg' className="rounded-full w-96 h-96" alt="select"/>
            <FormControl fullWidth className="items-center">
              <Select
                labelId="course"
                id="course-of-study"
                value={courseCode || ''}
                name='courseCode'
                required
                sx = {{
                  'fontSize': '16px',
                  'height': '50px',
                  'width': '400px',
                  'borderRadius': '10px',
                  'marginTop': '40px',
                  'marginBottom': '150px',
                  'color': courseCode === '' ? '#b7b9bb': '#1E293B'
                }}
                MenuProps={{
                  sx: {
                    '& .MuiPaper-root' : {
                      'maxHeight': '400px',
                      'maxWidth': '300px',
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
                renderValue={(value) => value || 'Select a course' }
                inputProps={{ 'aria-label': 'Without label' }}
                onChange={(e) => setCourseCode(e.target.value)}
              >
                {courseCodes?.map(courseCode => (
                  <MenuItem key={courseCode.code} value={courseCode.code}>{`${courseCode.title} (${courseCode.code})`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        : isLoading 
          ? <></>
          : <div className="mt-5">
              <div className="flex gap-3 justify-between">
                <FormControl style={{width: '300px'}}>
                  <Select
                    labelId="course"
                    id="course-of-study"
                    value={courseCode || ''}
                    name='courseCode'
                    required
                    sx = {{
                      'fontSize': '16px',
                      'height': '50px',
                      'position': 'relative',
                      'borderRadius': '5px',
                      'color': courseCode === '' ? '#b7b9bb': '#1E293B'
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
                    onChange={(e) => setCourseCode(e.target.value)}
                  >
                    {courseCodes?.map(courseCode => (
                      <MenuItem key={courseCode.code} value={courseCode.code}>{`${courseCode.title} (${courseCode.code})`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {students &&
                  <div className="flex flex-grow-1 justify-between gap-2">
                    <button 
                      disabled={generateCoursePasResult.isLoading}
                      onClick={async () => {await generateCoursePasswords(courseCode); refetch()}}
                      className='whitespace-nowrap py-2 px-4 rounded-md hover:bg-blue-600 bg-blue-500 text-white'>
                      {hasPassword() 
                        ? generateCoursePasResult.isLoading ? 'Regenerating...' : 'Regenerate Passwords' 
                        : generateCoursePasResult.isLoading ? 'Generating...' : 'Generate Passwords'
                      }
                    </button>
                    <button 
                      disabled={!hasPassword()}
                      onClick={async () => {await deleteCoursePasswords(courseCode); refetch()}}
                      className={`whitespace-nowrap py-2 px-4 rounded-md border ${hasPassword() ? 'border-red-300 text-red-300' : 'border-gray-400 text-gray-400 cursor-not-allowed'}`}>
                      Remove Passwords
                    </button>
                  </div>
                }
              </div>
              <table className='w-full max-w-[1100px] mt-[40px] border border-solid border-gray-200'>
                <thead className='flex px-3 bg-slate-200 text-black'>
                  <tr className="basis-[35%] py-6"><td className='text-xl'>Full Name</td></tr>
                  <tr className="basis-[35%] py-6"><td className='text-xl'>Matriculation Number</td></tr>
                  <tr className="basis-[30%] py-6"><td className='text-xl'>Password</td></tr>
                </thead>
                <tbody>
                  {students.map((student, i) => (
                    <tr key={i} className='flex py-6 px-3 blue-400text-lg even:bg-gray-200'>
                      <td className='basis-[35%]'>{student.firstName + ' ' + student.lastName}</td>
                      <td className='basis-[35%]'>{student.matNo}</td>
                      <td className='basis-[30%]'>{hasPassword() && !isLoading ? student.passwords[courseCode.substring(0, (courseCode.length - 2))] : 'null'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      }
    </div>
  )
}

export default StudentsAdmin
