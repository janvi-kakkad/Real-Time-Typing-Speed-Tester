// Game State Module
const GameState = {
  timeLeft: 0,
  interval: null,
  currentQuote: "",
  isRunning: false,
  init() {
    this.timeLeft = 0;
    this.interval = null;
    this.currentQuote = "";
    this.isRunning = false;
  }
};

// Word Bank Module
const WordBank = {
  easy: [
    "the", "a", "an", "is", "are", "was", "were", "and", "to", "for", "with", "in", "on",
    "dog", "cat", "bird", "fish", "rabbit", "horse", "cow", "sheep", "run", "jump", "play", "eat", "sleep", "walk", "sit",
    "big", "small", "fast", "slow", "happy", "sad", "good", "bad", "pretty", "ugly", "house", "park", "garden", "field",
    "river", "mountain", "forest", "beach", "day", "night", "morning", "evening", "sun", "moon", "star", "cloud"
  ],
  medium: [
    "the", "a", "an", "is", "are", "was", "were", "and", "to", "for", "with", "in", "on", "at", "from",
    "boy", "girl", "man", "woman", "teacher", "student", "doctor", "nurse", "reads", "writes", "learns", "helps", "studies", "plays", "sings",
    "young", "old", "smart", "kind", "brave", "shy", "book", "school", "library", "hospital", "friend", "family", "neighbor", "village",
    "city", "street", "road", "bridge", "quickly", "slowly", "happily", "sadly", "carefully", "loudly", "quietly", "often"
  ],
  hard: [
    "the", "a", "an", "is", "are", "was", "were", "and", "to", "for", "with", "in", "on", "at", "through", "by",
    "engineer", "scientist", "doctor", "architect", "professor", "researcher", "designs", "develops", "analyzes", "innovates", "constructs", "researches", "implements",
    "sustainable", "advanced", "complex", "efficient", "innovative", "precise", "building", "technology", "system", "project", "environment", "solution", "infrastructure",
    "economy", "society", "culture", "education", "government", "policy", "strategy", "effectively", "efficiently", "creatively", "rigorously", "systematically"
  ]
};

// Quote Generator Module
const QuoteGenerator = {
  generate(difficulty) {
    const words = WordBank[difficulty] || WordBank.easy; // Fallback to easy if difficulty invalid
    if (!words || words.length === 0) {
      console.error("No words available for difficulty:", difficulty);
      return "Default sentence for testing.";
    }
    let sentence = "";
    let wordCount = 0;

    const subject = words[Math.floor(Math.random() * words.length)];
    sentence += subject.charAt(0).toUpperCase() + subject.slice(1);
    wordCount++;
    sentence += " ";
    const verb = words[Math.floor(Math.random() * words.length)];
    sentence += verb;
    wordCount++;

    if (Math.random() > 0.3) {
      sentence += " ";
      const complement = words[Math.floor(Math.random() * words.length)];
      sentence += complement;
      wordCount++;
    }

    const connectors = ["and", "but", "or", "while", "because"];
    while (wordCount < 100) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      sentence += " " + randomWord;
      wordCount++;
      if (wordCount % 5 === 0 && wordCount < 99 && Math.random() > 0.5) {
        const connector = connectors[Math.floor(Math.random() * connectors.length)];
        sentence += " " + connector;
        wordCount++;
      }
    }

    if (!/[.!?]$/.test(sentence)) sentence += ".";
    console.log("Generated quote:", sentence, "Length:", sentence.length, "Words:", wordCount);
    return sentence.trim();
  }
};

// Renderer Module
const Renderer = {
  quoteElement: document.getElementById("quote"),
  progressElement: document.getElementById("progress"),
  renderQuote(text) {
    console.log("Rendering quote attempt with text:", text);
    if (!this.quoteElement) {
      console.error("Quote element not found in DOM");
      return;
    }
    this.quoteElement.innerHTML = ""; // Clear existing content
    if (!text || text.length === 0) {
      this.quoteElement.textContent = "Error: No quote to display. Please try again.";
      console.error("Invalid quote text:", text);
      return;
    }
    this.quoteElement.textContent = text; // Use textContent for simplicity
    console.log("Quote rendered:", this.quoteElement.textContent);
  },
  updateProgress(percentage) {
    if (this.progressElement) {
      this.progressElement.style.width = `${percentage}%`;
    } else {
      console.error("Progress element not found");
    }
  }
};

// Stats Calculator Module
const StatsCalculator = {
  timerElement: document.getElementById("timer"),
  wpmElement: document.getElementById("wpm"),
  accuracyElement: document.getElementById("accuracy"),
  inputArea: document.getElementById("input-area"),
  calculateWPM() {
    const typedText = this.inputArea.value.trim();
    const originalText = GameState.currentQuote;
    const typedWords = typedText.split(/\s+/).filter(Boolean);
    const originalWords = originalText.split(/\s+/);
    let correctWords = 0;

    for (let i = 0; i < Math.min(typedWords.length, originalWords.length); i++) {
      if (typedWords[i] === originalWords[i]) {
        correctWords++;
      }
    }

    const duration = parseInt(document.getElementById("duration").value, 10);
    const timeSpent = duration - GameState.timeLeft;
    if (timeSpent > 0) {
      const wpm = duration === 30 ? 2 * correctWords : correctWords;
      this.wpmElement.textContent = wpm > 0 ? wpm : 0;
    }
  },
  calculateAccuracy() {
    const typedText = this.inputArea.value.trim();
    const originalText = GameState.currentQuote.trim();
    let correctChars = 0;
    const spans = Renderer.quoteElement.querySelectorAll("span:not(empty)");

    spans.forEach(span => {
      span.classList.remove("correct", "incorrect");
    });

    const minLength = Math.min(typedText.length, originalText.length);
    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === originalText[i]) {
        if (spans[i]) spans[i].classList.add("correct");
        correctChars++;
      } else {
        if (spans[i]) spans[i].classList.add("incorrect");
      }
    }

    const accuracy = typedText.length === 0 ? 100 : Math.round((correctChars / typedText.length) * 100);
    this.accuracyElement.innerHTML = accuracy + "<span style='font-size: 1.2rem;'>%</span>";

    console.log("Typed:", typedText);
    console.log("Original:", originalText.substring(0, minLength));
    console.log("Correct Chars:", correctChars, "Total Typed:", typedText.length, "Accuracy:", accuracy);
  }
};

