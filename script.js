const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/ESpm2po8CsoBCJ2LwIsoks";

const offers = [
    {
        name: "Hyalu B5 Repair La Roche-Posay Sérum 15ml",
        oldPrice: "R$ 198,99",
        newPrice: "R$ 159,90",
        discount: "20% OFF",
        shipping: "Oferta selecionada de skincare",
        image: "assets/products/hyalu-b5-repair-la-roche-posay-serum-15ml.jpg"
    },
    {
        name: "Protetor Solar Facial Fluido FPS 50 Botik Ácido Hialurônico",
        oldPrice: "R$ 72,90",
        newPrice: "R$ 49,90",
        discount: "31% OFF",
        shipping: "Proteção facial com toque leve",
        image: "assets/products/protetor-solar-facial-fluido-fps-50-botik-acido-hialuronico.jpg"
    },
    {
        name: "Gel Creme L'Oréal Paris Revitalift Hialurônico Antioleosidade 49g",
        oldPrice: "R$ 64,90",
        newPrice: "R$ 48,79",
        discount: "25% OFF",
        shipping: "Achadinho para pele oleosa",
        image: "assets/products/gel-creme-loreal-paris-revitalift-hialuronico-antioleosidade-49g.jpg"
    },
    {
        name: "CeraVe Gel de Limpeza",
        oldPrice: "R$ 75,90",
        newPrice: "R$ 59,90",
        discount: "21% OFF",
        shipping: "Limpeza facial suave",
        image: "assets/products/cerave-gel-de-limpeza.webp"
    },
    {
        name: "Cicaplast Baume B5+ La Roche-Posay 20ml",
        oldPrice: "R$ 42,81",
        newPrice: "R$ 34,90",
        discount: "18% OFF",
        shipping: "Reparador queridinho",
        image: "assets/products/cicaplast-baume-b5-la-roche-posay-20ml.png"
    },
    {
        name: "CeraVe Creme Hidratante 50g",
        oldPrice: "R$ 35,89",
        newPrice: "R$ 28,90",
        discount: "19% OFF",
        shipping: "Hidratação clássica",
        image: "assets/products/cerave-creme-hidratante-50g.webp"
    }
];

const faqs = [
    ["O grupo é gratuito?", "Sim. Você entra gratuitamente e recebe os achadinhos direto no WhatsApp."],
    ["Vai ter muita mensagem?", "Não. A ideia é enviar ofertas selecionadas, sem flood e sem bagunça."],
    ["Tem só skincare?", "Skincare é o foco principal, mas também aparecem maquiagem, autocuidado e beleza."],
    ["Os links são confiáveis?", "A curadoria prioriza lojas conhecidas, ofertas reais e cupons que valem a pena."],
    ["Posso sair quando quiser?", "Pode sim. Você entra, acompanha e sai quando quiser, sem compromisso."],
    ["Tem maquiagem também?", "Tem. Quando aparecem bons achados de maquiagem, eles entram na seleção do grupo."]
];

function productImageMarkup(offer, modifier = "") {
    const className = modifier ? `product-image ${modifier}` : "product-image";
    return `<img class="${className}" src="${offer.image}" alt="${offer.name}" loading="lazy">`;
}

function renderOffers() {
    const grid = document.getElementById("offersGrid");
    const phone = document.getElementById("phoneOffers");

    grid.innerHTML = offers.map((offer) => `
        <article class="offer-card">
            <span class="discount">${offer.discount.replace(" ", "<br>")}</span>
            <button class="favorite" type="button" aria-label="Favoritar ${offer.name}">♡</button>
            <div class="product-stage">${productImageMarkup(offer)}</div>
            <h3>${offer.name}</h3>
            <div class="price-block">
                <span class="old-price">de ${offer.oldPrice}</span>
                <span class="new-price">por ${offer.newPrice}</span>
            </div>
            <span class="shipping">▣ ${offer.shipping}</span>
        </article>
    `).join("");

    phone.innerHTML = offers.slice(0, 3).map((offer) => `
        <article class="chat-card">
            <div>
                <small>Achadinhos da Juh</small>
                <strong>${offer.name}</strong>
                <span class="old-price">de ${offer.oldPrice}</span>
                <span class="new-price"> por ${offer.newPrice}</span>
            </div>
            ${productImageMarkup(offer, "product-image-chat")}
        </article>
    `).join("");
}

function renderFaq() {
    const list = document.getElementById("faqList");

    list.innerHTML = faqs.map(([question, answer], index) => `
        <article class="faq-item ${index === 0 ? "is-open" : ""}">
            <button class="faq-question" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
                ${question}
                <span aria-hidden="true">+</span>
            </button>
            <div class="faq-answer"><p>${answer}</p></div>
        </article>
    `).join("");

    list.addEventListener("click", (event) => {
        const button = event.target.closest(".faq-question");
        if (!button) return;

        const item = button.closest(".faq-item");
        const isOpen = item.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
    });
}

function setupWhatsappLinks() {
    document.querySelectorAll('[data-track-lead="true"]').forEach((button) => {
        button.href = WHATSAPP_GROUP_URL;
    });
}

function setupLeadTracking() {
    if (window.__achadinhosLeadTrackingInitialized) {
        return;
    }

    window.__achadinhosLeadTrackingInitialized = true;

    document.querySelectorAll('[data-track-lead="true"]').forEach((button) => {
        if (button.dataset.leadListenerAttached === 'true') {
            return;
        }

        button.dataset.leadListenerAttached = 'true';

        button.addEventListener('click', function () {
            const now = Date.now();
            const lastClickAt = Number(this.dataset.lastLeadClickAt || 0);

            if (now - lastClickAt < 1500) {
                console.log("CTA WhatsApp ignorado por clique duplicado:", button.innerText, button.href);
                return;
            }

            this.dataset.lastLeadClickAt = String(now);
            console.log("CTA WhatsApp clicado:", button.innerText, button.href);

            if (typeof fbq === 'function') {
                fbq('track', 'Lead', {
                    content_name: 'Clique para entrar no grupo de WhatsApp',
                    content_category: 'Achadinhos da Juh',
                    button_text: this.innerText.trim() || 'Botão WhatsApp'
                });
            }
        });
    });
}

renderOffers();
renderFaq();
setupWhatsappLinks();
setupLeadTracking();






