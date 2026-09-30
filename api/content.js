const API_URL = "https://sorsas-score-backend.vercel.app";

const scoreCache = new Map();

function getUsernameFromLink(link) {
  const href = link.getAttribute("href");

  if (!href) return null;

  const match = href.match(/^\/([^/?#]+)\/?$/);

  if (!match) return null;

  const username = match[1];

  const blocked = [
    "home",
    "explore",
    "notifications",
    "messages",
    "search",
    "settings",
    "compose",
    "i"
  ];

  if (blocked.includes(username.toLowerCase())) {
    return null;
  }

  return username;
}

async function fetchScore(username) {
  if (scoreCache.has(username)) {
    return scoreCache.get(username);
  }

  try {
    const response = await fetch(
      `${API_URL}/api/score?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (typeof data.score !== "number") {
      return null;
    }

    const score = Math.round(data.score);

    scoreCache.set(username, score);

    return score;
  } catch (error) {
    console.error("Sorsa Score:", error);
    return null;
  }
}

function addBadge(link, score) {
  if (link.querySelector(".sorsa-score-badge")) {
    return;
  }

  const badge = document.createElement("span");

  badge.className = "sorsa-score-badge";
  badge.textContent = `S ${score.toLocaleString()}`;
  badge.title = `Sorsa Score: ${score.toLocaleString()}`;

  link.appendChild(badge);
}

async function processLink(link) {
  if (link.dataset.sorsaChecked === "true") {
    return;
  }

  const username = getUsernameFromLink(link);

  if (!username) return;

  link.dataset.sorsaChecked = "true";

  const score = await fetchScore(username);

  if (score === null) return;

  addBadge(link, score);
}

function scanPage() {
  const links = document.querySelectorAll(
    'a[href^="/"][role="link"]'
  );

  links.forEach(processLink);
}

scanPage();

const observer = new MutationObserver(() => {
  scanPage();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
