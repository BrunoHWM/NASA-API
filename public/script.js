const titleElement =
    document.getElementById("title");

const dateElement =
    document.getElementById("apodDate");

const currentDateElement =
    document.getElementById("currentDate");

const descriptionElement =
    document.getElementById("shortDescription");

const explanationElement =
    document.getElementById("explanation");

const imageElement =
    document.getElementById("apodImage");

const creditElement =
    document.getElementById("credit");

const infoDateElement =
    document.getElementById("infoDate");

const infoCreditElement =
    document.getElementById("infoCredit");

const originalLink =
    document.getElementById("originalLink");

const loader =
    document.getElementById("loader");

const mediaNotice =
    document.getElementById("mediaNotice");

const errorElement =
    document.getElementById("error");

const quoteElement =
    document.getElementById("quote");

const scrollButton =
    document.getElementById("scrollButton");


/* =========================================================
   DATA
   ========================================================= */

function formatDate(dateString) {
    if (!dateString) {
        return "--";
    }

    const date =
        new Date(`${dateString}T12:00:00`);

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(date);
}


function formatToday() {
    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(new Date());
}


/* =========================================================
   TEXTO
   ========================================================= */

function cleanHTML(html) {
    if (!html) {
        return "";
    }

    const parser =
        new DOMParser();

    const document =
        parser.parseFromString(
            html,
            "text/html"
        );

    return (
        document.body.textContent || ""
    )
        .replace(/\s+/g, " ")
        .trim();
}


function createQuote() {
    const quotes = [
        "O universo continua escrevendo histórias que ainda estamos aprendendo a ler.",

        "Cada imagem do cosmos é um lembrete de que ainda há muito para descobrir.",

        "Olhar para o espaço é olhar para bilhões de anos de história.",

        "Somos pequenos diante do universo, mas temos a capacidade de explorá-lo.",

        "Todos os dias o universo revela um novo detalhe de sua imensidão.",

        "Existe um universo inteiro esperando para ser descoberto."
    ];

    const randomIndex =
        Math.floor(
            Math.random() *
            quotes.length
        );

    return quotes[randomIndex];
}


/* =========================================================
   ESTADO
   ========================================================= */

function setLoading(isLoading) {
    loader.hidden = !isLoading;
}


function showError() {
    setLoading(false);

    errorElement.hidden = false;
}


function hideError() {
    errorElement.hidden = true;
}


/* =========================================================
   CARREGAR APOD
   ========================================================= */

async function loadAPOD() {

    try {

        hideError();

        setLoading(true);

        mediaNotice.hidden = true;

        imageElement.classList.remove(
            "loaded"
        );

        imageElement.removeAttribute(
            "src"
        );


        /* -----------------------------------------------
           BUSCAR API
        ------------------------------------------------ */

        const response =
            await fetch(
                "/api/apod",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {
            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }


        const result =
            await response.json();


        if (!result.success) {
            throw new Error(
                result.message ||
                "Erro desconhecido."
            );
        }


        const data =
            result.data;


        /* -----------------------------------------------
           TÍTULO
        ------------------------------------------------ */

        titleElement.textContent =
            data.title ||
            "Imagem do dia";


        /* -----------------------------------------------
           DATA
        ------------------------------------------------ */

        if (data.date) {

            const formattedDate =
                formatDate(data.date);

            dateElement.textContent =
                formattedDate;

            infoDateElement.textContent =
                formattedDate;
        }


        /* -----------------------------------------------
           DESCRIÇÃO
        ------------------------------------------------ */

        const explanation =
            cleanHTML(
                data.explanation ||
                "A NASA não forneceu uma descrição para esta publicação."
            );


        explanationElement.textContent =
            explanation;

        descriptionElement.textContent =
            explanation;


        /* -----------------------------------------------
           CRÉDITO
        ------------------------------------------------ */

        const credit =
            cleanHTML(
                data.credit ||
                data.copyright ||
                "NASA"
            );


        const finalCredit =
            credit || "NASA";


        creditElement.textContent =
            finalCredit;

        infoCreditElement.textContent =
            finalCredit;


        /* -----------------------------------------------
           LINK NASA
        ------------------------------------------------ */

        originalLink.href =
            data.permalink ||
            data.url ||
            "https://science.nasa.gov/apod/";


        /* -----------------------------------------------
           FRASE
        ------------------------------------------------ */

        quoteElement.textContent =
            createQuote();


        /* -----------------------------------------------
           MÍDIA
        ------------------------------------------------ */

        if (
            data.media_type === "image" &&
            (
                data.hdurl ||
                data.url
            )
        ) {

            const imageUrl =
                data.hdurl ||
                data.url;


            imageElement.alt =
                data.alt ||
                data.title ||
                "Imagem astronômica da NASA";


            imageElement.onload =
                () => {

                    setLoading(false);

                    imageElement.classList.add(
                        "loaded"
                    );
                };


            imageElement.onerror =
                () => {

                    setLoading(false);

                    imageElement.classList.remove(
                        "loaded"
                    );

                    mediaNotice.hidden =
                        false;

                    mediaNotice.textContent =
                        "Não foi possível carregar esta imagem. Clique em “Ver na NASA” para visualizar a publicação.";

                    originalLink.href =
                        data.permalink ||
                        data.url ||
                        "https://science.nasa.gov/apod/";
                };


            imageElement.src =
                imageUrl;


        } else {

            setLoading(false);

            mediaNotice.hidden =
                false;

            mediaNotice.textContent =
                "O APOD de hoje é um vídeo ou outro tipo de mídia. Clique em “Ver na NASA” para visualizar.";
        }


    } catch (error) {

        console.error(
            "Erro ao carregar APOD:",
            error
        );

        showError();
    }
}


/* =========================================================
   SCROLL
   ========================================================= */

if (scrollButton) {

    scrollButton.addEventListener(
        "click",
        () => {

            const details =
                document.getElementById(
                    "details"
                );

            if (details) {

                details.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    );
}


/* =========================================================
   DATA DO HEADER
   ========================================================= */

if (currentDateElement) {

    currentDateElement.textContent =
        formatToday();
}


/* =========================================================
   INICIAR
   ========================================================= */

loadAPOD();