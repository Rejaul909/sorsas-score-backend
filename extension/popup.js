const scoreElement = document.getElementById("score");
const usernameElement = document.getElementById("username");
const statusElement = document.getElementById("status");
const refreshButton = document.getElementById("refresh");

function setStatus(message, type = "") {
  statusElement.textContent = message;

  statusElement.className = "status";

  if (type) {
    statusElement.classList.add(type);
  }
}

function extractUsername(url) {
  try {
    const parsed = new URL(url);

    if (!parsed.hostname.includes("x.com")) {
      return null;
    }

    const parts = parsed.pathname
      .split("/")
      .filter(Boolean);

    if (!parts.length) {
      return null;
    }

    const blocked = [
      "home",
      "explore",
      "notifications",
      "messages",
      "search",
      "settings",
      "compose",
      "i",
      "login",
      "signup"
    ];

    const username = parts[0];

    if (blocked.includes(username.toLowerCase())) {
      return null;
    }

    return username;

  } catch {
    return null;
  }
}

async function loadScore() {
  scoreElement.textContent = "—";

  setStatus("Checking profile…", "loading");

  refreshButton.disabled = true;

  try {
    const tabs = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tabs.length) {
      setStatus("No active tab found", "error");
      return;
    }

    const username = extractUsername(tabs[0].url);

    if (!username) {
      usernameElement.textContent = "Open an X profile first";
      setStatus("Open an X profile first");
      return;
    }

    usernameElement.textContent = `@${username}`;

    const score = await fetchScore(username);

    if (score === null) {
      scoreElement.textContent = "—";
      setStatus("Could not load score", "error");
      return;
    }

    scoreElement.textContent = score.toLocaleString();

    setStatus("Score updated", "success");

  } catch (error) {

    console.error(error);

    scoreElement.textContent = "—";

    setStatus("Something went wrong", "error");

  } finally {
    refreshButton.disabled = false;
  }
}

refreshButton.addEventListener("click", loadScore);

document.addEventListener("DOMContentLoaded", loadScore);
