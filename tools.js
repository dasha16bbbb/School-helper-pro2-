let timerInterval;
let timerTime = 25 * 60;
let isWorkMode = true;

const display = document.getElementById('timerDisplay');
const modeText = document.getElementById('timerMode');

function updateTimerUI() {
    if (!display) return;
    const mins = Math.floor(timerTime / 60).toString().padStart(2, '0');
    const secs = (timerTime % 60).toString().padStart(2, '0');
    display.innerText = `${mins}:${secs}`;
}

if (document.getElementById('startTimer')) {
    document.getElementById('startTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (timerTime > 0) {
                timerTime--;
                updateTimerUI();
            } else {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.connect(audioCtx.destination);
                osc.start(); osc.stop(0.5);

                isWorkMode = !isWorkMode;
                timerTime = isWorkMode ? 25 * 60 : 5 * 60;
                modeText.innerText = isWorkMode ? "Study Time!" : "Break Time!";
                updateTimerUI();
            }
        }, 1000);
    });

    document.getElementById('pauseTimer').addEventListener('click', () => clearInterval(timerInterval));
    document.getElementById('resetTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
        isWorkMode = true;
        timerTime = 25 * 60;
        modeText.innerText = "Study Time!";
        updateTimerUI();
    });
}

if (document.getElementById('setCountdownBtn')) {
    const setBtn = document.getElementById('setCountdownBtn');
    const resultBox = document.getElementById('countdownResult');
    
    setBtn.addEventListener('click', () => {
        const name = document.getElementById('examName').value;
        const dateVal = document.getElementById('examDate').value;
        if(!name || !dateVal) return;

        const targetDate = new Date(dateVal);
        const today = new Date();
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        resultBox.innerText = diffDays >= 0 ? `${name}: Noch ${diffDays} Tage.` : `${name} ist vorbei!`;
    });
}

if (document.getElementById('calcGradesBtn')) {
    document.getElementById('calcGradesBtn').addEventListener('click', () => {
        const val = document.getElementById('gradesInput').value;
        const arr = val.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
        
        if(arr.length === 0) return;
        const avg = arr.reduce((a,b) => a+b, 0) / arr.length;
        const resEl = document.getElementById('gradeResult');
        resEl.innerText = avg.toFixed(2);

        if (avg <= 2.0) resEl.style.color = '#2ecc71';
        else if (avg <= 4.0) resEl.style.color = '#f39c12';
        else resEl.style.color = '#e74c3c';
    });
}

const calcDisp = document.getElementById('calcDisplay');
window.pressNum = (num) => { if(calcDisp) calcDisp.value += num; };
window.pressOp = (op) => { if(calcDisp) calcDisp.value += ` ${op} `; };
window.clearCalc = () => { if(calcDisp) calcDisp.value = ''; };
window.calculateResult = () => {
    if(!calcDisp) return;
    try { calcDisp.value = eval(calcDisp.value); } catch { calcDisp.value = 'Error'; }
};

const cards = [
    {q: "Hauptstadt von Frankreich?", a: "Paris"},
    {q: "Wasserkoeffizient H2O: Was ist O?", a: "Sauerstoff"},
    {q: "Wann begann das digitale Zeitalter?", a: "Mitte des 20. Jahrhunderts"}
];
let currentCardIdx = 0;
const flashcard = document.getElementById('flashcard');

if (flashcard) {
    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    document.getElementById('nextCardBtn').addEventListener('click', () => {
        flashcard.classList.remove('flipped');
        setTimeout(() => {
            currentCardIdx = (currentCardIdx + 1) % cards.length;
            document.getElementById('cardFront').innerText = cards[currentCardIdx].q;
            document.getElementById('cardBack').innerText = cards[currentCardIdx].a;
        }, 200);
    });
}

const quizData = [
    { q: "Was ist 5 + 7?", o: ["10", "11", "12", "13"], a: 2 },
    { q: "Wer entdeckte Amerika?", o: ["Kolumbus", "Magellan", "Cook"], a: 0 }
];
let currentQuizIdx = 0;
let score = 0;

function loadQuiz() {
    const qEl = document.getElementById('quizQuestion');
    const oEl = document.getElementById('quizOptions');
    if(!qEl) return;

    if(currentQuizIdx >= quizData.length) {
        document.getElementById('quizContainer').classList.add('hidden');
        document.getElementById('quizResult').classList.remove('hidden');
        document.getElementById('quizScore').innerText = `Du hast ${score} von ${quizData.length} Punkten erreicht!`;
        return;
    }

    const currentQuiz = quizData[currentQuizIdx];
    qEl.innerText = currentQuiz.q;
    oEl.innerHTML = '';
    currentQuiz.o.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => {
            if(idx === currentQuiz.a) score++;
            currentQuizIdx++;
            loadQuiz();
        };
        oEl.appendChild(btn);
    });
}

if(document.getElementById('restartQuizBtn')) {
    document.getElementById('restartQuizBtn').addEventListener('click', () => {
        score = 0; currentQuizIdx = 0;
        document.getElementById('quizContainer').classList.remove('hidden');
        document.getElementById('quizResult').classList.add('hidden');
        loadQuiz();
    });
    loadQuiz();
}