import React from "react";
import { Provider } from "react-redux";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
import { createStore } from "redux";
import { overallReducer, RootState } from "../redux/rootReducer";

const render = (ui: React.ReactElement, initialState?: RootState, renderOptions?: RenderOptions) => {
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
