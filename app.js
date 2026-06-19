// --- ИНТЕРНАЦИОНАЛИЗАЦИЯ (Перевод на 3 языка) ---
const i18n = {
    de: {
        navHome: "Home", navTools: "Tools", navAbout: "About",
        welcomeTitle: "Willkommen bei School Helper Pro!", welcomeSub: "Dein digitaler Schulassistent für perfekten Erfolg.",
        streakText: "Du lernst bereits seit", streakDays: "Tagen in Folge!",
        dateTimeTitle: "Datum & Uhrzeit", weatherTitle: "Wetter am Campus", loading: "Lade...",
        motivationTitle: "Zitat des Tages", factTitle: "Zufälliger Fakt", factBtn: "Nächster Fakt",
        todoTitle: "Meine To-Do Liste", homeworkTitle: "Hausaufgaben-Tracker", addBtn: "Hinzufügen",
        videoTitle: "Lernvideo des Tages", pomodoroTitle: "Pomodoro Timer", start: "Start", pause: "Pause",
        reset: "Reset", countdownTitle: "Exam Countdown", save: "Speichern", gradeTitle: "Notenrechner",
        gradeHint: "Gib deine Noten kommagetrennt ein:", calc: "Berechnen", calcTitle: "Mini-Taschenrechner",
        flashcardTitle: "Lernkarten", next: "Nächste", quizTitle: "Mini-Quiz", restart: "Nochmal",
        aboutProjectTitle: "Über das Projekt", techTitle: "Genutzte Technologien:", createdBy: "Erstellt für das Schulprojekt von",
        // Добавили переводы для виджета погоды
        weatherCity: "Düsseldorf", weatherWind: "Wind"
    },
    en: {
        navHome: "Home", navTools: "Tools", navAbout: "About",
        welcomeTitle: "Welcome to School Helper Pro!", welcomeSub: "Your digital school assistant for success.",
        streakText: "You have been studying for", streakDays: "days in a row!",
        dateTimeTitle: "Date & Time", weatherTitle: "Campus Weather", loading: "Loading...",
        motivationTitle: "Quote of the Day", factTitle: "Random Fact", factBtn: "Next Fact",
        todoTitle: "My To-Do List", homeworkTitle: "Homework Tracker", addBtn: "Add",
        videoTitle: "Tutorial Video of the Day", pomodoroTitle: "Pomodoro Timer", start: "Start", pause: "Pause",
        reset: "Reset", countdownTitle: "Exam Countdown", save: "Save", gradeTitle: "Grade Calculator",
        gradeHint: "Enter your grades separated by commas:", calc: "Calculate", calcTitle: "Mini Calculator",
        flashcardTitle: "Flashcards", next: "Next", quizTitle: "Mini Quiz", restart: "Restart",
        aboutProjectTitle: "About the Project", techTitle: "Technologies used:", createdBy: "Created for the school project by" ,
        // Добавили переводы для виджета погоды
        weatherCity: "Düsseldorf", weatherWind: "Wind"
    },
    ru: {
        navHome: "Главная", navTools: "Инструменты", navAbout: "О проекте",
        welcomeTitle: "Добро пожаловать в School Helper Pro!", welcomeSub: "Твой цифровой школьный помощник.",
        streakText: "Ты учишься уже", streakDays: "дней подряд!",
        dateTimeTitle: "Дата и Время", weatherTitle: "Погода у кампуса", loading: "Загрузка...",
        motivationTitle: "Цитата дня", factTitle: "Случайный факт", factBtn: "Следующий факт",
        todoTitle: "Мой список задач", homeworkTitle: "ДЗ Трекер", addBtn: "Добавить",
        videoTitle: "Обучающее видео дня", pomodoroTitle: "Помидор Таймер", start: "Старт", pause: "Пауза",
        reset: "Сброс", countdownTitle: "Обратный отсчет до экзамена", save: "Сохранить", gradeTitle: "Калькулятор оценок",
        gradeHint: "Введите оценки через запятую:", calc: "Считать", calcTitle: "Мини-Калькулятор",
        flashcardTitle: "Флеш-карточки", next: "Дальше", quizTitle: "Mini-Quiz", restart: "Заново",
        aboutProjectTitle: "О проекте", techTitle: "Используемые технологии:", createdBy: "Создано для школьного проекта от",
        // Добавили переводы для виджета погоды
        weatherCity: "Дюссельдорф", weatherWind: "Ветер"
    }
};

