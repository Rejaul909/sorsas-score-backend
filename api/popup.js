const API_URL = "https://sorsas-score-backend.vercel.app";

const scoreElement = document.getElementById("score");
const statusElement = document.getElementById("status");
const refreshButton = document.getElementById("refresh");

function getUsernameFromX() {
  const url = window.location.href;

  const match = url.match(
    /(?:x\.com|twitter\.com)\/([^/?#]+)/
  );

  if (!match) {
    return null;
  }

  const username = match[1];

  const blocked = [
    "home",
    "explore",
    "notifications",
    "messages",
    "search",
    "settings",
    "i",
    "compose"
  ];

  if (blocked.includes(username.toLowerCase())) {
    return null;
  }

  return username.replace(/^@/, "");
}

async function loadScore() {
  scoreElement.textContent = "Loading...";
  statusElement.textContent = "";

  const username = getUsernameFromX();

  if (!username) {
    scoreElement.textContent = "—";
    statusElement.textContent = "Open an X profile first";
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/score?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) {
      throw new Error("Score request failed");
    }

    const data = await response.json();

    if (typeof data.score !== "number") {
      throw new Error("Invalid score received");
    }

    scoreElement.textContent =
      Math.round(data.score).toLocaleString();

    statusElement.textContent = `@${username}`;

  } catch (error) {
    console.error("Sorsa Score error:", error);

    scoreElement.textContent = "—";
    statusElement.textContent = "Score unavailable";
  }
}

refreshButton.addEventListener("click", loadScore);

loadScore();
