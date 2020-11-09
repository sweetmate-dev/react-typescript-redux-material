import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { useForm } from "react-hook-form";
import AddIcon from "@material-ui/icons/Add";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { toast } from "react-toastify";
import { updateSelectedQuestion } from "../../redux/actions/questions";
import { RootState } from "../../redux/rootReducer";
import "./index.scss";
import { Question } from "../../types/Question";
import QuestionPreview from "./preview";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      marginTop: 12,
      padding: "0 10px 40px 0",
    },
    root: {
      width: "100%",
      height: "max-content",
      padding: 20,
    },
    inputBox: {
      height: 30,
      flex: 1,
      padding: "0 10px",
    },
    title: {
      fontSize: 14,
    },
    previewModal: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      overflow: "scroll",
    },
  })
);

export const ERROR_MUST_HAVE_CORRECT = "At least one answer must be correct";
export const ERROR_MUST_HAVE_INCORRECT = "At least one answer must be incorrect";
export const ERROR_ANSWER_EMPTY = "Answers can't be an empty string";
export const ERROR_QUESTION_EMPTY = "The question can't be an empty string";

function QuestionEditView() {
  const classes = useStyles();
  const [visiblePreviewModal, openPreviewModal] = useState<boolean>(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [tempQuestion, setTempQuestion] = useState<Question>({} as Question);
  const { register, handleSubmit, errors } = useForm();
  const { selectedQuestion } = useSelector((state: RootState) => state.quiz);
  const dispatch = useDispatch();

  useEffect(() => {
    setTempQuestion(selectedQuestion);
    setAnswers([...(selectedQuestion.correct_answers || []), ...(selectedQuestion.incorrect_answers || [])]);
  }, [selectedQuestion]);

  const onPressNewQuestion = () => {
    setAnswers([...answers, ""]);
  };

  const validateForm = () => {
    if (Object.keys(errors).length > 0) return false;
    if (error.length > 0) return false;
    return true;
  };

  const isChecked = (checked) => {
    if (typeof checked === "boolean") return checked;
    else return checked.length > 0;
  };

  const onSubmit = (preview: boolean = false) => (data) => {
    if (Object.keys(errors).length > 0) return;
    //validate check status
    let hasTrueValue: boolean = false;
    let hasFalseValue: boolean = false;
    const incorrect_answers: string[] = [];
    const correct_answers: string[] = [];
    Object.keys(data).map((key) => {
      if (key.includes("checkbox-") && isChecked(data[key])) {
        hasTrueValue = true;
        correct_answers.push(data[key.replace(/checkbox/, "question")]);
      }
      if (key.includes("checkbox-") && !isChecked(data[key])) {
        hasFalseValue = true;
        incorrect_answers.push(data[key.replace(/checkbox/, "question")]);
      }
      return true;
    });
    if (!hasTrueValue) {
      setError(ERROR_MUST_HAVE_CORRECT);
      return;
    } else if (!hasFalseValue) {
      setError(ERROR_MUST_HAVE_INCORRECT);
      return;
    } else {
      setError("");
    }
    //
    if (preview) openPreviewModal(true);
    else {
      tempQuestion.correct_answers = correct_answers;
      tempQuestion.incorrect_answers = incorrect_answers;
      dispatch(updateSelectedQuestion(tempQuestion));
      toast.success("Saved successfully!");
    }
  };

  return (
    <div className="question-edit">
      <Grid container justify="space-between" alignItems="center" className="header" data-testid="editor-title">
        <Grid item>
          <h1>Editor</h1>
        </Grid>
      </Grid>
      {tempQuestion.question && (
        <Grid container className={classes.content} key={tempQuestion.question}>
          <Card className={classes.root}>
            <form>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Question
                </Typography>
                <Grid container>
                  <input
                    name="question"
                    ref={register({ required: true })}
                    className={classes.inputBox}
                    defaultValue={tempQuestion.question}
                    data-testid="question-input"
                  />
                </Grid>
              </CardContent>
              <CardContent>
                <Grid container justify="space-between">
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Answers
                  </Typography>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    IsCorrect
                  </Typography>
                </Grid>
                {answers.map((answer: string, index) => (
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className="question-edit-item"
                    key={index}
                  >
                    <input
                      name={`question-${index}`}
                      ref={register({ required: true })}
                      defaultValue={answer}
                      className={classes.inputBox}
                      data-testid={`answer-input-${index}`}
                    />
                    <input
                      type="checkbox"
                      name={`checkbox-${index}`}
                      ref={register}
                      defaultChecked={tempQuestion.correct_answers.includes(answer)}
                      className="checkbox"
                      data-testid={`answer-check-${index}`}
                    />
                  </Grid>
                ))}
                <div className="error-view">
                  {Object.keys(errors).map((key: string) => {
                    if (key === "question")
                      return (
                        <p key={key} data-testid="question-empty-error">
                          {ERROR_QUESTION_EMPTY}
                        </p>
                      );
                    else if (key.includes("question-"))
                      return (
                        <p key={key} data-testid="answer-empty-error">
                          {ERROR_ANSWER_EMPTY}
                        </p>
                      );
                    return null;
                  })}
                  {error.length > 0 && <p>{error}</p>}
                </div>
              </CardContent>
              <CardActions>
                <Grid container justify="space-between" alignItems="center" spacing={3}>
                  <div style={{ flex: 1, marginLeft: 10 }}>
                    <Button size="small" onClick={onPressNewQuestion}>
                      <AddIcon />
                      Add new question
                    </Button>
                  </div>
                  <Grid item>
                    <Button size="small" onClick={handleSubmit(onSubmit(true))}>
                      Preview
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      color="primary"
                      variant="contained"
                      onClick={handleSubmit(onSubmit(false))}
                      data-testid="submit-question"
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </form>
          </Card>
        </Grid>
      )}
      {validateForm() && (
        <Modal open={visiblePreviewModal} onClose={() => openPreviewModal(false)} className={classes.previewModal}>
          <div className="question-edit-preview">
            <QuestionPreview question={tempQuestion} />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default QuestionEditView;
