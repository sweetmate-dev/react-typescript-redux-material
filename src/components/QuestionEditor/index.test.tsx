import React from "react";
import { render, fireEvent, act, RenderResult } from "../../utils/test-utils";
import "mutationobserver-shim";
import QuestionEditor, {
  ERROR_QUESTION_EMPTY,
  ERROR_ANSWER_EMPTY,
  ERROR_MUST_HAVE_INCORRECT,
  ERROR_MUST_HAVE_CORRECT,
} from "./index";
import { QuizState } from "redux/reducers/questions";

const INITIAL_QUIZ_STATE: QuizState = {
  questions: [
    {
      category: "Sports",
      type: "multiple",
      difficulty: "medium",
      question: "At which bridge does the annual Oxford and Cambridge boat race start?",
      correct_answers: ["Putney"],
      incorrect_answers: ["Hammersmith", "Vauxhall ", "Battersea"],
    },
  ],
  loading: false,
  selectedQuestion: {
    category: "Sports",
    type: "multiple",
    difficulty: "medium",
    question: "At which bridge does the annual Oxford and Cambridge boat race start?",
    correct_answers: ["Putney"],
    incorrect_answers: ["Hammersmith", "Vauxhall ", "Battersea"],
  },
};

describe("Question Editor", () => {
  let renderResult: RenderResult;
  it("Editor card should be invisible unless you select a question.", async () => {
    await act(async () => {
      renderResult = render(<QuestionEditor />);
    });
    // "Editor" title should be visible
    expect(renderResult.getByTestId("editor-title")).toBeVisible();
    // "Question" title in the editor card should not be visible
    expect(renderResult.queryByText("Question")).toBeNull();
  });

  it("If question title is empty, you should see the relevant error message.", async () => {
    await act(async () => {
      renderResult = render(<QuestionEditor />, { quiz: INITIAL_QUIZ_STATE });
    });
    const QuestionInputElement = renderResult.getByTestId("question-input");
    // Question title and its input box in the card should be visible
    expect(QuestionInputElement).toBeVisible();
    expect(renderResult.queryByText("Question")).toBeVisible();

    // set empty string in the question input box
    fireEvent.change(QuestionInputElement, { target: { value: "" } });

    // click save button which has "submit-question" test id
    await act(async () => {
      fireEvent.click(renderResult.getByTestId("submit-question"));
    });

    // ERROR_QUESTION_EMPTY error message should be visible
    expect(renderResult.getByText(ERROR_QUESTION_EMPTY)).toBeVisible();
  });

  it("If an answer is empty, you should see the relevant error message.", async () => {
    await act(async () => {
      renderResult = render(<QuestionEditor />, { quiz: INITIAL_QUIZ_STATE });
    });
    const AnswerInputElement = renderResult.getByTestId("answer-input-1");
    // Set the first answer to the empty string
    fireEvent.change(AnswerInputElement, { target: { value: "" } });

    // click save button which has "submit-question" test id
    await act(async () => {
      fireEvent.click(renderResult.getByTestId("submit-question"));
    });

    // ERROR_ANSWER_EMPTY error message should be visible
    expect(renderResult.getByText(ERROR_ANSWER_EMPTY)).toBeVisible();
  });

  it("If all answers are selected as 'correct', you should see the relevant error message.", async () => {
    await act(async () => {
      renderResult = render(<QuestionEditor />, { quiz: INITIAL_QUIZ_STATE });
    });

    // CheckBoxElement0 is already selected because it's correct answer
    const CheckBoxElement1 = renderResult.getByTestId("answer-check-1");
    const CheckBoxElement2 = renderResult.getByTestId("answer-check-2");
    const CheckBoxElement3 = renderResult.getByTestId("answer-check-3");
    // Check all incorrect answers to check ERROR_MUST_HAVE_INCORRECT error
    fireEvent.click(CheckBoxElement1);
    fireEvent.click(CheckBoxElement2);
    fireEvent.click(CheckBoxElement3);

    // click save button which has "submit-question" test id
    await act(async () => {
      fireEvent.click(renderResult.getByTestId("submit-question"));
    });

    // ERROR_MUST_HAVE_INCORRECT error message should be visible
    expect(renderResult.getByText(ERROR_MUST_HAVE_INCORRECT)).toBeVisible();
  });

  it("If all answers are selected as 'incorrect', you should see the relevant error message.", async () => {
    await act(async () => {
      renderResult = render(<QuestionEditor />, { quiz: INITIAL_QUIZ_STATE });
    });

    // Uncheck the first answer to get all answers as 'incorrect'
    const CheckBoxElement0 = renderResult.getByTestId("answer-check-0");
    fireEvent.click(CheckBoxElement0);

    // click save button which has "submit-question" test id
    await act(async () => {
      fireEvent.click(renderResult.getByTestId("submit-question"));
    });

    // ERROR_MUST_HAVE_CORRECT error message should be visible
    expect(renderResult.getByText(ERROR_MUST_HAVE_CORRECT)).toBeVisible();
  });
});
