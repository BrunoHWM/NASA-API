const titleElement = document.getElementById("title");
const dateElement = document.getElementById("apodDate");
const currentDateElement = document.getElementById("currentDate");

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


// =====================================================
// FORMATAR DATA
// =====================================================

function formatDate(dateString) {

    if (!dateString) {
        return "--";
    }

    const date = new Date(
        `${dateString}T12:00:00`
    );

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(date);
}


// =====================================================
// DATA ATUAL
// =====================================================

function formatToday() {

    const today = new Date();

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(today);
}


// =====================================================
// LIMPAR HTML DA DESCRIÇÃO DA NASA
// =====================================================

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

    return document.body.textContent
        .replace(/\s+/g, " ")
        .trim();
}


// =====================================================
// CRIAR FRASE
// =====================================================

function createQuote(title) {

    const quotes = [

        `O universo continua escrevendo histórias que ainda estamos aprendendo a ler.`,

        `Cada imagem do cosmos é um lembrete de que ainda há muito para descobrir.`,

        `Olhar para o espaço é olhar para bilhões de anos de história.`,

        `Somos pequenos diante do universo, mas temos a capacidade de explorá-lo.`,

        `Todos os dias o universo revela um novo detalhe de sua imensidão.`,

        `Existe um universo inteiro esperando para ser descoberto.`

    ];

    const randomIndex =
        Math.floor(
            Math.random() * quotes.length
        );

    return quotes[randomIndex];
}


// =====================================================
// CARREGAR APOD
// =====================================================

async function loadAPOD() {

    try {

        // Esconde mensagem de erro
        errorElement.hidden = true;

        // Mostra carregamento
        loader.hidden = false;

        // Remove imagem anterior
        imageElement.classList.remove(
            "loaded"
        );

        mediaNotice.hidden = true;


        // =================================================
        // BUSCAR API
        // =================================================

        const response =
            await fetch("/api/apod");


        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Resposta da API:",
            result
        );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Erro desconhecido na API."
            );

        }


        const data =
            result.data;


        console.log(
            "Dados da NASA:",
            data
        );


        // =================================================
        // TÍTULO
        // =================================================

        titleElement.textContent =
            data.title ||
            "Imagem do dia";


        // =================================================
        // DATA
        // =================================================

        if (data.date) {

            const formattedDate =
                formatDate(data.date);

            dateElement.textContent =
                formattedDate;

            infoDateElement.textContent =
                formattedDate;

        }


        // =================================================
        // DESCRIÇÃO
        // =================================================

        const originalExplanation =
            data.explanation ||
            "A NASA não forneceu uma descrição para esta publicação.";


        /*
         * A API da NASA pode enviar HTML dentro
         * da propriedade "explanation".
         *
         * Exemplo:
         *
         * <strong>Explanation:</strong>
         *
         * Texto...
         *
         * <a href="...">NASA</a>
         *
         * Aqui transformamos tudo em texto limpo.
         */

        const cleanExplanation =
            cleanHTML(
                originalExplanation
            );


        explanationElement.textContent =
            cleanExplanation;


        descriptionElement.textContent =
            cleanExplanation;


        // =================================================
        // CRÉDITO
        // =================================================

        const credit =
            data.credit ||
            data.copyright ||
            "NASA";


        creditElement.textContent =
            credit;


        infoCreditElement.textContent =
            credit;


        // =================================================
        // LINK ORIGINAL
        // =================================================

        originalLink.href =
            data.permalink ||
            data.url ||
            "#";


        // =================================================
        // FRASE
        // =================================================

        quoteElement.textContent =
            createQuote(
                data.title
            );


        // =================================================
        // TIPO DE MÍDIA
        // =================================================

        if (
            data.media_type === "image" ||
            data.image_url ||
            data.hdurl
        ) {


            // =============================================
            // URL DA IMAGEM
            // =============================================

            const imageUrl =
                data.hdurl ||
                data.image_url ||
                data.url;


            if (!imageUrl) {

                throw new Error(
                    "A NASA não retornou uma URL de imagem."
                );

            }


            // =============================================
            // TEXTO ALTERNATIVO
            // =============================================

            imageElement.alt =
                data.alt ||
                data.title ||
                "Imagem astronômica da NASA";


            // =============================================
            // CARREGAR IMAGEM
            // =============================================

            imageElement.onload =
                function () {

                    loader.hidden = true;

                    imageElement.classList.add(
                        "loaded"
                    );

                };


            imageElement.onerror =
                function () {

                    loader.hidden = true;

                    throw new Error(
                        "Não foi possível carregar a imagem."
                    );

                };


            imageElement.src =
                imageUrl;


            mediaNotice.hidden = true;


        } else {


            // =============================================
            // VÍDEO
            // =============================================

            imageElement.removeAttribute(
                "src"
            );

            imageElement.classList.remove(
                "loaded"
            );

            loader.hidden = true;

            mediaNotice.hidden = false;

            mediaNotice.textContent =
                "O APOD de hoje é um vídeo. Clique em “Ver na NASA” para assistir.";

        }


    } catch (error) {

        console.error(
            "Erro ao carregar APOD:",
            error
        );


        loader.hidden = true;

        errorElement.hidden = false;

    }

}


// =====================================================
// BOTÃO "DESCOBRIR MAIS"
// =====================================================

const scrollButton =
    document.getElementById(
        "scrollButton"
    );


if (scrollButton) {

    scrollButton.addEventListener(
        "click",
        function () {

            const details =
                document.getElementById(
                    "details"
                );


            if (details) {

                details.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// =====================================================
// DATA DO CABEÇALHO
// =====================================================

if (currentDateElement) {

    currentDateElement.textContent =
        formatToday();

}


// =====================================================
// INICIAR APLICAÇÃO
// =====================================================

loadAPOD();