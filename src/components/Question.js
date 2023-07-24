function Question({question, index}) {
  return (
    <div className="question border p-4 bg-white rounded-lg shadow-sm">
      <section className="question flex mb-6">
        <h2 className="font-bold text-3xl mr-8">{index}</h2>
        <article className="font-medium text-gray-800 text-xl">
          {question.question}
        </article>
      </section>
      <section className="options px-10 text-sm">
        {question.options &&
          question.options.map((option, i) => (
            <div className="mb-4 px-2 flex items-center" key={i}>
              <span className="mr-2">{Object.keys(option)[0]}</span>
              <p className='px-2 py-2'>
                {Object.values(option)[0]}
              </p>
            </div>
          ))}
      </section>
      <p>Answer is {question.answer}</p>
    </div>  
  )
}

export default Question