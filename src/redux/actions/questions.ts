import { Question } from "../../types/Question";
import { QuestionActionTypes } from "../types";

interface GetQuestionsAction {
  type: typeof QuestionActionTypes.GET_QUESTIONS_REQUEST;
}

interface DeleteQuestionAction {
  type: typeof QuestionActionTypes.DELETE_QUESTION_REQUEST;
  payload: number;
}

interface SelectQuestionAction {
  type: typeof QuestionActionTypes.SELECT_QUESTION;
  payload: Question;
}

interface UpdateSelectedQuestionAction {
  type: typeof QuestionActionTypes.UPDATE_SELECTED_QUESTION;
  payload: Question;
}

export type QuestionActions =
  | GetQuestionsAction
  | DeleteQuestionAction
  | SelectQuestionAction
  | UpdateSelectedQuestionAction;

export function getQuestions(): QuestionActions {
  return {
    type: QuestionActionTypes.GET_QUESTIONS_REQUEST,
  };
}

export function deleteQuestion(index): QuestionActions {
  return {
    type: QuestionActionTypes.DELETE_QUESTION_REQUEST,
    payload: index,
  };
}

export function selectQuestion(question): QuestionActions {
  return {
    type: QuestionActionTypes.SELECT_QUESTION,
    payload: question,
  };
}

export function updateSelectedQuestion(question): QuestionActions {
  return {
    type: QuestionActionTypes.UPDATE_SELECTED_QUESTION,
    payload: question,
  };
}
