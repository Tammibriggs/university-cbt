import React, { useEffect, useState } from 'react'
import CourseCard from './CourseCard'
import Modal from '../components/Modal'
import * as xlsx from "xlsx";
import { FormControl, MenuItem, Select } from '@mui/material';
import { useAddCourseMutation, useGetCourseCodesQuery, useGetCoursesQuery, useLazyGetCoursesQuery } from '../redux/services/course';
import { Plus } from '@phosphor-icons/react';
import { useAddQuestionsMutation } from '../redux/services/question';
import { useDispatch } from 'react-redux';

function CourseAdmin() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [courseCode, setCourseCode] = useState('')
  const [courseTitle, setCourseTitle] = useState('');
  const [courseYear, setCourseYear] = useState(null);
  const [questions, setQuestions] = useState([])
  const [file, setFile] = useState(null);
  const [selectedCourseCat, setSelectedCourseCat] = useState('All');
  const [courseIsPublished, setCourseIsPublished] = useState(false)
  
  const [addCourse, addCourseResult] = useAddCourseMutation()
  const [addQuestions, addQuestionsResult] = useAddQuestionsMutation()
  const {data: courseCodes} = useGetCourseCodesQuery()
  const {data: fetchedCourses, isLoading} = useGetCoursesQuery()
  const [getCourse] = useLazyGetCoursesQuery()

  useEffect(() => {
    const course = courseCodes?.find(course => course.code === courseCode)
    setCourseTitle(course?.title)
    setCourseYear(course?.year)
  },[courseCodes, courseCode])

  useEffect(() => {
    setCourseIsPublished(fetchedCourses?.some(course => course.isAvailable === true))
  }, [fetchedCourses])

  useEffect(() => {
    !isModalOpen && resetState()
  }, [isModalOpen])

  function resetState () {
    setCourseCode('');
    setCourseTitle('');
    setFile(null)
  }
 
  // Change questions data structure to the one used in the database
  const changeQuestionsDS = (questions) => {
    let questionsArray = []
    if(questions.length) {
      questions.forEach(question => {
        const questionDS = {
          question: question.Question,
          answer: question.Answer.toLowerCase(),
          optionA: question.OptionA,
          optionB: question.OptionB,
          optionC: question.OptionC,
          optionD: question.OptionD,
        };
        questionsArray = [...questionsArray, questionDS]
      });
   } 
    return questionsArray
  }

  const readUploadFile = (e) => {
    e.preventDefault();
    setFile(e.target.files)
    if (e.target.files.length) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setQuestions(json)
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  }
  
  const isValidFields = () => {
    if(courseCode !== '' && courseTitle !== '' && file) {
      return true;
    }
    return false;
  } 

  const publish = async (e) => {
    e.preventDefault()
    const examQuestions = changeQuestionsDS(questions)
    try {
      const addedCourse = await addCourse({year: courseYear, title: courseTitle, courseCode})
      if(addedCourse.error) return
      await addQuestions({
        courseId: addedCourse.data.course._id,
        questions: examQuestions,
      })
      await getCourse()

      resetState()
      setIsModalOpen(false);
    } catch (error) {
      setIsModalOpen(false);
      console.log(error);
    }
  }

  const publishRequestsLoading = () => {
    if(addCourseResult.isLoading || addQuestionsResult.isLoading) return true
    return false
  }

  const renderCourses = () => {
    if(selectedCourseCat === 'All') {
      return fetchedCourses?.map(course => 
        <CourseCard 
          course={course}
          key={course.code}/>
      )
    }else {
      const filteredCourses = fetchedCourses?.filter(course => course.year === selectedCourseCat)
      return filteredCourses.map(course => 
        <CourseCard 
          key={course.code} 
          course={course}
        />
      )
    }
  }

  const courseCatStyles = (cat) => (
    `py-2 px-5 border border-solid border-gray-300 relative rounded-lg font-light mt-10 cursor-pointer hover:text-white hover:bg-[#344d87] ${cat === selectedCourseCat ? 'bg-[#344d87] text-white' : ''}`
  )

  return (
    <div className="relative w-full">
      <div className='flex gap-3'>
        <span className={courseCatStyles('All')} onClick={() => setSelectedCourseCat('All')}>
          {courseIsPublished && <span className='absolute p-1 bg-green-500 top-1 rounded-full right-1'></span>}
          All
        </span>
        <span className={courseCatStyles(1)} onClick={() => setSelectedCourseCat(1)}>Year 1</span>
        <span className={courseCatStyles(2)} onClick={() => setSelectedCourseCat(2)}>Year 2</span>
        <span className={courseCatStyles(3)} onClick={() => setSelectedCourseCat(3)}>Year 3</span>
        <span className={courseCatStyles(4)} onClick={() => setSelectedCourseCat(4)}>Year 4</span>
      </div>
      {fetchedCourses?.length 
        ? <div className='grid gap-10 md: grid-cols-2 lg:grid-cols-3 place-content-center mt-10'>
            {renderCourses()}
          </div>
        : isLoading 
          ? <></>
          : <div className='h-full flex items-center justify-center flex-col'>
            <img src='empty.jpg' className='rounded-full mx-auto w-96 h-96 object-contain' alt='empty'/>
            <h1 className="text-center text-2xl mt-5 font-light">
              No Course is Available!
            </h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className='bg-blue-500 gap-3 flex items-center text-white py-3 px-6 rounded mb-[200px] mt-5'>
              <Plus size={20}/> Add Course
            </button>
          </div>
      }
      <span
        className='absolute bottom-10 right-0 bg-blue bg-blue-500 text-white p-5 rounded-full cursor-pointer'
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={40} />
      </span>
      <Modal
        open={isModalOpen}
        onClose={(e) => {e.stopPropagation(); setIsModalOpen(false)}}
        modalLable='Add Course'
      >
        {addCourseResult.error && <p className='text-red-400 mt-4 text-lg'>{addCourseResult.error.data.message}</p>}
        <form className="pt-6" onSubmit={publish}>
          <FormControl fullWidth style={{position: 'relative'}}>
            <label id="course" className="text-sm pb-2">COURSE</label>
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
          <div className="mb-4 mt-5">
            <span
              className="block text-sm mb-2"
            >
              COURSE TITLE
            </span>
            <span className="appearance-none py-2 min-h-[50px] border rounded w-full p-3 text-gray-700 block">{courseTitle}</span>
          </div>
          <input type='file' files={file} className='mt-2' accept='.xlsx, .xls, .ods' onChange={readUploadFile}/>
          <div className='w-fit ml-auto'>
            <button
              className={`shadow text-white py-2 px-3 mt-4 rounded-sm focus:outline-none focus:shadow-outline ${isValidFields() && !publishRequestsLoading() ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400'}`}
              type="submit"
              disabled={!isValidFields() || publishRequestsLoading()}
            >
              {publishRequestsLoading() ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default CourseAdmin