let currentLang = localStorage.getItem('lang') || 'de';

function applyLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[lang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = i18n[lang][key];
            } else {
                el.innerText = i18n[lang][key];
            }
        }
    });
    const langSelect = document.getElementById('langSelect');
    if (langSelect) langSelect.value = lang;
    localStorage.setItem('lang', lang);
    
    // Перевызываем погоду при смене языка, чтобы подпись города перевелась сразу же
    fetchWeather();
}

const langSelectEl = document.getElementById('langSelect');
if (langSelectEl) {
    langSelectEl.addEventListener('change', (e) => {
        currentLang = e.target.value;
        applyLanguage(currentLang);
    });
}

// --- СМЕНА ТЕМЫ (Оформление) ---
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
if (themeToggle) themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.innerText = currentTheme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', currentTheme);
    });
}

// --- ЖИВЫЕ ЧАСЫ ---
if (document.getElementById('liveClock')) {
    setInterval(() => {
        const now = new Date();
        document.getElementById('liveClock').innerText = now.toLocaleTimeString();
        document.getElementById('liveDate').innerText = now.toLocaleDateString();
    }, 1000);
}

// --- СЧЕТЧИК ДНЕЙ ОБУЧЕНИЯ (Streak) ---
function updateStudyStreak() {
    const streakCountEl = document.getElementById('streakCount');
    if (!streakCountEl) return;
    
    let streak = parseInt(localStorage.getItem('studyStreak')) || 0;
    let lastDate = localStorage.getItem('lastStudyDate');
    const todayStr = new Date().toDateString();

    if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
            streak += 1;
            localStorage.setItem('studyStreak', streak);
            localStorage.setItem('lastStudyDate', todayStr);
        } else if (lastDate !== todayStr) {
            streak = 1;
            localStorage.setItem('studyStreak', streak);
            localStorage.setItem('lastStudyDate', todayStr);
        }
    } else {
        streak = 1;
        localStorage.setItem('studyStreak', streak);
        localStorage.setItem('lastStudyDate', todayStr);
    }
    streakCountEl.innerText = streak;
}

// --- ИСПРАВЛЕННЫЙ ВИДЖЕТ ПОГОДЫ (Дюссельдорф) ---
async function fetchWeather() {
    const weatherWidget = document.getElementById('weatherWidget');
    if (!weatherWidget) return;
    
    try {
        // Координаты Дюссельдорфа: latitude=51.22&longitude=6.77
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.22&longitude=6.77&current_weather=true');
        const data = await res.json();
        const temp = data.current_weather.temperature;
        const wind = data.current_weather.windspeed;
        
        // Текст берётся из словаря i18n в зависимости от выбранного языка
        const city = i18n[currentLang].weatherCity;
        const windLabel = i18n[currentLang].weatherWind;
        
        weatherWidget.innerHTML = `☀️ <strong>${temp}°C</strong> <br>💨 ${windLabel}: ${wind} km/h (${city})`;
    } catch (err) {
        weatherWidget.innerHTML = "Offline / Wetter nicht verfügbar";
    }
}

// --- ФАКТЫ И МОТИВАЦИЯ ---
const facts = [
    "Das erste Computer-Bug war eine echte Motte, die 1947 in einem Relais gefunden wurde.",
    "Ein Tag auf dem Venus dauert länger als ein ganzes Venusjahr.",
    "Mathematik-Wort 'Algorithmus' stammt vom Namen des persischen Gelehrten Al-Chwarizmi."
];
const quotes = [
    "“Success is the sum of small efforts repeated day in and day out.”",
    "“Der beste Weg, die Zukunft vorherzusagen, ist, sie zu erschaffen.”",
    "“Learning never exhausts the mind.”"
];

