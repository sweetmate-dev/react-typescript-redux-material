import React from "react";
import { Provider } from "react-redux";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { createStore } from "redux";
import { overallReducer } from "../redux/rootReducer";
import { QuizState } from "../redux/reducers/questions";

export interface RootStateValue {
  quiz: QuizState;
}

const render = (ui: React.ReactElement, initialState?: RootStateValue, renderOptions?: RenderOptions) => {
  const store = createStore(overallReducer, initialState);
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper as React.ComponentType, ...renderOptions });
};

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
