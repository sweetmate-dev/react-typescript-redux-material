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
import DeleteIcon from "@material-ui/icons/Delete";
import Modal from "@material-ui/core/Modal";
import { toast } from "react-toastify";
import { updateSelectedQuestion } from "../../redux/actions/questions";
import { RootState } from "../../redux/rootReducer";
import { Question } from "../../types/Question";
import QuestionPreview from "./preview";
import { escapeHtml } from "utils/operations";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    questionEdit: {
      padding: 12,
      height: "100vh",
      display: "grid",
      gridTemplateRows: "80px auto",
      "& h1": {
        color: "white",
      },
      "& .question-edit-item": {
        width: "100%",
        marginTop: 8,
        "& .checkbox": {
          width: 24,
          height: 24,
          marginLeft: 15,
        },
      },
      "& .error-view": {
        color: "red",
        fontSize: 14,
      },
    },
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
    deleteIcon: {
      padding: theme.spacing(1),
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
    // reset temporary question object and answers array whenever you change the question on the right side
    setTempQuestion(selectedQuestion);
    setAnswers([...(selectedQuestion.correct_answers || []), ...(selectedQuestion.incorrect_answers || [])]);
  }, [selectedQuestion]);

  const onPressNewQuestion = () => {
    // add empty answer after clicking "Add New Question" button
    setAnswers([...answers, ""]);
  };

  const validateForm = () => {
    if (Object.keys(errors).length > 0) return false;
    if (error.length > 0) return false;
    return true;
  };

  const isChecked = (checked) => {
    // checked value can be true/false or ["on"]/[]
    if (typeof checked === "boolean") return checked;
    else return checked.length > 0;
  };

  const onDeleteAnswer = (index) => () => {
    answers.splice(index, 1);
    setAnswers([...answers]);
  };

  const onSubmit = (preview: boolean = false) => (data) => {
    /* data is just the form data which is available only if you submitted
    For example, if question has 1 correct answer and 3 incorrect answers.
    {
      question: string,
      answer-0: string,
      answer-1: string,
      answer-2: string,
      answer-3: string,
      check-0: true,
      check-1: false,
      check-2: false,
      check-3: false,
    }
    */
    if (Object.keys(errors).length > 0) return;
    //validate check status, combine correct/incorrect answers
    let hasTrueValue: boolean = false;
    let hasFalseValue: boolean = false;
    const incorrect_answers: string[] = [];
    const correct_answers: string[] = [];
    for (let index = 0; index < answers.length; index++) {
      if (isChecked(data[`checkbox-${index}`])) {
        hasTrueValue = true;
        correct_answers.push(data[`answer-${index}`]);
      }
      if (!isChecked(data[`checkbox-${index}`])) {
        hasFalseValue = true;
        incorrect_answers.push(data[`answer-${index}`]);
      }
    }
    // show errors
    if (!hasTrueValue) {
      setError(ERROR_MUST_HAVE_CORRECT);
      return;
    } else if (!hasFalseValue) {
      setError(ERROR_MUST_HAVE_INCORRECT);
      return;
    } else {
      setError("");
    }
    // everything is validate
    if (preview) {
      // if you clicked preview button, show preview modal only
      openPreviewModal(true);
    } else {
      // if you clicked save button, save the updated temporary question to redux
      tempQuestion.correct_answers = correct_answers;
      tempQuestion.incorrect_answers = incorrect_answers;
      tempQuestion.question = data.question;
      setAnswers([...correct_answers, ...incorrect_answers]);
      dispatch(updateSelectedQuestion(tempQuestion));
      toast.success("Saved successfully!");
    }
  };
  return (
    <div className={classes.questionEdit}>
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
                    defaultValue={escapeHtml(tempQuestion.question)}
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
                    key={`answer-${answer}-${index}`}
                  >
                    <input
                      name={`answer-${index}`}
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
                    <Button size="small" className={classes.deleteIcon} onClick={onDeleteAnswer(index)}>
                      <DeleteIcon />
                    </Button>
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
                    else if (key.includes("answer-"))
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
