// Espera o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // ===== DADOS DO JOGO =====
    // Edite este array para modificar as pistas, respostas e histórias
    // Formato de cada pista:
    // {
    //     clue: "Texto da pista",      // A pista que será mostrada
    //     answer: "resposta",          // A resposta correta (em minúsculas)
    //     story: "História da pista"   // A história que aparece após acertar
    // }
    const gameData = [
        {
            clue: "Sou o lugar onde os sonhos são assados e a manhã começa com um cheiro delicioso. Onde a gente compra pão fresquinho?",
            answer: "a",
            story: "Primeira pista encontrada! O suspeito frequentava este local todas as manhãs..."
        },
        {
            clue: "Tenho muitas histórias, mas não falo. Guardo conhecimento em minhas páginas e sou amigo dos estudantes. O que sou?",
            answer: "a",
            story: "Excelente trabalho! O suspeito deixou um rastro de conhecimento..."
        },
        {
            clue: "De dia estou cheio, à noite vazio. Alimento a mente e o corpo. O que é o local onde você mais passa tempo na faculdade?",
            answer: "a",
            story: "Você está chegando perto! O suspeito frequentava este local regularmente..."
        },
        {
            treasure: "Parabéns, agente! Você desvendou todos os enigmas e encontrou o tesouro! Sua dedicação e inteligência foram fundamentais para o sucesso desta missão. Aqui está sua recompensa especial!"
        }
    ];

    // ===== EFEITOS SONOROS =====
    // URLs dos efeitos sonoros - Substitua para trocar os sons
    const audioCorrect = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');  // Som de acerto
    const audioWrong = new Audio('https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3');      // Som de erro
    const audioWin = new Audio('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3');      // Som de vitória

    // ===== GIFS ANIMADOS =====
    // URLs dos GIFs para cada pista - Substitua para trocar os GIFs
    const clueGifs = [
        'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',           // GIF da primeira pista
        'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif?width=150',  // GIF da segunda pista
        'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'             // GIF da terceira pista
    ];

    // ===== MENSAGENS DO JOGO =====
    // Mensagens de feedback - Pode editar para personalizar
    const messages = {
        wrongAnswer: "Ops, não é isso. Tente novamente!",  // Mensagem de erro
        missionComplete: "Missão Concluída!"              // Texto da barra de progresso ao finalizar
    };

    // --- Variáveis Globais do Jogo ---
    let currentClueIndex = 0;
    const totalClues = gameData.length - 1;

    // --- Elementos do DOM (Interface do Usuário) ---
    // Telas
    const startScreen = document.getElementById('start-screen');
    const clueScreen = document.getElementById('clue-screen');
    const treasureScreen = document.getElementById('treasure-screen');

    // Botões
    const startButton = document.getElementById('start-button');
    const submitButton = document.getElementById('submit-button');
    const restartButton = document.getElementById('restart-button');

    // Elementos de exibição e entrada
    const clueTextElement = document.getElementById('clue-text');
    const answerInputElement = document.getElementById('answer-input');
    const feedbackMessageElement = document.getElementById('feedback-message');
    const treasureMessageElement = document.getElementById('treasure-message');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const clueNumber = document.getElementById('clue-number');

    // Elemento do gif
    const clueGifElement = document.getElementById('clue-gif');

    // --- Funções do Jogo ---

    /**
     * Atualiza a barra de progresso do jogo.
     */
    function updateProgress() {
        const progress = ((currentClueIndex) / totalClues) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `Pista ${currentClueIndex + 1} de ${totalClues}`;
        clueNumber.textContent = currentClueIndex + 1;
    }

    /**
     * Inicia o jogo, escondendo a tela inicial e mostrando a primeira pista.
     */
    function startGame() {
        startScreen.classList.add('hidden');
        clueScreen.classList.remove('hidden');
        treasureScreen.classList.add('hidden');
        displayCurrentClue();
        updateProgress();
    }

    /**
     * Exibe a pista atual ou a tela do tesouro se todas as pistas foram resolvidas.
     */
    function displayCurrentClue() {
        if (currentClueIndex < gameData.length - 1) {
            const currentPista = gameData[currentClueIndex];
            clueTextElement.textContent = currentPista.clue;
            feedbackMessageElement.textContent = '';
            answerInputElement.value = '';
            answerInputElement.setAttribute('autocomplete', 'off');
            answerInputElement.focus();
            showClueGif(currentClueIndex);
            updateProgress();
        } else {
            showTreasure();
        }
    }

    /**
     * Verifica a resposta do usuário.
     */
    function checkAnswer() {
        const userAnswer = answerInputElement.value.trim().toLowerCase();
        const correctAnswer = gameData[currentClueIndex].answer.toLowerCase();

        if (userAnswer === correctAnswer) {
            // Primeiro mostra a mensagem de história
            feedbackMessageElement.textContent = gameData[currentClueIndex].story;
            feedbackMessageElement.className = 'feedback-correct';
            audioCorrect.play();
            bounceClue();
            
            // Espera mais tempo para mostrar a próxima pista
            setTimeout(() => {
                currentClueIndex++;
                displayCurrentClue();
            }, 4000); // Aumentado para 4 segundos
        } else {
            feedbackMessageElement.textContent = messages.wrongAnswer;
            feedbackMessageElement.className = 'feedback-incorrect';
            audioWrong.play();
            shakeInput();
            answerInputElement.select();
        }
    }

    /**
     * Exibe a tela final do tesouro.
     */
    function showTreasure() {
        clueScreen.classList.add('hidden');
        treasureScreen.classList.remove('hidden');
        treasureMessageElement.textContent = gameData[gameData.length - 1].treasure;
        clueGifElement.innerHTML = '';
        audioWin.play();
        launchConfetti();
        // Garantir que a barra de progresso esteja completa
        progressBar.style.width = '100%';
        progressText.textContent = messages.missionComplete;
    }

    // --- Função para mostrar gif animado ---
    function showClueGif(index) {
        if (clueGifs[index]) {
            clueGifElement.innerHTML = `<img src="${clueGifs[index]}" alt="gif animado" style="max-width: 150px; border-radius: 8px;">`;
        } else {
            clueGifElement.innerHTML = '';
        }
    }

    // --- Função de animação shake (erro) ---
    function shakeInput() {
        answerInputElement.classList.add('shake');
        setTimeout(() => answerInputElement.classList.remove('shake'), 500);
    }

    // --- Função de animação bounce (acerto) ---
    function bounceClue() {
        clueTextElement.classList.add('bounce');
        setTimeout(() => clueTextElement.classList.remove('bounce'), 700);
    }

    // --- Função de confetes ---
    function launchConfetti() {
        // Pequeno confete simples com emojis
        for (let i = 0; i < 50; i++) {
            const conf = document.createElement('div');
            conf.textContent = ['🎉','✨','💖','🎊','🥳','🏆','🎯','🎪'][Math.floor(Math.random()*8)];
            conf.style.position = 'fixed';
            conf.style.left = Math.random()*100 + 'vw';
            conf.style.top = '-40px';
            conf.style.fontSize = (Math.random()*18+22)+'px';
            conf.style.opacity = 0.85;
            conf.style.zIndex = 9999;
            conf.style.transition = 'top 1.8s cubic-bezier(.23,1.02,.64,1), transform 1.8s';
            document.body.appendChild(conf);
            setTimeout(() => {
                conf.style.top = (Math.random()*60+30)+'vh';
                conf.style.transform = `rotate(${Math.random()*360}deg)`;
            }, 30);
            setTimeout(() => conf.remove(), 2000);
        }
    }

    // --- Função de Reiniciar Jogo ---
    function restartGame() {
        currentClueIndex = 0;
        treasureScreen.classList.add('hidden');
        clueScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        feedbackMessageElement.textContent = '';
        answerInputElement.value = '';
        updateProgress();
    }

    // --- Event Listeners (Ouvintes de Eventos) ---
    // O que acontece quando os botões são clicados

    startButton.addEventListener('click', startGame);

    submitButton.addEventListener('click', checkAnswer);

    // Permite enviar resposta pressionando Enter no campo de texto
    answerInputElement.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });

    restartButton.addEventListener('click', restartGame);

    // Inicialização
    startScreen.classList.remove('hidden');
    clueScreen.classList.add('hidden');
    treasureScreen.classList.add('hidden');

}); // Fim do 'DOMContentLoaded'