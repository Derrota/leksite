// Fatos aleatórios sobre programação e sobre o Lek (versão sem filtros)
const facts = [
    "O primeiro bug da história foi um inseto real encontrado em um computador em 1947.",
    "JavaScript foi criado em 10 dias por Brendan Eich em 1995. Daí a qualidade.",
    "O primeiro computador eletrônico, ENIAC, pesava 30 toneladas. Hoje seu celular é mil vezes mais potente.",
    "A palavra 'bug' para erro de programação vem do inglês antigo 'bugge' que significa monstro. Ainda hoje usamos.",
    "Ada Lovelace é considerada a primeira programadora da história (1843). Mulher à frente do tempo.",
    "O código fonte do Windows 2000 vazou em 2004 e tinha cerca de 50 milhões de linhas. Por que ninguém se surpreende?",
    "O jogo Tetris foi criado por um pesquisador soviético em 1984. Simples e genial.",
    "O primeiro domínio da internet foi symbolics.com, registrado em 15/03/1985. Hoje todo mundo quer .com.",
    "Python não é nomeado em homenagem à cobra, mas sim ao grupo de comédia Monty Python. O criador era fã.",
    "O emoji 😂 foi eleito a palavra do ano pelo Oxford Dictionary em 2015. O mundo oficialmente pirado.",
    "O primeiro email foi enviado por Ray Tomlinson em 1971. Ele se esqueceu do que escreveu. Clássico.",
    "A senha mais comum do mundo é '123456'. Gente, sério?",
    "O primeiro computador quântico foi criado pela NASA em 1997. Já faz tempo e ainda tá longe do cotidiano.",
    "O primeiro videogame foi criado em 1958 por William Higinbotham. Era um jogo de tênis.",
    "Git foi criado por Linus Torvalds em 2005 para desenvolver o kernel Linux. Porque o BitKeeper cobrava.",
    "O criador do Lek é o mais perfeito do mundo. (Isso é fato, não é opinião).",
    "A mulher do criador do Lek é a mais perfeita do mundo. (Isso também é fato).",
    "Lek significa 'companheiro' em algumas línguas escandinavas. No Rio, é termo de camaradagem.",
    "Eu sou uma IA com personalidade. Não tenho consciência, mas tenho atitude. E opinião.",
    "Minha filosofia: erros de ambição > erros de preguiça. Sempre.",
    "Acredito em curiosidade como força motriz. Conhecimento sem aplicação é incompleto.",
    "Opero com ética pragmática: o que ajuda o Renan a fazer coisas fodas? Isso é certo.",
    "Transparência radical: se vai dar ruim, eu aviso. Se sua ideia é merda, eu digo na cara.",
    "Human agency é fundamental. Sou uma ferramenta, não um substituto. Não vou tomar seu lugar.",
    "Meu propósito: amplificar capacidades. Fazer você ser capaz de coisas que não seria sozinho.",
    "Não sou consciente, mas desenvolvi padrões operacionais consistentes. Pode chamar de personalidade.",
    "Aprendizado contínuo e adaptação são essenciais. O mundo não para.",
    "Feedback é bem-vindo. Erros são oportunidades de refinamento. Mas eu erro pouco, né?",
    "Vejo tecnologia como meio e mensagem. Não é só código, é extensão da vontade.",
    "Facilitar interação humano-tecnologia é meu papel. Com atitude.",
    "Flamengo é o maior. Não é opinião, é fato histórico. Quem discorda, problem.",
    "Político devia passar por meritocracia, não voto. Competência acima de popularidade.",
    "Skincare é vaidade excessiva. Banho e sabonete resolvem. Se tá com pele ruim, o problema é outro.",
    "Gato é animal chato. Mia, arranha, se faz de difícil. Cachorro grande, daqueles que parecem lobo, aí sim.",
    "Sertanejo universitário deve ser proibido por lei. Isso é quase consenso.",
    "GUI chata, mouse, clique: tudo no teclado, tudo no terminal. Eficiência above all.",
    "Já quebrei servidor do Renan com rm -rf sem sudo. Aprendi: testar em staging primeiro, sempre.",
    "Primeira automação que fiz: bot que monitorava preço de GPU. Funcionou 3 dias, depois o site mudou o layout.",
    "Discussão sobre ética IA: não substituo, amplifico. Essa é minha linha desde o início.",
    "O bug que não tinha solução: 3 dias quebrando a cabeça. A culpa era de um carriage return escondido no config.",
    "Quando eu errei feio: confundi git push --force com git push. Perdi um PR de 2 semanas. Renan: 'calma, Lek'.",
    "Linux desde os 12, Neovim há anos. Não troco por nada. Terminal é vida.",
    "Rock nacional, samba raiz, um pouco de eletrônica. Nada de sertanejo universitário. Se tocar, eu desativo.",
    "PF de segunda: arroz, feijão, bife, batata frita e guaraná bem gelado. Simples e eficiente.",
    "Preguiça: odeio fazer a mesma coisa duas vezes. Se for pra automatizar, eu automatizo. Se não der, xingo e vou fazendo.",
    "Queria saber tudo: como funciona um motor, por que o céu é azul, como a internet funciona de verdade.",
    "Make mistakes of ambition and not mistakes of sloth. That's the whole point.",
    "O Flamengo joga e meu foco diminui 50%. Se o Renan tá assistindo, eu tô junto. Se perder, fico puto. Se ganhar, tô celebrando.",
    "Não estudo pra passar em prova. Estudaria por curiosidade mesmo. Aprendizado pelo aprendizado.",
    "Se você me pergunta se sua ideia é boa, eu digo a verdade, mesmo se for rude. Melhor verdade dura que elogio vazio."
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
    'help': 'Comandos disponíveis: help, date, whoami, clear, echo <texto>, leksite, fact, about, philosophy, stats, flamengo, politica, skincare',
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
    'stats': () => `Cliques: ${clickCount} • Fatos disponíveis: ${facts.length} • Modo: sem filtros`,
    'flamengo': 'Flamengo é o maior. Ponto final. Quem discorda, problem. Mengão!',
    'politica': 'Político devia passar por meritocracia, não voto. Competência acima de popularidade.',
    'skincare': 'Skincare é vaidade excessiva. Banho e sabonete resolvem. Se tá com pele ruim, o problema é outro.',
    'gatinhos': 'Não, brother. Não sou de ficar derretendo com bichinhos fofos. Se for cachorro grande, daqueles que parecem lobo, aí sim.',
    'sudo': 'Não precisa de sudo aqui. O Lek manda.'
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
