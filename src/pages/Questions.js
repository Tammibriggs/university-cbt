import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAdminQuestionsQuery } from "../redux/services/question";
import Question from "../components/Question";
import { ArrowLeft } from "@phosphor-icons/react";

function Questions() {
  const navigate = useNavigate()
  const {courseId} = useParams()
  const dispatch = useDispatch()
  const {data, isLoading} = useGetAdminQuestionsQuery(courseId)

  const handleLogout = () => {
    dispatch(setCredentials({user: null, token: null}))
    sessionStorage.clear()
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="shadow-sm cursor-pointer flex justify-between items-center px-8 py-4">
        <ArrowLeft size={30} onClick={() => navigate(-1)} />
        <button
          className="rounded text-slate-800 px-4 py-2"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {data?.questions ? (
        <div className="w-[90%] m-auto mt-10 max-w-[1100px] pb-10">
          <h1 className="font-bold text-3xl text-center mb-10">
            {data?.course.title} ({data?.course.code})
          </h1>
          <h3 className="text-2xl font-medium">
            {data?.questions.length} Questions
          </h3>
          <div className="flex flex-col gap-3 mt-2">
            {data?.questions.map((question, i) => (
              <Question question={question} key={i} index={i + 1} />
            ))}
          </div>
        </div>
      ) : isLoading ? (
        <></>
      ) : (
        <p>There are no question for this course</p>
      )}
    </div>
  );
}

export default Questions
