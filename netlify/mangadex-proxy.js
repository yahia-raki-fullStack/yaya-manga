// mangadex-proxy.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const apiUrl = "https://api.mangadex.org" + event.path;
  const response = await fetch(apiUrl, {
    method: event.httpMethod,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  return {
    statusCode: response.status,
    body: JSON.stringify(data),
  };
};