function initHomeWidgets() {
    if (document.getElementById('factText')) {
        const factBtn = document.getElementById('nextFactBtn');
        factBtn.addEventListener('click', () => {
            const randIdx = Math.floor(Math.random() * facts.length);
            document.getElementById('factText').innerText = facts[randIdx];
        });
        document.getElementById('quoteText').innerText = quotes[Math.floor(Math.random() * quotes.length)];
    }
}

// --- ТРЕКЕРЫ: TO-DO И ДЗ ТРЕКЕР ---
function initLists() {
    // 1. Логика списка задач To-Do
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    if (todoInput && addTodoBtn && todoList) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];

        function renderTodos() {
            todoList.innerHTML = '';
            todos.forEach((todo, idx) => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${todo}</span> <button class="btn danger" onclick="deleteTodo(${idx})">❌</button>`;
                todoList.appendChild(li);
            });
        }

        addTodoBtn.addEventListener('click', () => {
            if (todoInput.value.trim()) {
                todos.push(todoInput.value.trim());
                localStorage.setItem('todos', JSON.stringify(todos));
                todoInput.value = '';
                renderTodos();
            }
        });

        window.deleteTodo = (idx) => {
            todos.splice(idx, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        };

        renderTodos();
    }

    // 2. РАБОЧАЯ ЛОГИКА ДЛЯ ХАУСАУФГАБЕН-ТРЕКЕРА (ДЗ)
    const hwSubject = document.getElementById('hwSubject');
    const hwTask = document.getElementById('hwTask');
    const hwDate = document.getElementById('hwDate');
    const addHwBtn = document.getElementById('addHwBtn');
    const hwList = document.getElementById('hwList');

    if (hwSubject && hwTask && hwDate && addHwBtn && hwList) {
        let homeworks = JSON.parse(localStorage.getItem('homeworks')) || [];

        function renderHomeworks() {
            hwList.innerHTML = '';
            homeworks.forEach((hw, idx) => {
                const li = document.createElement('li');
                li.innerHTML = `<div><strong>[${hw.subject}]</strong> ${hw.task} <br><small>📅 ${hw.date}</small></div> 
                                <button class="btn danger" onclick="deleteHomework(${idx})">❌</button>`;
                hwList.appendChild(li);
            });
        }

        addHwBtn.addEventListener('click', () => {
            if (hwSubject.value.trim() && hwTask.value.trim() && hwDate.value) {
                const newHw = {
                    subject: hwSubject.value.trim(),
                    task: hwTask.value.trim(),
                    date: hwDate.value
                };
                homeworks.push(newHw);
                localStorage.setItem('homeworks', JSON.stringify(homeworks));
                
                // Очищаем поля ввода
                hwSubject.value = '';
                hwTask.value = '';
                hwDate.value = '';
                
                renderHomeworks();
            }
        });

        window.deleteHomework = (idx) => {
            homeworks.splice(idx, 1);
            localStorage.setItem('homeworks', JSON.stringify(homeworks));
            renderHomeworks();
        };

        renderHomeworks();
    }
}

// Запуск всех процессов при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    updateStudyStreak();
    fetchWeather();
    initHomeWidgets();
    initLists();
});

// --- РЕГИСТРАЦИЯ СЕРВИС-ВОРКЕРА ДЛЯ GITHUB PAGES ---
const repoName = window.location.pathname.split('/')[1];
const isGitHubPages = window.location.hostname.includes('github.io');
const swPath = isGitHubPages ? `/${repoName}/sw.js` : 'sw.js';
const swScope = isGitHubPages ? `/${repoName}/` : './';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swPath, { scope: swScope })
        .then(() => console.log("SW registered successfully for GitHub Pages"))
        .catch(err => console.log("SW error", err));
}