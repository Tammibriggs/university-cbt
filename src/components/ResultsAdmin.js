import { useState } from 'react'
import { useGetCourseByCodeQuery, useGetCourseCodesQuery } from '../redux/services/course'
import { useGetCourseStudentsQuery, useGetResultsQuery } from '../redux/services/user'
import { FormControl, MenuItem, Select } from "@mui/material"
import * as XLSX from 'xlsx';

function ResultsAdmin() {

  const [courseCode, setCourseCode] = useState('')

  const {data: courseCodes} = useGetCourseCodesQuery()
  const {data: students } = useGetCourseStudentsQuery(courseCode, {skip: !courseCode})
  const {data: course} = useGetCourseByCodeQuery(courseCode, {skip: !courseCode})
  const {data: results, isLoading} = useGetResultsQuery(courseCode, {skip: !courseCode})

  const getStudent = (id) => {
    if(students) {
      return students.find((student) => student._id === id)
    }
    return {}
  }

  const downloadExcel = () => {
    if(results?.length) {
      const resultsDs = results.map((result) => {
        return {
          "Full Name": getStudent(result.userId).firstName + ' ' + getStudent(result.userId).lastName,
          "Matriculation Number": getStudent(result.userId).matNo,
          "Course Code": courseCode,
          "Score": result.correctAnswers / course.questions.length
        }
      })
      const worksheet = XLSX.utils.json_to_sheet(resultsDs);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      XLSX.writeFile(workbook, "results.xlsx");
    }
  };

  return (
    <div className='w-full'>
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
              <div className="flex gap-3 items-center justify-between">
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
               <button 
                className='gap-1 flex w-fit border border-blue-300 border-solid rounded-md py-2 px-4 bg-blue-200 hover:bg-blue-400 hover:text-white mt-[20px]'
                onClick={downloadExcel}>
                  Download as Excel
                </button>
              </div>
              <table className='w-full max-w-[1100px] mt-[40px] border border-solid border-gray-200'>
                <thead className='flex px-3 bg-[#344d87] text-white'>
                  <tr className="basis-[25%] py-6"><td className='text-xl'>Full Name</td></tr>
                  <tr className="basis-[25%] py-6"><td className='text-xl'>Matriculation No</td></tr>
                  <tr className="basis-[25%] py-6"><td className='text-xl'>Course Code</td></tr>
                  <tr className="basis-[25%] py-6"><td className='text-xl'>Score</td></tr>
                </thead>
                <tbody>
                  {results.map((result, i) => (
                    <tr key={i} className='flex py-6 px-3 blue-400text-lg even:bg-gray-200'>
                      <td className='basis-[25%]'>{getStudent(result.userId)?.firstName + ' ' + getStudent(result.userId)?.lastName}</td>
                      <td className='basis-[25%]'>{getStudent(result.userId)?.matNo}</td>
                      <td className='basis-[25%]'>{courseCode}</td>
                      <td className='basis-[25%]'>{result.correctAnswers} / {course?.questions?.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      }
    </div>
  )
}

export default ResultsAdmin
