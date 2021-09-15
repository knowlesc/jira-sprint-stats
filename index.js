const JiraClient = require("./lib/jiraClient");
const printSprintTable = require("./lib/printSprintTable");
require("dotenv").config();

const requiredVars = [
  "JIRA_BOARD_ID",
  "JIRA_USERNAME",
  "JIRA_API_TOKEN",
  "JIRA_BASE_URL",
];

const { JIRA_USERNAME, JIRA_API_TOKEN, JIRA_BASE_URL, JIRA_BOARD_ID } = process.env;

requiredVars.forEach((variable) => {
  if (typeof process.env[variable] !== "string") {
    throw new Error(`Environment variable missing: ${variable}`);
  }
});

jira = new JiraClient({
  userName: JIRA_USERNAME,
  apiKey: JIRA_API_TOKEN,
  baseUrl: JIRA_BASE_URL,
});

// Number between 1 and 5, default 1
const howMany = Math.max(1, Math.min(Number(process.argv[2]) || 1, 5));

printSprintTable(jira, JIRA_BOARD_ID, howMany);
