const fs = require("fs");
const path = require("path");

function getConfig() {
  const configPath = path.join(__dirname, "../../config/settings.js");
  return require(configPath);
}

function createProfileFolder(profileName) {
  const profilePath = path.join(__dirname, "../../profiles", profileName);
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath);
  }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms)); 
}

module.exports = { getConfig, createProfileFolder, sleep };
