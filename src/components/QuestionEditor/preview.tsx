import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { escapeHtml } from "../../utils/operations";
import "./index.scss";
import { Question } from "../../types/Question";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 800,
      height: "max-content",
      padding: 20,
    },
    title: {
      fontSize: 14,
    },
  })
);

interface PreviewProps {
  question: Question;
}

const QuestionPreview: React.FC<PreviewProps> = ({ question }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Question
        </Typography>
        <Typography variant="h6" component="h2">
          {escapeHtml(question.question)}
        </Typography>
      </CardContent>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Answers
        </Typography>
        <RadioGroup value="">
          {[...question.correct_answers, ...question.incorrect_answers].map((a: string) => (
            <FormControlLabel control={<Checkbox disabled name={a} />} label={a} key={a} />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default QuestionPreview;
