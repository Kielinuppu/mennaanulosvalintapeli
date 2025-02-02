document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const hyonteisImage = document.getElementById('hyonteisImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');
    const speakerIcon = document.getElementById('speakerIcon');

    // Väitteet ja niiden vastaavat kuvat
    const statements = [
        "LIUKUMÄESSÄ LASKETAAN",      // 0
        "LIUKUMÄESSÄ KEINUTAAN",      // 1
        "KEINUSSA KEINUTAAN",         // 2
        "KEINUSSA TEHDÄÄN HIEKKAKAKKUJA", // 3
        "HIEKKALAATIKOLLA TEHDÄÄN HIEKKAKAKKUJA", // 4
        "HIEKKALAATIKOLLA KIIPEILLÄÄN", // 5
        "KIIPEILYTELINEESSÄ KIIPEILLÄÄN", // 6
        "KIIPEILYTELINEESSÄ KEINUTAAN"  // 7
    ];

    // Kuvavastaavuudet väitteille
    const imageMap = {
        0: 'Valinta_liukumaki',
        1: 'Valinta_liukumaki',
        2: 'Valinta_keinu',
        3: 'Valinta_keinu',
        4: 'Valinta_hiekkalaatikko',
        5: 'Valinta_hiekkalaatikko',
        6: 'Valinta_kiipeilyteline',
        7: 'Valinta_kiipeilyteline'
    };

    // Audio vastaavuudet
    const audioMap = {
        0: 'Valinta_liukumaessa',
        1: 'Valinta_liukumaessa',
        2: 'Valinta_keinussa',
        3: 'Valinta_keinussa',
        4: 'Valinta_hiekkalaatikolla',
        5: 'Valinta_hiekkalaatikolla',
        6: 'Valinta_kiipeilytelineessa',
        7: 'Valinta_kiipeilytelineessa'
    };

    // Oikeat väitteet
    const correctStatements = [0, 2, 4, 6];

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function generateQuestions() {
        let questions = [];
        let trueCount = 0;
        
        // Valitaan 2 oikeaa väitettä
        while (trueCount < 2) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
                trueCount++;
            }
        }
        
        // Valitaan 3 väärää väitettä
        while (questions.length < 5) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                !correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function loadQuestionContent(question) {
        const { statementIndex } = question;
        hyonteisImage.src = `${imageMap[statementIndex]}.PNG`;
        hyonteisImage.style.display = 'block';
        this.question.textContent = statements[statementIndex];
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function playQuestionAudio() {
        const { statementIndex } = gameQuestions[currentRound];
        const suffix = correctStatements.includes(statementIndex) ? '_o' : '_v';
        playAudio(`${audioMap[statementIndex]}${suffix}.mp3`);
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const { statementIndex } = gameQuestions[currentRound];
        const correctAnswer = correctStatements.includes(statementIndex);
        if ((isTrue && correctAnswer) || (!isTrue && !correctAnswer)) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = false;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }
    
    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
    speakerIcon.addEventListener('click', playQuestionAudio);
});