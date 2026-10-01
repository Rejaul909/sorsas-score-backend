const API_URL = "https://sorsas-score-backend.vercel.app";

const scoreCache = new Map();

async function fetchScore(username) {
  if (!username) return null;

  const cleanUsername = username.replace(/^@/, "").trim();

  if (!cleanUsername) return null;

  if (scoreCache.has(cleanUsername)) {
    return scoreCache.get(cleanUsername);
  }

  try {
    const response = await fetch(
      `${API_URL}/api/score?username=${encodeURIComponent(cleanUsername)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!response.ok) {
      console.error("Sorsa API error:", response.status);
      return null;
    }

    const data = await response.json();

    if (typeof data.score !== "number") {
      return null;
    }

    const score = Math.round(data.score);

    scoreCache.set(cleanUsername, score);

    return score;
  } catch (error) {
    console.error("Sorsa Score fetch error:", error);
    return null;
  }
}
