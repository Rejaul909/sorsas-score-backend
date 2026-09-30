export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      error: "Username is required"
    });
  }

  try {
    const response = await fetch(
      `https://api.sorsa.io/v3/score?username=${encodeURIComponent(username)}`,
      {
        headers: {
          ApiKey: process.env.SORSA_API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("Sorsa API Error:", error);

    return res.status(500).json({
      error: "Failed to fetch Sorsa score"
    });
  }
}
