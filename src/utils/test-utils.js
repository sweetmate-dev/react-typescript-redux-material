import React from "react";
import { Provider } from "react-redux";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { createStore } from "redux";
import { overallReducer } from "../redux/rootReducer";

const render = (ui, { initialState = {}, ...renderOptions } = {}) => {
  const store = createStore(overallReducer, initialState);
  const Wrapper = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
