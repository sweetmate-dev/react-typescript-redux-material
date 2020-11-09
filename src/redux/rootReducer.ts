import { createStore, combineReducers, applyMiddleware } from "redux";

import createSagaMiddleware from "redux-saga";
import { questionReducer } from "./reducers/questions";

import rootSaga from "./sagas/_rootSaga";

export const overallReducer = combineReducers({
  quiz: questionReducer,
});

// Sage Middleware is used for fetching external resources.
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(overallReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof overallReducer>;
