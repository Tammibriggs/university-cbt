import { useDispatch, useSelector } from "react-redux"
import { useGetQuestionsQuery } from "../redux/services/question"
import ExamOption from "./ExamOption"
import { nextQuestion, prevQuestion } from "../redux/examSlice";

function ExamCard() {

  const { currentIndex } = useSelector((state) => state.exam); 
  const user = useSelector((state) => state.auth.user) 
  const {data: questions} = useGetQuestionsQuery(user?.startCourse?.course, {skip: !user?.startCourse?.course})
  const dispatch = useDispatch()

  const isLastQuestion = () => {
    return currentIndex === questions.questions.length - 1
  }

  if(!questions) return null
  
  return (
    <div className="question border p-4 mr-16 bg-white rounded-lg shadow-xl mt-[20px]">
      <section className="question flex mb-6">
        <h2 className="font-bold text-5xl mr-8">{currentIndex + 1}.</h2>
        <h2 className="font-normal text-gray-800 text-2xl">
          {questions.questions[currentIndex].question} 
        </h2>
      </section> 
      <section className="options px-10 text-sm">
        {questions.questions[currentIndex].options &&
          questions.questions[currentIndex].options.map((option, i) => (
            <ExamOption key={i} option={option} questionId={questions.questions[currentIndex]._id} />
          ))}
      </section>
      <section className="py-4 flex font-semibold text-sm">
        <button
          disabled={currentIndex === 0}
          className={`px-8 py-2 border shadow rounded-md font-bold mx-2 ml-auto flex items-center ${
            currentIndex === 0
              ? 'cursor-not-allowed text-gray-500'
              : 'text-blue-500'
          }`}
          onClick={() => dispatch(prevQuestion())}
        >
           Prev
        </button>
        <button
          disabled={isLastQuestion()}
          className={`px-8 py-2 border shadow rounded-md mx-2 flex items-center font-bold justify-center ${
            isLastQuestion()
              ? 'cursor-not-allowed text-gray-500'
              : 'text-blue-500'
          }`}
          onClick={() => dispatch(nextQuestion())}
        >
          Next
        </button>
      </section>
    </div>
  )
}

export default ExamCard
