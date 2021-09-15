const getBooleanDisplayValue = (bool) => (bool ? "YES" : undefined);
const getSum = (sum, issue) => sum + Number(issue.estimate ?? 0);
const includeInSums = (issue) => !["Spike", "Experiment"].includes(issue.type);

const printSprintTable = async (jira, rapidViewId, howMany = 1) => {
  const { sprints } = await jira.getSprints(rapidViewId);
  const latestSprints =
    sprints.slice(sprints.length - howMany, sprints.length);

  for (const sprint of latestSprints) {
    const { id: sprintId, name: sprintName } = sprint;
    const { contents } = await jira.getSprintReport(rapidViewId, sprintId);
    const {
      completedIssues,
      issueKeysAddedDuringSprint,
      issuesNotCompletedInCurrentSprint,
      puntedIssues,
    } = contents;

    const getUsefulData = ({
      key,
      typeName,
      summary,
      statusName,
      estimateStatistic,
    }) => ({
      type: typeName,
      key,
      summary,
      status: statusName,
      estimate: estimateStatistic?.statFieldValue?.value ?? 0,
      added: getBooleanDisplayValue(!!issueKeysAddedDuringSprint[key]),
      done: getBooleanDisplayValue(completedIssues.some((i) => key === i.key)),
      carriedOver: getBooleanDisplayValue(
        issuesNotCompletedInCurrentSprint.some((i) => key === i.key)
      ),
      removed: getBooleanDisplayValue(puntedIssues.some((i) => key === i.key)),
    });

    const allIssues = completedIssues
      .concat(issuesNotCompletedInCurrentSprint)
      .concat(puntedIssues)
      .map(getUsefulData);

    console.log(sprintName);
    console.log(
      sprintName
        .split("")
        .map(() => "-")
        .join("")
    );
    console.table(allIssues);

    const summableIssues = allIssues.filter(includeInSums);

    const carriedOverIssues = summableIssues.filter((i) => i.carriedOver);
    const addedIssues = summableIssues.filter((i) => i.added);
    const doneIssues = summableIssues.filter((i) => i.done);
    const removedIssues = summableIssues.filter((i) => i.removed);
    const committedIssues = summableIssues.filter((i) => !i.added);

    console.log("Committed: ", committedIssues.reduce(getSum, 0));
    console.log("Done: ", doneIssues.reduce(getSum, 0));
    console.log("Carry Over: ", carriedOverIssues.reduce(getSum, 0));
    console.log("Added: ", addedIssues.reduce(getSum, 0));
    console.log("Removed: ", removedIssues.reduce(getSum, 0));
    console.log("\n");
  }
};

module.exports = printSprintTable;
