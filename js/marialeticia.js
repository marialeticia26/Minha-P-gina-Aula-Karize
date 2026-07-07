const elementosRevelar = document.querySelectorAll(".revelar");
const linksMenu = document.querySelectorAll(".menu a");
const secoes = document.querySelectorAll("main section[id], header[id]");
const barraProgresso = document.getElementById("barraProgresso");
const topoBtn = document.getElementById("topoBtn");
const modal = document.getElementById("modalMensagem");
const abrirModal = document.getElementById("mensagemBtn");
const fecharModal = document.getElementById("fecharModal");
const itensTimeline = document.querySelectorAll(".timeline-item");
const fotoTurma = document.querySelector(".foto-turma img");
const areaFoto = document.getElementById("fotoArea");
const cursorBolinha = document.getElementById("cursorBolinha");
const cardsTilt = document.querySelectorAll("[data-tilt]");
const botoesMagneticos = document.querySelectorAll(".botao, .botao-surpresa");
const preferePoucoMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

function podeAnimar() {
    return !preferePoucoMovimento.matches;
}

function atualizarBarraProgresso() {
    if (!barraProgresso) {
        return;
    }

    const alturaPagina = document.documentElement.scrollHeight - window.innerHeight;
    const porcentagem = alturaPagina > 0 ? (window.scrollY / alturaPagina) * 100 : 0;
    barraProgresso.style.width = `${Math.min(100, Math.max(0, porcentagem))}%`;
}

function atualizarMenu() {
    if (!linksMenu.length || !secoes.length) {
        return;
    }

    let secaoAtual = "inicio";

    secoes.forEach((secao) => {
        const topo = secao.offsetTop - 160;

        if (window.scrollY >= topo) {
            secaoAtual = secao.getAttribute("id");
        }
    });

    linksMenu.forEach((link) => {
        link.classList.toggle("ativo", link.getAttribute("href") === `#${secaoAtual}`);
    });

    if (topoBtn) {
        topoBtn.classList.toggle("visivel", window.scrollY > 520);
    }
}

function iniciarAnimacaoEntrada() {
    if (!elementosRevelar.length) {
        return;
    }

    if (!podeAnimar()) {
        elementosRevelar.forEach((elemento) => elemento.classList.add("visivel"));
        return;
    }

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
            }
        });
    }, {
        threshold: 0.16
    });

    elementosRevelar.forEach((elemento) => observador.observe(elemento));
}

function abrirMensagem() {
    if (!modal) {
        return;
    }

    modal.classList.add("aberto");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-aberto");

    if (fecharModal) {
        fecharModal.focus();
    }

    criarConfete();
}

function fecharMensagem() {
    if (!modal) {
        return;
    }

    modal.classList.remove("aberto");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-aberto");

    if (abrirModal) {
        abrirModal.focus();
    }
}

function iniciarModal() {
    if (abrirModal) {
        abrirModal.addEventListener("click", abrirMensagem);
    }

    if (fecharModal) {
        fecharModal.addEventListener("click", fecharMensagem);
    }

    if (modal) {
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) {
                fecharMensagem();
            }
        });
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && modal && modal.classList.contains("aberto")) {
            fecharMensagem();
        }
    });
}

function iniciarTimeline() {
    itensTimeline.forEach((item) => {
        const botao = item.querySelector("button");

        if (!botao) {
            return;
        }

        botao.addEventListener("click", () => {
            itensTimeline.forEach((outroItem) => outroItem.classList.remove("ativo"));
            item.classList.add("ativo");
        });
    });
}

function atualizarEstadoFoto() {
    if (!fotoTurma || !areaFoto) {
        return;
    }

    if (fotoTurma.complete && fotoTurma.naturalWidth === 0) {
        areaFoto.classList.add("sem-foto");
        fotoTurma.alt = "Espaço reservado para a foto da turma";
    }
}

