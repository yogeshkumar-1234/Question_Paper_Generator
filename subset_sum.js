function generateSubsets(nums, target) {
  function generateSubsetsHelper(index, currentSubset, currentSum) {
    // Base case: print the current subset if the sum is within the target
    if (currentSum == target) {
      console.log(currentSubset);
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
        )
      )
        return true;

      // Exclude the current element from the subset
      if (generateSubsetsHelper(i + 1, currentSubset, currentSum)) return true;
    }
  }

  generateSubsetsHelper(0, [], 0);
}

// Example usage:
const nums = [
  { question: "1", marks: 1 },
  { question: "2", marks: 3 },
  { question: "3", marks: 3 },
];
const targetSum = 4;

console.log(`Subsets with sum less than or equal to ${targetSum}:`);
generateSubsets(nums, targetSum);
