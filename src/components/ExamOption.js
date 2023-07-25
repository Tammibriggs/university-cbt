import { useDispatch, useSelector } from "react-redux";
import { setAnswer, setAnswers } from "../redux/examSlice";
import { useEffect } from "react";

const ExamOption = ({ option, questionId }) => {

  const [optionLabel, optionText] = Object.entries(option)[0];
  const storageAnswers = sessionStorage.getItem("answers")
  const { currentIndex, answers } = useSelector((state) => state.exam); 
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(!answers.length && storageAnswers) {
      dispatch(setAnswers(JSON.parse(storageAnswers)))
    }else {
      sessionStorage.setItem("answers", JSON.stringify(answers))
    }
  }, [answers])
    
  const handleOptionSelect = () => {
    dispatch(setAnswer({option: optionLabel, questionId, index: currentIndex}))
  }
  
  const isSelected = ( ) => {
    const answer = answers.find((answer) => answer.questionId === questionId);
    if (answer && answer.option === optionLabel) {
      return true;
    }
    return false;
  }

  return (
    <div className="mb-4 px-2">
      <span className="mr-4 text-lg">{optionLabel.toUpperCase()}</span>
      <button
        className={`px-4 py-2 border text-lg rounded-md ${
          isSelected()
            ? 'bg-[#344d87] text-white hover:bg-[#4863d1]'
            : 'bg-white hover:bg-gray-200'
        }`}
        onClick={handleOptionSelect}
      >
        {optionText}
      </button>
    </div>
  );
};

export default ExamOption