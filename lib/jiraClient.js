const { default: fetch } = require("node-fetch");

class JiraClient {
  constructor({ userName, apiKey, baseUrl }) {
    this.credentials = Buffer.from(`${userName}:${apiKey}`).toString("base64");
    this.baseUrl = baseUrl;
  }

  getSprints(rapidViewId) {
    const url = `rest/greenhopper/1.0/sprintquery/${rapidViewId}?includeFutureSprints=false`;
    return this.getJson(url);
  }

  getSprintReport(rapidViewId, sprintId) {
    const url = `rest/greenhopper/latest/rapid/charts/sprintreport?rapidViewId=${rapidViewId}&sprintId=${sprintId}`;
    return this.getJson(url);
  }

  async getJson(url) {
    try {
      const result = await fetch(`${this.baseUrl}/${url}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${this.credentials}`,
        },
      });

      return (await result.json());
    } catch (e) {
      console.log(`Error (URL: ${url})`);
      console.error(e);
      throw e;
    }
  }
}

module.exports = JiraClient;