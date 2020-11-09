import { Question } from "../../types/Question";
import { QuestionActionTypes } from "../types";

export interface QuizState {
  questions: Question[];
  loading: boolean;
  selectedQuestion?: Question | {};
}

const initialQuizState: QuizState = {
  questions: [],
  loading: false,
  selectedQuestion: {},
};

export function questionReducer(state = initialQuizState, action) {
  switch (action.type) {
    case QuestionActionTypes.GET_QUESTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case QuestionActionTypes.GET_QUESTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        questions: [...action.payload, ...state.questions] as Question[],
      };
    case QuestionActionTypes.DELETE_QUESTION_REQUEST:
      return {
        ...state,
        questions: [...state.questions.slice(0, action.payload), ...state.questions.slice(action.payload + 1)],
      };
    case QuestionActionTypes.SELECT_QUESTION:
      return {
        ...state,
        selectedQuestion: action.payload,
      };
    case QuestionActionTypes.UPDATE_SELECTED_QUESTION:
      return {
        ...state,
        selectedQuestion: action.payload,
      };
    default:
      return state;
  }
}