function iniciarFotoSpotlight() {
    if (!areaFoto) {
        return;
    }

    areaFoto.addEventListener("mousemove", (evento) => {
        const limites = areaFoto.getBoundingClientRect();
        const x = ((evento.clientX - limites.left) / limites.width) * 100;
        const y = ((evento.clientY - limites.top) / limites.height) * 100;

        areaFoto.style.setProperty("--spot-x", `${x}%`);
        areaFoto.style.setProperty("--spot-y", `${y}%`);
    });

    if (fotoTurma) {
        fotoTurma.addEventListener("error", atualizarEstadoFoto);
        fotoTurma.addEventListener("load", () => areaFoto.classList.remove("sem-foto"));
    }

    atualizarEstadoFoto();
}

function iniciarTiltCards() {
    if (!cardsTilt.length || !podeAnimar()) {
        return;
    }

    cardsTilt.forEach((card) => {
        card.addEventListener("mousemove", (evento) => {
            const limites = card.getBoundingClientRect();
            const x = evento.clientX - limites.left;
            const y = evento.clientY - limites.top;
            const rotacaoY = ((x / limites.width) - 0.5) * 10;
            const rotacaoX = ((y / limites.height) - 0.5) * -10;

            card.style.setProperty("--rx", `${rotacaoX}deg`);
            card.style.setProperty("--ry", `${rotacaoY}deg`);
            card.style.setProperty("--ty", "-4px");
        });

        card.addEventListener("mouseleave", () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
            card.style.setProperty("--ty", "0");
        });
    });
}

function iniciarBotoesMagneticos() {
    if (!botoesMagneticos.length || !podeAnimar()) {
        return;
    }

    botoesMagneticos.forEach((botao) => {
        botao.addEventListener("mousemove", (evento) => {
            const limites = botao.getBoundingClientRect();
            const x = evento.clientX - limites.left - limites.width / 2;
            const y = evento.clientY - limites.top - limites.height / 2;

            botao.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
        });

        botao.addEventListener("mouseleave", () => {
            botao.style.transform = "";
        });
    });
}

function iniciarCursorPersonalizado() {
    if (!cursorBolinha || !podeAnimar() || window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    window.addEventListener("mousemove", (evento) => {
        cursorBolinha.classList.add("ativo");
        cursorBolinha.style.left = `${evento.clientX}px`;
        cursorBolinha.style.top = `${evento.clientY}px`;
    });

    document.addEventListener("mouseover", (evento) => {
        const alvoClicavel = evento.target.closest("a, button, .tilt-card, .foto-area");
        cursorBolinha.classList.toggle("clicavel", Boolean(alvoClicavel));
    });

    document.addEventListener("mouseleave", () => {
        cursorBolinha.classList.remove("ativo");
    });
}

function criarConfete() {
    if (!podeAnimar()) {
        return;
    }

    const cores = ["#6dc8ff", "#b98cff", "#ff6f91", "#ff9671", "#4ff0d0", "#ffd166"];
    const quantidade = 34;

    for (let i = 0; i < quantidade; i += 1) {
        const pedaco = document.createElement("span");
        const posicaoX = Math.random() * 100;
        const quedaX = (Math.random() - 0.5) * 240;

        pedaco.className = "confete";
        pedaco.style.left = `${posicaoX}vw`;
        pedaco.style.background = cores[Math.floor(Math.random() * cores.length)];
        pedaco.style.setProperty("--queda-x", `${quedaX}px`);
        pedaco.style.animationDelay = `${Math.random() * 0.18}s`;

        document.body.appendChild(pedaco);

        setTimeout(() => {
            pedaco.remove();
        }, 1200);
    }
}

function iniciarTopo() {
    if (!topoBtn) {
        return;
    }

    topoBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: podeAnimar() ? "smooth" : "auto"
        });
    });
}

window.addEventListener("scroll", () => {
    atualizarMenu();
    atualizarBarraProgresso();
});

window.addEventListener("load", () => {
    atualizarMenu();
    atualizarBarraProgresso();
    atualizarEstadoFoto();
});

iniciarAnimacaoEntrada();
iniciarModal();
iniciarTimeline();
iniciarFotoSpotlight();
iniciarTiltCards();
iniciarBotoesMagneticos();
iniciarCursorPersonalizado();
iniciarTopo();