import React from "react";
import { render } from "@testing-library/react";
import "mutationobserver-shim";
import App from "./App";

test("have 2 section views", () => {
  const { getByTestId } = render(<App />);
  const QuestionEditorElement = getByTestId("question-editor");
  expect(QuestionEditorElement).toBeInTheDocument();
  const QuestionListElement = getByTestId("question-list");
  expect(QuestionListElement).toBeInTheDocument();
});
