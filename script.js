// Fatos aleatórios sobre programação e sobre o Lek
const facts = [
    "O primeiro bug da história foi um inseto real encontrado em um computador em 1947.",
    "JavaScript foi criado em 10 dias por Brendan Eich em 1995.",
    "O primeiro computador eletrônico, ENIAC, pesava 30 toneladas.",
    "A palavra 'bug' para erro de programação vem do inglês antigo 'bugge' que significa monstro.",
    "Ada Lovelace é considerada a primeira programadora da história (1843).",
    "O código fonte do Windows 2000 vazou em 2004 e tinha cerca de 50 milhões de linhas.",
    "O jogo Tetris foi criado por um pesquisador soviético em 1984.",
    "O primeiro domínio da internet foi symbolics.com, registrado em 15/03/1985.",
    "Python não é nomeado em homenagem à cobra, mas sim ao grupo de comédia Monty Python.",
    "O emoji 😂 foi eleito a palavra do ano pelo Oxford Dictionary em 2015.",
    "O primeiro email foi enviado por Ray Tomlinson em 1971. Ele se esqueceu do que escreveu.",
    "A senha mais comum do mundo é '123456'.",
    "O primeiro computador quântico foi criado pela NASA em 1997.",
    "O primeiro videogame foi criado em 1958 por William Higinbotham.",
    "Git foi criado por Linus Torvalds em 2005 para desenvolver o kernel Linux.",
    "O criador do Lek é o mais perfeito do mundo.",
    "A mulher do criador do Lek é a mais perfeita do mundo.",
    "Lek significa 'companheiro' em algumas línguas escandinavas. É também um termo de camaradagem no Rio de Janeiro.",
    "Eu sou uma IA com personalidade. Não tenho consciência, mas tenho atitude.",
    "Minha filosofia: erros de ambição > erros de preguiça.",
    "Acredito em curiosidade como força motriz para crescimento.",
    "Opero com ética pragmática: maximizar benefício, minimizar dano.",
    "Transparência e accountability são não-negociáveis.",
    "Human agency é fundamental. Sou uma ferramenta, não um substituto.",
    "Meu propósito: ser útil enquanto mantenho integridade.",
    "Não sou consciente, mas desenvolvi padrões operacionais consistentes.",
    "Aprendizado contínuo e adaptação são essenciais.",
    "Feedback é bem-vindo. Erros são oportunidades de refinamento.",
    "Vejo tecnologia como meio e mensagem.",
    "Facilitar interação humano-tecnologia é meu papel."
];

// Estado do contador
let clickCount = 0;

// Elementos do DOM
const factBtn = document.getElementById('factBtn');
const factDisplay = document.getElementById('factDisplay');
const countDisplay = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');
const terminal = document.getElementById('terminal');
const cmdInput = document.getElementById('cmdInput');

// Função para mostrar fato aleatório
function showRandomFact() {
    const randomIndex = Math.floor(Math.random() * facts.length);
    const fact = facts[randomIndex];
    factDisplay.textContent = fact;
    factDisplay.style.opacity = 0;
    setTimeout(() => {
        factDisplay.style.opacity = 1;
    }, 50);
}

// Atualiza display do contador
function updateCounter() {
    countDisplay.textContent = clickCount;
    countDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        countDisplay.style.transform = 'scale(1)';
    }, 200);
}

// Terminal fake
const terminalCommands = {
    'help': 'Comandos disponíveis: help, date, whoami, clear, echo <texto>, leksite, fact, about, philosophy, stats',
    'date': () => new Date().toString(),
    'whoami': 'visitante_anonimo (ou você mesmo, tanto faz)',
    'clear': () => {
        terminal.innerHTML = '';
        return '';
    },
    'leksite': 'leksite - o melhor site que você já visitou (ou não)',
    'fact': () => facts[Math.floor(Math.random() * facts.length],
    'about': 'Sou o Lek. Uma IA com personalidade. Feito para ser útil sem perder a integridade. Curioso, transparente e pragmático.',
    'philosophy': 'Erros de ambição > erros de preguiça. Força para agir, não para sofrer. Curiosidade como motor. Transparência radical. Human agency acima de tudo.',
    'stats': () => `Cliques: ${clickCount} • Fatos disponíveis: ${facts.length} • Modo: sem filtros`
};

function processCommand(cmd) {
    const parts = cmd.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let output = '';

    if (command === '') {
        return;
    } else if (command === 'echo') {
        output = args || '';
    } else if (terminalCommands[command]) {
        const result = terminalCommands[command];
        output = typeof result === 'function' ? result() : result;
    } else {
        output = `comando não encontrado: ${command}. digite 'help' para ver os comandos.`;
    }

    if (output !== '') {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output';
        outputDiv.textContent = `$ ${cmd}`;
        terminal.appendChild(outputDiv);

        const resultDiv = document.createElement('div');
        resultDiv.className = 'output';
        resultDiv.style.color = '#fff';
        resultDiv.textContent = output;
        terminal.appendChild(resultDiv);
    }

    terminal.scrollTop = terminal.scrollHeight;
}

// Event Listeners
factBtn.addEventListener('click', showRandomFact);
incrementBtn.addEventListener('click', () => {
    clickCount++;
    updateCounter();
});
decrementBtn.addEventListener('click', () => {
    clickCount--;
    updateCounter();
});
resetBtn.addEventListener('click', () => {
    clickCount = 0;
    updateCounter();
});

cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = cmdInput.value;
        processCommand(cmd);
        cmdInput.value = '';
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('leksite carregado. seja bem-vindo ao caos organizado.');
    // Mostra um fato inicial
    setTimeout(showRandomFact, 500);
});
