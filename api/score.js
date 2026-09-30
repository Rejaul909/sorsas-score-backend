export default async function handler(req, res) {
  const username = req.query.username;

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
    return res.status(500).json({
      error: "Failed to fetch Sorsa score"
    });
  }
}
