import { call, put, select } from "redux-saga/effects";
import { Question } from "types/Question";
import { API } from "../../api/sportsapi";
import { QuestionActionTypes } from "../types";

export function* getQuestions() {
  try {
    const {
      quiz: { questions },
    } = yield select();
    const result = yield call(API.getQuestions, null);
    if (result.data && result.data.response_code === 0) {
      // skip existing questions
      const filtered = result.data.results.filter((i) => !questions.find((q) => q.question === i.question));
      const newQuestions: Question[] = filtered.map((question) => {
        return {
          ...question,
          correct_answers: [question.correct_answer],
        };
      });
      yield put({
        type: QuestionActionTypes.GET_QUESTIONS_SUCCESS,
        payload: newQuestions,
      });
    } else {
      yield put({
        type: QuestionActionTypes.GET_QUESTIONS_FAILURE,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
