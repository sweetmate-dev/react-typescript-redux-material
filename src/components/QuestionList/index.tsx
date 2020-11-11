import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

import { getQuestions, deleteQuestion, selectQuestion } from "../../redux/actions/questions";
import { RootState } from "../../redux/rootReducer";
import { escapeHtml } from "../../utils/operations";
import { Question } from "../../types/Question";
var classNames = require("classnames");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionList: {
      padding: 12,
      display: "grid",
      gridTemplateRows: "80px auto",
      height: "100vh",
      "& h1": {
        color: "white",
      },
      "& .content": {
        overflowY: "scroll",
        padding: "0 10px 40px 0",
        "& .loading-container": {
          display: "flex",
          justifyContent: "center",
        },
        "& .question-item": {
          margin: "10px 0",
          width: "100%",
          backgroundColor: "white",
          borderRadius: 4,
          "&.selected": {
            backgroundColor: "lightblue",
          },
          " &.question": {
            fontWeight: "700",
          },
          "& .status-container": {
            marginTop: 20,
          },
          "& .difficulty": {
            display: "flex",
            alignItems: "center",
          },
        },
      },
    },
    paper: {
      textAlign: "center",
      display: "flex",
      justifyContent: "space-evenly",
      width: "100%",
      backgroundColor: "transparent",
    },
    questionDetails: {
      padding: theme.spacing(2),
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexGrow: 1,
    },
    buttons: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
      display: "flex",
      flexDirection: "column",
    },
    category: {
      border: "1px solid gray",
      borderRadius: 10,
      padding: "4px 10px",
    },
    deleteButton: {
      marginTop: theme.spacing(1),
    },
  })
);

function QuestionListView() {
  const classes = useStyles();
  const { questions, loading, selectedQuestion } = useSelector((state: RootState) => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    getMoreQuestions();
  }, []);

  const getMoreQuestions = () => {
    // fetch more questions after clicking "Load More Questions' button
    dispatch(getQuestions());
  };

  const onDeleteQuestion = (index) => {
    // delete a question using the index
    dispatch(deleteQuestion(index));
    // If you delete the editing question, editor view should be empty.
    if (questions[index].question === selectedQuestion.question) {
      dispatch(selectQuestion({}));
    }
  };

  const editQuestion = (e, question) => {
    e.stopPropagation();
    // select question to edit
    dispatch(selectQuestion(question));
  };

  return (
    <div className={classes.questionList}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <h1>Questions</h1>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => getMoreQuestions()}>
            Load More Questions
          </Button>
        </Grid>
      </Grid>
      <div className="content">
        {loading && (
          <div className="loading-container">
            <CircularProgress />
          </div>
        )}
        {questions.map((question: Question, index) => (
          <div
            key={index}
            className={classNames("question-item", { selected: question.question === selectedQuestion.question })}
          >
            <Paper className={classes.paper}>
              <Box className={classes.questionDetails}>
                <Box component="span" className="question">
                  {/* Remove unicoded strings */}
                  {escapeHtml(question.question)}
                </Box>
                <Grid container justify="space-between" className="status-container">
                  <Grid item>
                    <Box className={classes.category}>{question.category}</Box>
                  </Grid>
                  <Grid item>
                    <Box component="span" className="difficulty">
                      <ArrowUpwardIcon />
                      {question.difficulty}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.buttons}>
                <Button variant="contained" color="primary" onClick={(e) => editQuestion(e, question)}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onDeleteQuestion(index)}
                  className={classes.deleteButton}
                >
                  Delete{" "}
                </Button>
              </Box>
            </Paper>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionListView;
