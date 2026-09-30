const API_URL = "https://sorsas-score-backend.vercel.app";

async function getSorsaScore(username) {
  try {
    const response = await fetch(
      `${API_URL}?username=${encodeURIComponent(username)}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (typeof data.score !== "number") {
      throw new Error("Invalid score received");
    }

    return data.score;
  } catch (error) {
    console.error("Sorsa Score:", error);
    return null;
  }
}

function formatScore(score) {
  return Math.round(score).toLocaleString();
}

function createScoreBadge(score) {
  const badge = document.createElement("span");

  badge.className = "sorsa-score-badge";
  badge.textContent = `S ${formatScore(score)}`;
  badge.title = `Sorsa Score: ${formatScore(score)}`;

  return badge;
}

function addScoreToProfile(usernameElement) {
  if (usernameElement.querySelector(".sorsa-score-badge")) {
    return;
  }

  const username = usernameElement.textContent.trim().replace("@", "");

  if (!username) return;

  getSorsaScore(username).then((score) => {
    if (score === null) return;

    if (usernameElement.querySelector(".sorsa-score-badge")) {
      return;
    }

    const badge = createScoreBadge(score);
    usernameElement.appendChild(badge);
  });
}

function scanPage() {
  const elements = document.querySelectorAll(
    'a[href^="/"][role="link"], a[href^="/"][data-testid="UserName"]'
  );

  elements.forEach((element) => {
    const text = element.textContent.trim();

    if (text.startsWith("@")) {
      addScoreToProfile(element);
    }
  });
}

scanPage();

const observer = new MutationObserver(() => {
  scanPage();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
