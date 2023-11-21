import fs from "fs";
import random from "random";
// Function to generate the question paper randomly
// Function to generate a random question
const generateQuestionPaper = (numQuestionsPerDifficulty) => {
  const questionPaper = [];

  const difficulties = ["easy", "medium", "hard"];

  for (const difficulty of difficulties) {
    for (let i = 0; i < numQuestionsPerDifficulty; i++) {
      const question = `Q${i + 1} - ${difficulty} question`;
      const subject = `Subject ${i + 1}`;
      const topic = `Topic ${random.int(1, 5)}`;
      let marks = 0;

      switch (difficulty) {
        case "easy":
          marks = random.int(1, 3);
          break;
        case "medium":
          marks = random.int(4, 6);
          break;
        case "hard":
          marks = random.int(7, 10);
          break;
      }

      const questionData = {
        question: question,
        subject: subject,
        topic: topic,
        difficulty: difficulty,
        marks: marks,
      };

      questionPaper.push(questionData);
    }
  }

  return questionPaper;
};

const questions = generateQuestionPaper(15);
function printQuestionPaper(questionPaper) {
  for (const questionData of questionPaper) {
    console.log(`Question: ${questionData.question}`);
    console.log(`Subject: ${questionData.subject}`);
    console.log(`Topic: ${questionData.topic}`);
    console.log(`Difficulty: ${questionData.difficulty}`);
    console.log(`Marks: ${questionData.marks}`);
    console.log("\n");
  }
}

// Convert questions array to JSON string
const jsonContent = JSON.stringify(questions, null, 2);

// Write JSON content to a file
fs.writeFile("q.json", jsonContent, "utf8", (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
  } else {
    console.log(
      "JSON file with questions has been generated successfully: questions.json"
    );
  }
});
