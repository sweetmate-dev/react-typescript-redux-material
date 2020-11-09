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
import "./index.scss";
import { Question } from "../../types/Question";
var classNames = require("classnames");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
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
    dispatch(getQuestions());
  };

  const onDeleteQuestion = (index) => {
    dispatch(deleteQuestion(index));
    // if you deleted selected question in list view, editor view should be empty
    if (questions[index].question === selectedQuestion.question) {
      dispatch(selectQuestion({}));
    }
  };

  const editQuestion = (e, question, index) => {
    // TODO
    e.stopPropagation();
    dispatch(selectQuestion(question));
  };

  return (
    <div className="question-list">
      <Grid container justify="space-between" alignItems="center" className="header">
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
                <Button variant="contained" color="primary" onClick={(e) => editQuestion(e, question, index)}>
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
