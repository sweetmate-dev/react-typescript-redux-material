import { takeEvery } from "redux-saga/effects";
import { QuestionActionTypes } from "../types";
import * as quizSaga from "./questions";

export default function* rootSaga() {
  yield takeEvery(QuestionActionTypes.GET_QUESTIONS_REQUEST, quizSaga.getQuestions);
}
