const db = require("../connection.js");
const fs = require("fs");

exports.fetchEndpoints = () => {
  const rawData = fs.readFileSync("endpoints.json");
  const endpoints = JSON.parse(rawData);
  return endpoints;
};
