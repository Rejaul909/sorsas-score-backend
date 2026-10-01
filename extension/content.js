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
    "i",
    "login",
    "signup"
  ];

  if (blocked.includes(username.toLowerCase())) {
    return null;
  }

  return username;
}

function createBadge(score) {
  const badge = document.createElement("span");

  badge.className = "sorsa-score-badge";

  badge.innerHTML = `
    <span class="sorsa-score-icon">S</span>
    <span class="sorsa-score-number">${score.toLocaleString()}</span>
  `;

  badge.title = `Sorsa Score: ${score.toLocaleString()}`;

  return badge;
}

function addBadge(link, score) {
  if (link.querySelector(".sorsa-score-badge")) {
    return;
  }

  const badge = createBadge(score);

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

  links.forEach((link) => {
    processLink(link);
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
