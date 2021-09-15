# Jira Stats

This is a super simple project that will print a tabular summary of issues in a Jira sprint, and sum up some useful metrics (Points committed, done, carried over, added, and removed).

## Config

1. `npm install`
2. `npm setup`
3. Fill out `.env` with the correct JIRA values: API key, username, URL, and board id are needed

## Usage

`npm start`

To print multiple sprints, use `npm start -- 3` (maximum 5)