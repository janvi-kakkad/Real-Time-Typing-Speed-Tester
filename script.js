const TypingGame = {
  // DOM Elements
  quoteElement: document.getElementById("quote"),
  inputArea: document.getElementById("input-area"),
  timerElement: document.getElementById("timer"),
  wpmElement: document.getElementById("wpm"),
  accuracyElement: document.getElementById("accuracy"),
  progressElement: document.getElementById("progress"),
  durationSelect: document.getElementById("duration"),
  difficultySelect: document.getElementById("difficulty"),
  startBtn: document.getElementById("start"),
  restartBtn: document.getElementById("restart"),

  // Game State
  timeLeft: 0,
  interval: null,
  currentQuote: "",
  isRunning: false,

  wordBank: {
    easy: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "dog", "cat", "sun", "run", "big", "red", "day", "is"],
    medium: ["people", "history", "way", "art", "world", "information", "family", "government", "health", "system", "computer", "music", "person", "theory", "thanks", "method", "problem", "knowledge"],
    hard: ["epistemology", "ontological", "juxtaposition", "ubiquitous", "serendipity", "perspicacious", "idiosyncratic", "unfathomable", "exacerbate", "quintessential", "magnanimous", "pulchritudinous"]
  },

  generateQuote() {
    const difficulty = this.difficultySelect.value;
    const words = this.wordBank[difficulty] || this.wordBank.easy;
    let quote = "";
    const quoteLength = difficulty === 'hard' ? 50 : 80;
    for (let i = 0; i < quoteLength; i++) {
      quote += words[Math.floor(Math.random() * words.length)] + " ";
    }
    this.currentQuote = quote.trim() + ".";
    this.renderQuote();
  },

  renderQuote() {
    this.quoteElement.innerHTML = "";
    this.currentQuote.split('').forEach(char => {
      const span = document.createElement('span');
      span.innerText = char;
      this.quoteElement.appendChild(span);
    });
  },

  updateStats() {
    const typedText = this.inputArea.value;
    const quoteSpans = this.quoteElement.querySelectorAll("span");
    let correctChars = 0;

    // Accuracy Calculation and Highlighting
    quoteSpans.forEach((span, index) => {
      if (typedText[index] == null) {
        span.className = "";
      } else if (typedText[index] === span.innerText) {
        span.className = "correct";
        correctChars++;
      } else {
        span.className = "incorrect";
      }
    });
    const accuracy = typedText.length === 0 ? 100 : Math.round((correctChars / typedText.length) * 100);
    this.accuracyElement.innerHTML = `${accuracy}<span style='font-size: 1.2rem;'>%</span>`;

    // WPM Calculation
    const duration = parseInt(this.durationSelect.value, 10);
    const timeSpent = duration - this.timeLeft;
    if (timeSpent > 0) {
      const correctWords = typedText.trim().split(/\s+/).filter((word, i) => word === this.currentQuote.split(/\s+/)[i]).length;
      const wpm = Math.round((correctWords / timeSpent) * 60);
      this.wpmElement.textContent = wpm > 0 ? wpm : 0;
    }
  },

  reset() {
    clearInterval(this.interval);
    this.isRunning = false;
    this.timeLeft = 0;
    this.inputArea.value = "";
    this.inputArea.disabled = true;
    this.timerElement.textContent = "0";
    this.wpmElement.textContent = "0";
    this.accuracyElement.innerHTML = "100<span style='font-size: 1.2rem;'>%</span>";
    this.progressElement.style.width = "0%";
    this.quoteElement.textContent = "Click 'Start Blast' to begin!";
  },

  start() {
    this.reset();
    this.isRunning = true;
    this.inputArea.disabled = false;
    this.timeLeft = parseInt(this.durationSelect.value, 10);
    this.timerElement.textContent = this.timeLeft;
    this.generateQuote();
    this.inputArea.focus();

    this.interval = setInterval(() => {
      this.timeLeft--;
      this.timerElement.textContent = this.timeLeft;
      const duration = parseInt(this.durationSelect.value, 10);
      this.progressElement.style.width = `${((duration - this.timeLeft) / duration) * 100}%`;

      if (this.timeLeft <= 0) {
        clearInterval(this.interval);
        this.isRunning = false;
        this.inputArea.disabled = true;
        alert(`Game Over!\nYour WPM: ${this.wpmElement.textContent}\nAccuracy: ${this.accuracyElement.textContent}`);
      }
    }, 1000);
  },

  init() {
    [this.startBtn, this.restartBtn].forEach(btn => btn.addEventListener("click", () => this.start()));
    this.inputArea.addEventListener("input", () => this.updateStats());
    this.inputArea.addEventListener("paste", e => e.preventDefault());
    this.reset();
  }
};

window.onload = () => TypingGame.init();