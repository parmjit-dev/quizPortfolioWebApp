/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Play from './play.component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { scoreStore } from '../../store/scoreStore';

const PlayQuiz = () => {
  const history = useHistory();
  const store = useContext(scoreStore);
  const { state } = store;
  const { score } = state;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading ...');
  const [questions, setQuestions] = useState([]);
  const [post, setPost] = useState({
    quizID: '',
    name: '',
    score: '',
  });

  const { pathname } = window.location;
  const searchID = pathname.split('/playQuiz/');
  useEffect(() => {
    async function getQuestions() {
      const questionsArray = await axios.get(`https://quiz-maker-psg-api.herokuapp.com/api/v1/question/?quizID=${searchID[1]}`);
      if (questionsArray.length > 0) {
        questionsArray.data.data.doc.forEach((element, i) => {
          const {
            quizID, image, question, answerSelectionFour, answerSelectionThree, answerSelectionTwo, answerSelectionOne, correctAnswer, _id,
          } = element;
          setQuestions((values) => [...values, {
            quizID: quizID[0].id, id: _id, image, question, answerSelectionOne, answerSelectionTwo, answerSelectionThree, answerSelectionFour, correctAnswer,
          }]);
          setPost({ ...post, quizID: quizID[0].id });
        });
        // setQuiz({ ...quiz, title: quizDoc.title, questions: quizDoc.questions});
        return setLoading(false);
      }
      setLoading(false);
      return setMessage('No Questions in This Quiz.');
    }
    getQuestions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setPost({ ...post, [id]: value });
  };

  const handlePost = (e) => {
    const scoredPost = post;
    scoredPost.score = score;
    e.preventDefault();
    axios.post('https://quiz-maker-psg-api.herokuapp.com/api/v1/score', scoredPost).catch(() => {toast.dark('Score was unable to be sent')});
    history.push({
      pathname: '/finishQuiz',
      state: { score },
    });
  };

  return (
    <div>
      {loading ? (
        <h2>
          {message}
        </h2>
      ) : (
        <div>
          <h2>Add your name and hit the submit button to get your results</h2>
          <form className="quizTitle-form" onSubmit={handlePost}>
            <div>
              <input
                type="text"
                id="name"
                onChange={handleChange}
              />
              <button type="submit" className="btn"> Submit Your name </button>
            </div>
          </form>
          <div>
            { questions.map((element, i) => (
              <Play className="hidden" key={i} {...element} />
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PlayQuiz;