// Game Controller Module
const GameController = {
  startBtn: document.getElementById("start"),
  restartBtn: document.getElementById("restart"),
  durationSelect: document.getElementById("duration"),
  difficultySelect: document.getElementById("difficulty"),
  inputArea: document.getElementById("input-area"),
  debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  loadNewQuote() {
    if (!this.difficultySelect) {
      console.error("Difficulty select not found");
      return;
    }
    console.log("Loading quote with difficulty:", this.difficultySelect.value);
    GameState.currentQuote = QuoteGenerator.generate(this.difficultySelect.value);
    if (!GameState.currentQuote || GameState.currentQuote.length === 0) {
      console.error("Quote generation failed, using default:", GameState.currentQuote);
      GameState.currentQuote = "Default test sentence. Please select a valid difficulty.";
    }
    console.log("Quote to render:", GameState.currentQuote);
    Renderer.renderQuote(GameState.currentQuote);
    this.inputArea.value = "";
    Renderer.updateProgress(0);
  },
  resetStats() {
    if (!StatsCalculator.timerElement || !StatsCalculator.wpmElement || !StatsCalculator.accuracyElement) {
      console.error("Stats elements not found");
      return;
    }
    console.log("Resetting stats");
    clearInterval(GameState.interval);
    StatsCalculator.timerElement.textContent = "0";
    StatsCalculator.wpmElement.textContent = "0";
    StatsCalculator.accuracyElement.innerHTML = "100<span style='font-size: 1.2rem;'>%</span>";
    GameState.isRunning = false;
    this.inputArea.disabled = true;
  },
  startGame() {
    if (!this.durationSelect) {
      console.error("Duration select not found");
      return;
    }
    console.log("Starting game with duration:", this.durationSelect.value);
    this.loadNewQuote();
    GameState.timeLeft = parseInt(this.durationSelect.value, 10);
    if (isNaN(GameState.timeLeft)) {
      console.error("Invalid duration value");
      return;
    }
    StatsCalculator.timerElement.textContent = GameState.timeLeft;
    this.inputArea.disabled = false;
    this.inputArea.focus();
    GameState.isRunning = true;
    clearInterval(GameState.interval);
    GameState.interval = setInterval(() => {
      GameState.timeLeft--;
      StatsCalculator.timerElement.textContent = GameState.timeLeft;
      StatsCalculator.calculateWPM();
      Renderer.updateProgress(((parseInt(this.durationSelect.value, 10) - GameState.timeLeft) / parseInt(this.durationSelect.value, 10)) * 100);
      if (GameState.timeLeft <= 0) {
        clearInterval(GameState.interval);
        this.inputArea.disabled = true;
        GameState.isRunning = false;
        const finalWPM = StatsCalculator.wpmElement.textContent;
        const finalAccuracy = this.inputArea.value.trim() === "" ? "100" : StatsCalculator.accuracyElement.textContent;
        alert(`Game Over! Your WPM: ${finalWPM}, Accuracy: ${finalAccuracy}`);
      }
    }, 1000);
  },
  init() {
    console.log("Initializing game controller");
    const elements = {
      startBtn: this.startBtn,
      restartBtn: this.restartBtn,
      durationSelect: this.durationSelect,
      difficultySelect: this.difficultySelect,
      inputArea: this.inputArea,
      quoteElement: Renderer.quoteElement,
      timerElement: StatsCalculator.timerElement,
      wpmElement: StatsCalculator.wpmElement,
      accuracyElement: StatsCalculator.accuracyElement,
      progressElement: Renderer.progressElement
    };
    for (let id in elements) {
      if (!elements[id]) {
        console.error(`${id} not found in DOM`);
      } else {
        console.log(`${id} found:`, elements[id]);
      }
    }

    this.startBtn.addEventListener("click", () => {
      console.log("Start button clicked");
      this.resetStats();
      this.startGame();
    });
    this.restartBtn.addEventListener("click", () => {
      console.log("Restart button clicked");
      this.resetStats();
      this.startGame();
    });
    this.inputArea.addEventListener("input", () => {
      if (GameState.isRunning) {
        StatsCalculator.calculateAccuracy();
        StatsCalculator.calculateWPM();
      }
    });

    // Disable paste in typing area (anti-cheat)
this.inputArea.addEventListener("paste", (e) => {
  e.preventDefault();
  alert("🚫 Pasting is disabled! Please type the text manually.");
});

    if (Renderer.quoteElement) {
      Renderer.quoteElement.textContent = "Click 'Start Blast' to begin!";
    } else {
      console.error("Cannot set initial message, quote element missing");
    }
  }
};

// Initialize the game
window.onload = () => {
  console.log("Window loaded, initializing game");
  GameController.init();
};