function cleanText(value) {
    if (!value) {
        return "";
    }

    return String(value)
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();
}

export default async function handler(req, res) {
    try {
        const apiKey =
            process.env.NASA_API_KEY || "DEMO_KEY";

        const response = await fetch(
            `https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(
                `NASA API error: ${response.status}`
            );
        }

        const data = await response.json();

        const apod = Array.isArray(data)
            ? data[0]
            : data;

        if (!apod) {
            throw new Error(
                "Nenhum APOD foi retornado pela NASA."
            );
        }

        const credit = cleanText(
            apod.credit ||
            apod.copyright ||
            "NASA"
        );

        const explanation = cleanText(
            apod.explanation ||
            "A NASA não forneceu uma descrição para esta publicação."
        );

        return res.status(200).json({
            success: true,

            data: {
                ...apod,

                credit,
                explanation
            }
        });

    } catch (error) {
        console.error(
            "Erro na API APOD:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Não foi possível carregar a imagem da NASA."
        });
    }
}