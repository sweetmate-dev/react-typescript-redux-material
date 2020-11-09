import React from "react";
import "./App.scss";
import { Provider } from "react-redux";
import { store } from "./redux/rootReducer";
import { Grid } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionsList from "./components/QuestionList";
import QuestionEditor from "./components/QuestionEditor";
import { colors } from "./theme/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100vh",
      [theme.breakpoints.down("md")]: {
        overflow: "scroll",
      },
    },
    editor: {
      borderRight: `2px solid ${colors.gray}`,
      overflowY: "scroll",
      backgroundColor: colors.background,
    },
    list: {
      overflowY: "scroll",
      backgroundColor: colors.background,
    },
  })
);

function App() {
  const classes = useStyles();
  return (
    <Provider store={store}>
      <Grid container spacing={1} className={classes.container}>
        <Grid item xs={12} md={7} className={classes.editor} data-testid="question-editor">
          <QuestionEditor />
        </Grid>
        <Grid item xs={12} md={5} className={classes.list} data-testid="question-list">
          <QuestionsList />
        </Grid>
      </Grid>
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

export default App;
