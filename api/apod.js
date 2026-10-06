export default async function handler(req, res) {
  try {
    const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";

    const response = await fetch(
      `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    const apod = Array.isArray(data) ? data[0] : data;

    return res.status(200).json({
      success: true,
      data: apod
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Não foi possível carregar a imagem da NASA."
    });
  }
}