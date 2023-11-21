import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// In-memory Question Store
let questionStore;
const easy_map = [];
const medium_map = [];
const hard_map = [];
var topic_list = {};

const populate_the_topic_list = () => {
  for (let i = 0; i < 10; i++) {
    topic_list["Topic " + i] = [];
  }
};
const divide_the_questions = (question_store) => {
  populate_the_topic_list();
  for (let i = 0; i < questionStore.length; i++) {
    topic_list[questionStore[i].topic].push(questionStore[i]);
    if (questionStore[i].difficulty == "easy") easy_map.push(questionStore[i]);
    else if (questionStore[i].difficulty == "medium")
      medium_map.push(questionStore[i]);
    else hard_map.push(questionStore[i]);
  }
};

// Reading the json File
fs.readFile("questions.json", function (err, data) {
  if (err) throw err;
  const q = JSON.parse(data);
  questionStore = q;
  divide_the_questions(questionStore);
});

// CRUD operations for Question Store
// Getting all the questions in the store
app.get("/questions", (req, res) => {
  res.json(questionStore);
});

// Finding a subset of questions with the given marks value
function generateSubsets(nums, target) {
  let question_set = [];
  // question_store will be made such that we can find subset for any standard number there

  function generateSubsetsHelper(index, currentSubset, currentSum) {
    // Base case: print the current subset if the sum is within the target
    if (currentSum == target) {
      question_set = currentSubset;
      return true;
    }

    // Recursive case: iterate over remaining elements
    for (let i = index; i < nums.length; i++) {
      // Include the current element in the subset
      if (
        generateSubsetsHelper(
          i + 1,
          [...currentSubset, nums[i]],
          currentSum + nums[i].marks
        ) == true
      )
        return true;

      // Exclude the current element from the subset
      if (generateSubsetsHelper(i + 1, currentSubset, currentSum) == true)
        return true;
    }
  }

  generateSubsetsHelper(0, [], 0);

  return question_set;
}

// Question Paper Generator with easy medium and hard
app.get("/get_question_paper_difficultyWise", (req, res) => {
  const totalMarks = req.query.marks;
  const easy = req.query.easy;
  const medium = req.query.medium;
  let generatedPaper = [];

  // Calculate the number of questions for each difficulty based on the specified percentage
  let easyCount = Math.round(totalMarks * (easy / 100));
  let mediumCount = Math.round(totalMarks * (medium / 100));
  let hardCount = totalMarks - easyCount - mediumCount;
  console.log(easyCount, mediumCount, hardCount);
  // Helper function to select a question of the given difficulty

  const result1 = generateSubsets(easy_map, easyCount);
  const result2 = generateSubsets(medium_map, mediumCount);
  const result3 = generateSubsets(hard_map, hardCount);

  generatedPaper.push(result1);
  generatedPaper.push(result2);
  generatedPaper.push(result3);
  res.json(generatedPaper);
});

// Question Paper Generator Topic wise currently supporting three topics
app.get("/get_question_paper_TopicWise", (req, res) => {
  const totalMarks = req.query.marks;
  const topic_1 = req.query.t1;
  const topic_2 = req.query.t2;
  let generatedPaper = [];
  // Calculate the number of questions for each difficulty based on the specified percentage
  let t1_c = Math.round(totalMarks * (topic_1 / 100));
  let t2_c = Math.round(totalMarks * (topic_2 / 100));
  let t3_c = totalMarks - t1_c - t2_c;
  var dict = [];
  dict.push(t1_c);
  dict.push(t2_c);
  dict.push(t3_c);
  console.log(dict);
  // Helper function to select a question of the given difficulty
  for (let i = 1; i <= 3; i++) {
    // console.log(topic_list["Topic " + i]);
    // const r = generateSubsets(topic_list["Topic " + i], dict[i - 1]);
    // console.log(r);
    generatedPaper.push(generateSubsets(topic_list["Topic " + i], dict[i]));
  }
  res.json(generatedPaper);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
