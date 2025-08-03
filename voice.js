// ==============================================
// SOFIA VOICE ASSISTANT - BEGINNER FRIENDLY VERSION
// Created by: Mohammad Kaif (Fixed & Improved)
// Description: A voice assistant that can respond to various commands
// ==============================================

// ==================== GLOBAL VARIABLES ====================
// These variables can be used anywhere in our code

let recognition; // This will hold our speech recognition object
let isListening = false; // Track if we're currently listening to user
let userData = null; // Store user's personal information
let globalWeatherData = null; // Store weather information

// ==================== DOM ELEMENTS ====================
// Get all the HTML elements we need to work with
// We'll get these when the page loads to avoid errors

let elements = {};

// ==================== APP INITIALIZATION ====================
// This runs when the webpage loads

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Starting SOFIA Voice Assistant...");

  // Get all DOM elements after page loads
  initializeElements();

  // Start the app
  initializeApp();
});

function initializeElements() {
  console.log("🔍 Finding HTML elements...");

  // Get all elements and store them safely
  elements = {
    // Loading and main screens
    loadingScreen: document.getElementById("loading-screen"),
    mainApp: document.getElementById("main-app"),
    setupModal: document.getElementById("setup-modal"),
    overlay: document.getElementById("overlay"),

    // Control buttons
    startBtn: document.getElementById("start-btn"),
    stopBtn: document.getElementById("stop-btn"),
    speakBtn: document.getElementById("speak-btn"),
    clearDataBtn: document.getElementById("clear-data-btn"),
    clearMessagesBtn: document.getElementById("clear-messages-btn"),

    // Display areas
    timeDisplay: document.getElementById("time-display"),
    dateDisplay: document.getElementById("date-display"),
    batteryLevel: document.getElementById("battery-level"),
    statusIndicator: document.getElementById("status-indicator"),
    connectionStatus: document.getElementById("connection-status"),
    statusMessage: document.getElementById("status-message"),
    userMessage: document.getElementById("user-message"),
    assistantMessage: document.getElementById("assistant-message"),
    assistantStatus: document.getElementById("assistant-status"),

    // Weather display elements
    location: document.getElementById("location"),
    country: document.getElementById("country"),
    weatherMain: document.getElementById("weather-main"),
    weatherDescription: document.getElementById("weather-description"),
    temperature: document.getElementById("temperature"),
    feelsLike: document.getElementById("feels-like"),
    minMaxTemp: document.getElementById("min-max-temp"),

    // System status elements
    voiceStatus: document.getElementById("voice-status"),
    speechStatus: document.getElementById("speech-status"),
    apiStatus: document.getElementById("api-status"),

    // Form elements
    setupForm: document.getElementById("setup-form"),
    userName: document.getElementById("user-name"),
    userLocation: document.getElementById("user-location"),
    userGithub: document.getElementById("user-github"),
    userLinkedin: document.getElementById("user-linkedin"),
  };

  console.log("✅ Elements initialized");
}

function initializeApp() {
  console.log("📋 Initializing application...");

  // Show loading screen for 2 seconds
  setTimeout(() => {
    try {
      // Hide loading screen and show main app
      if (elements.loadingScreen)
        elements.loadingScreen.classList.add("hidden");
      if (elements.mainApp) elements.mainApp.classList.remove("hidden");

      // Start all the important functions
      checkUserSetup();
      initializeSpeechRecognition();
      initializeEventListeners();
      updateDateTime();
      checkBattery();
      checkOnlineStatus();

      // Say welcome message
      speakWelcomeMessage();

      console.log("✅ App initialized successfully!");
    } catch (error) {
      console.error("❌ Error during initialization:", error);
      showError("Failed to initialize app. Please refresh the page.");
    }
  }, 2000);
}

// ==================== EVENT LISTENERS ====================
// Set up all button clicks and form submissions

function initializeEventListeners() {
  console.log("🎯 Setting up event listeners...");

  try {
    // Control buttons
    if (elements.startBtn) {
      elements.startBtn.addEventListener("click", startListening);
    }

    if (elements.stopBtn) {
      elements.stopBtn.addEventListener("click", stopListening);
    }

    if (elements.speakBtn) {
      elements.speakBtn.addEventListener("click", testSpeech);
    }

    if (elements.clearDataBtn) {
      elements.clearDataBtn.addEventListener("click", clearAllData);
    }

    if (elements.clearMessagesBtn) {
      elements.clearMessagesBtn.addEventListener("click", clearMessages);
    }

    // Setup form
    if (elements.setupForm) {
      elements.setupForm.addEventListener("submit", handleSetupSubmit);
    }

    console.log("✅ Event listeners set up successfully");
  } catch (error) {
    console.error("❌ Error setting up event listeners:", error);
  }
}

// ==================== USER SETUP FUNCTIONS ====================

function checkUserSetup() {
  console.log("👤 Checking user setup...");

  try {
    // Try to get saved user data from browser storage
    const savedData = localStorage.getItem("sofia_user_data");

    if (savedData) {
      userData = JSON.parse(savedData);
      console.log("✅ User data found:", userData.name);

      // Get weather for user's location
      getWeatherData(userData.location);

      // Update status
      updateAssistantStatus(`Welcome back, ${userData.name}!`);
    } else {
      console.log("❌ No user data found, showing setup...");
      showSetupModal();
    }
  } catch (error) {
    console.error("❌ Error checking user setup:", error);
    showSetupModal(); // Show setup if there's any error
  }
}

function showSetupModal() {
  console.log("📝 Showing setup modal...");

  try {
    if (elements.setupModal) elements.setupModal.classList.remove("hidden");
    if (elements.overlay) elements.overlay.classList.remove("hidden");
    // if (elements.mainApp) elements.mainApp.classList.add('blur');
  } catch (error) {
    console.error("❌ Error showing setup modal:", error);
  }
}

function hideSetupModal() {
  console.log("✅ Hiding setup modal...");

  try {
    if (elements.setupModal) elements.setupModal.classList.add("hidden");
    if (elements.overlay) elements.overlay.classList.add("hidden");
    if (elements.mainApp) elements.mainApp.classList.remove("blur");
  } catch (error) {
    console.error("❌ Error hiding setup modal:", error);
  }
}

function handleSetupSubmit(event) {
  event.preventDefault(); // Prevent form from refreshing page

  console.log("💾 Handling setup form submission...");

  try {
    // Get values from form inputs
    const name = elements.userName.value.trim();
    const location = elements.userLocation.value.trim();
    const github = elements.userGithub.value.trim();
    const linkedin = elements.userLinkedin.value.trim();

    // Check if required fields are filled
    if (!name || !location) {
      const errorMsg = "Please fill in your name and location.";
      alert(errorMsg);
      readOut(errorMsg);
      return;
    }

    // Create user data object
    userData = {
      name: name,
      location: location,
      github: github,
      linkedin: linkedin,
      setupDate: new Date().toISOString(),
    };

    // Save to browser storage
    localStorage.setItem("sofia_user_data", JSON.stringify(userData));

    // Hide setup form and get weather
    hideSetupModal();
    getWeatherData(location);

    // Welcome the user
    const welcomeMessage = `Welcome ${name}! Your profile has been set up successfully.`;
    updateAssistantMessage(welcomeMessage);
    updateAssistantStatus(welcomeMessage);
    readOut(welcomeMessage);

    console.log("✅ User data saved successfully!");
  } catch (error) {
    console.error("❌ Error saving user data:", error);
    showError("Failed to save user data. Please try again.");
  }
}

// ==================== SPEECH RECOGNITION SETUP ====================

function initializeSpeechRecognition() {
  console.log("🎤 Setting up speech recognition...");

  try {
    // Check if browser supports speech recognition
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.error("❌ Speech recognition not supported");
      updateStatusMessage("Speech recognition not supported", "error");
      updateSystemStatus("voice-status", "Not Supported", "error");
      return;
    }

    // Create speech recognition object
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    // Configure speech recognition settings
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    // Set up event handlers
    recognition.onstart = handleRecognitionStart;
    recognition.onresult = handleRecognitionResult;
    recognition.onend = handleRecognitionEnd;
    recognition.onerror = handleRecognitionError;

    updateSystemStatus("voice-status", "Ready", "success");
    console.log("✅ Speech recognition setup complete!");
  } catch (error) {
    console.error("❌ Error setting up speech recognition:", error);
    updateSystemStatus("voice-status", "Error", "error");
  }
}

function handleRecognitionStart() {
  console.log("🎤 Speech recognition started");
  isListening = true;
  updateStatusMessage("Listening...", "active");
  updateSystemStatus("voice-status", "Listening", "active");
  document.body.classList.add("listening");

  // Disable start button, enable stop button
  if (elements.startBtn) elements.startBtn.disabled = true;
  if (elements.stopBtn) elements.stopBtn.disabled = false;
}

function handleRecognitionResult(event) {
  try {
    // Get what the user said
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log("👤 User said:", transcript);

    // Show what user said on screen
    updateUserMessage(`"${transcript}"`);

    // Process the voice command
    processVoiceCommand(transcript);
  } catch (error) {
    console.error("❌ Error processing speech result:", error);
    showError("Error processing your speech. Please try again.");
  }
}

function handleRecognitionEnd() {
  console.log("🎤 Speech recognition ended");
  isListening = false;
  updateStatusMessage("Ready", "");
  updateSystemStatus("voice-status", "Ready", "success");
  document.body.classList.remove("listening");

  // Re-enable start button
  if (elements.startBtn) elements.startBtn.disabled = false;
  if (elements.stopBtn) elements.stopBtn.disabled = true;
}

function handleRecognitionError(event) {
  console.error("❌ Speech recognition error:", event.error);
  isListening = false;
  updateStatusMessage(`Error: ${event.error}`, "error");
  updateSystemStatus("voice-status", "Error", "error");
  document.body.classList.remove("listening");

  // Re-enable start button
  if (elements.startBtn) elements.startBtn.disabled = false;
  if (elements.stopBtn) elements.stopBtn.disabled = true;
}

// ==================== CONTROL FUNCTIONS ====================

function startListening() {
  console.log("▶️ Starting to listen...");

  if (!recognition) {
    showError("Speech recognition not available");
    return;
  }

  if (isListening) {
    console.log("⚠️ Already listening");
    return;
  }

  try {
    recognition.start();
  } catch (error) {
    console.error("❌ Error starting recognition:", error);
    showError("Failed to start listening. Please try again.");
  }
}

function stopListening() {
  console.log("⏹️ Stopping listening...");

  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch (error) {
      console.error("❌ Error stopping recognition:", error);
    }
  }
}

function testSpeech() {
  console.log("🔊 Testing speech...");

  const testMessage = userData
    ? `Hello ${userData.name}! Speech synthesis is working perfectly.`
    : "Hello! Speech synthesis is working perfectly.";

  readOut(testMessage);
}

function clearAllData() {
  console.log("🗑️ Clearing all data...");

  if (
    confirm("Are you sure you want to clear all data? This will reset SOFIA.")
  ) {
    try {
      // Clear localStorage
      localStorage.removeItem("sofia_user_data");

      // Reset global variables
      userData = null;
      globalWeatherData = null;

      // Clear messages
      clearMessages();

      // Reset weather display
      updateWeatherDisplay(null);

      // Show success message
      const message = "All data cleared successfully!";
      updateAssistantMessage(message);
      readOut(message);

      // Show setup modal again
      setTimeout(() => {
        showSetupModal();
      }, 2000);
    } catch (error) {
      console.error("❌ Error clearing data:", error);
      showError("Failed to clear data. Please try again.");
    }
  }
}

function clearMessages() {
  console.log("🧹 Clearing messages...");

  try {
    updateUserMessage("Waiting for input...");
    updateAssistantMessage("Ready to assist you");
    updateAssistantStatus("I am your AI assistant. How can I help you today?");
  } catch (error) {
    console.error("❌ Error clearing messages:", error);
  }
}

// ==================== VOICE COMMAND PROCESSING ====================

function processVoiceCommand(transcript) {
  console.log("🧠 Processing command:", transcript);

  let responseMessage = "";
  let commandRecognized = false;

  try {
    // ========== GREETING COMMANDS ==========
    if (transcript.includes("hello") || transcript.includes("hi")) {
      commandRecognized = true;
      responseMessage = userData
        ? `Hello ${userData.name}! I'm SOFIA, how can I assist you today?`
        : "Hello! I'm SOFIA, your voice assistant. How can I help you?";
    }

    // ========== NAME COMMANDS ==========
    else if (transcript.includes("your name")) {
      commandRecognized = true;
      responseMessage = "My name is SOFIA, your intelligent voice assistant.";
    } else if (transcript.includes("my name")) {
      commandRecognized = true;
      responseMessage = userData
        ? `Your name is ${userData.name}`
        : "I don't have your name saved. Please set up your profile.";
    }

    // ========== CREATOR COMMANDS ==========
    else if (
      transcript.includes("created you") ||
      transcript.includes("who made you")
    ) {
      commandRecognized = true;
      responseMessage =
        "Mohammad Kaif created me using JavaScript, HTML, and CSS with Speech Recognition API.";
    }

    // ========== TIME COMMANDS ==========
    else if (transcript.includes("time")) {
      commandRecognized = true;
      const currentTime = new Date().toLocaleTimeString();
      responseMessage = `The current time is ${currentTime}`;
    }

    // ========== DATE COMMANDS ==========
    else if (transcript.includes("date") || transcript.includes("today")) {
      commandRecognized = true;
      const currentDate = new Date().toDateString();
      responseMessage = `Today's date is ${currentDate}`;

      //------------help command-----------------------/////
    } else if (transcript.includes("help")) {
      commandRecognized = true;

      const pdfUrl =
        "https://docs.google.com/document/d/1eKjCMQC7GhpHI_R3s6fpjUzxooZRtVozdKstDiY3oes/view?usp=sharing";

      try {
        const newWindow = window.open(pdfUrl, "_blank");
        if (!newWindow) {
          responseMessage = "Please allow pop-ups for this site and try again.";
        } else {
          responseMessage = "Opening the help document for you.";
        }
      } catch (error) {
        responseMessage =
          "Could not open the help document. Please check your browser settings.";
      }
    }

    // ========== WEATHER COMMANDS ==========
    else if (transcript.includes("weather")) {
      commandRecognized = true;
      if (globalWeatherData) {
        const temp = kelvinToCelsius(globalWeatherData.main.temp);
        const feelsLike = kelvinToCelsius(globalWeatherData.main.feels_like);
        responseMessage = `Today's weather in ${globalWeatherData.name}: ${globalWeatherData.weather[0].description}, temperature ${temp}°C, feels like ${feelsLike}°C.`;
      } else {
        responseMessage =
          "Sorry, I cannot fetch the weather data at the moment. Please try again.";
        // Try to get weather again
        if (userData && userData.location) {
          getWeatherData(userData.location);
        }
      }
    }

    // ========== WEBSITE OPENING COMMANDS ==========
    else if (transcript.includes("open youtube")) {
      commandRecognized = true;
      responseMessage = "Opening YouTube for you.";
      safeOpenWindow("https://www.youtube.com/");
    } else if (transcript.includes("open google")) {
      commandRecognized = true;
      responseMessage = "Opening Google for you.";
      safeOpenWindow("https://www.google.com/");
    } else if (transcript.includes("open github")) {
      commandRecognized = true;
      responseMessage = "Opening GitHub for you.";
      safeOpenWindow("https://github.com/");
    } else if (transcript.includes("open linkedin")) {
      commandRecognized = true;
      responseMessage = "Opening LinkedIn for you.";
      safeOpenWindow("https://www.linkedin.com/");
    } else if (transcript.includes("open gmail")) {
      commandRecognized = true;
      responseMessage = "Opening Gmail for you.";
      safeOpenWindow("https://mail.google.com/");
    }

    // ========== SEARCH COMMANDS ==========
    else if (transcript.includes("search for")) {
      commandRecognized = true;
      const searchQuery = transcript.replace("search for", "").trim();
      if (searchQuery) {
        responseMessage = `Searching for ${searchQuery}`;
        safeOpenWindow(
          `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
        );
      } else {
        responseMessage = "Please specify what you want to search for.";
      }
    }

    // ========== MATH COMMANDS ==========
    else if (transcript.includes("add") || transcript.includes("plus")) {
      commandRecognized = true;
      responseMessage = performAddition(transcript);
    } else if (
      transcript.includes("subtract") ||
      transcript.includes("minus")
    ) {
      commandRecognized = true;
      responseMessage = performSubtraction(transcript);
    } else if (transcript.includes("multiply")) {
      commandRecognized = true;
      responseMessage = performMultiplication(transcript);
    } else if (transcript.includes("divide")) {
      commandRecognized = true;
      responseMessage = performDivision(transcript);
    }

    // ========== ENTERTAINMENT COMMANDS ==========
    else if (transcript.includes("joke")) {
      commandRecognized = true;
      getRandomJoke();
      return; // Exit early as joke function handles response
    }

    // ========== DEFAULT RESPONSE ==========
    if (!commandRecognized) {
      responseMessage =
        'Sorry, I didn\'t understand that command. Try saying "Hello", "What\'s the time?", or "Open Google".';
    }

    // Update UI and speak response
    updateAssistantMessage(responseMessage);
    readOut(responseMessage);

    console.log("✅ Command processed:", responseMessage);
  } catch (error) {
    console.error("❌ Error processing voice command:", error);
    const errorMsg = "Sorry, there was an error processing your command.";
    updateAssistantMessage(errorMsg);
    readOut(errorMsg);
  }
}

// ==================== MATH FUNCTIONS ====================

function extractNumbers(text) {
  // Find all numbers in the text
  const matches = text.match(/\d+\.?\d*/g);
  return matches ? matches.map(Number) : [];
}

function performAddition(transcript) {
  console.log("➕ Performing addition...");

  try {
    const numbers = extractNumbers(transcript);
    if (numbers.length < 2) {
      return "Please provide at least two numbers to add.";
    }

    const result = numbers.reduce((sum, num) => sum + num, 0);
    return `${numbers.join(" plus ")} equals ${result}`;
  } catch (error) {
    console.error("❌ Error in addition:", error);
    return "Sorry, I couldn't perform that calculation.";
  }
}

function performSubtraction(transcript) {
  console.log("➖ Performing subtraction...");

  try {
    const numbers = extractNumbers(transcript);
    if (numbers.length < 2) {
      return "Please provide at least two numbers to subtract.";
    }

    let result = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      result -= numbers[i];
    }

    return `${numbers[0]} minus ${numbers
      .slice(1)
      .join(" minus ")} equals ${result}`;
  } catch (error) {
    console.error("❌ Error in subtraction:", error);
    return "Sorry, I couldn't perform that calculation.";
  }
}

function performMultiplication(transcript) {
  console.log("✖️ Performing multiplication...");

  try {
    const numbers = extractNumbers(transcript);
    if (numbers.length < 2) {
      return "Please provide at least two numbers to multiply.";
    }

    const result = numbers.reduce((product, num) => product * num, 1);
    return `${numbers.join(" times ")} equals ${result}`;
  } catch (error) {
    console.error("❌ Error in multiplication:", error);
    return "Sorry, I couldn't perform that calculation.";
  }
}

function performDivision(transcript) {
  console.log("➗ Performing division...");

  try {
    const numbers = extractNumbers(transcript);
    if (numbers.length < 2) {
      return "Please provide at least two numbers to divide.";
    }

    if (numbers[1] === 0) {
      return "Cannot divide by zero!";
    }

    const result = (numbers[0] / numbers[1]).toFixed(2);
    return `${numbers[0]} divided by ${numbers[1]} equals ${result}`;
  } catch (error) {
    console.error("❌ Error in division:", error);
    return "Sorry, I couldn't perform that calculation.";
  }
}

// ==================== API FUNCTIONS ====================

async function getRandomJoke() {
  console.log("😄 Getting a joke...");

  try {
    updateAssistantMessage("Let me find a joke for you...");

    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch joke");
    }

    const joke = await response.json();
    const jokeText = `${joke.setup} ${joke.punchline}`;

    updateAssistantMessage(jokeText);
    readOut(jokeText);

    // Add a laugh after the joke
    setTimeout(() => {
      readOut("That was funny!");
    }, 3000);
  } catch (error) {
    console.error("❌ Error getting joke:", error);
    const errorMessage =
      "Sorry, I couldn't get a joke right now. Please try again later.";
    updateAssistantMessage(errorMessage);
    readOut(errorMessage);
  }
}

async function getWeatherData(location) {
  console.log("🌤️ Getting weather data for:", location);

  try {
    // Using a free weather API that works with HTTPS
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=demo&units=metric`
    );

    if (response.ok) {
      const data = await response.json();
      globalWeatherData = data;
      updateWeatherDisplay(data);
      console.log("✅ Weather data loaded successfully");
    } else {
      throw new Error("Weather data not found");
    }
  } catch (error) {
    console.error("❌ Error fetching weather:", error);

    // Create dummy weather data for demo
    const dummyData = {
      name: location,
      sys: { country: "Demo" },
      main: {
        temp: 22,
        feels_like: 25,
        temp_min: 18,
        temp_max: 28,
        humidity: 65,
      },
      weather: [
        {
          main: "Clear",
          description: "clear sky",
        },
      ],
    };

    globalWeatherData = dummyData;
    updateWeatherDisplay(dummyData);
    console.log("⚠️ Using demo weather data");
  }
}

function updateWeatherDisplay(data) {
  try {
    if (data && elements.location) {
      // Update weather display elements
      if (elements.location) elements.location.textContent = data.name;
      if (elements.country) elements.country.textContent = data.sys.country;
      if (elements.weatherMain)
        elements.weatherMain.textContent = data.weather[0].main;
      if (elements.weatherDescription)
        elements.weatherDescription.textContent = data.weather[0].description;
      if (elements.temperature)
        elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
      if (elements.feelsLike)
        elements.feelsLike.textContent = `${Math.round(
          data.main.feels_like
        )}°C`;
      if (elements.minMaxTemp)
        elements.minMaxTemp.textContent = `${Math.round(
          data.main.temp_min
        )}°C / ${Math.round(data.main.temp_max)}°C`;

      console.log("✅ Weather display updated");
    } else {
      // Show error state
      if (elements.location)
        elements.location.textContent = "Location not found";
      if (elements.country) elements.country.textContent = "--";
      if (elements.weatherMain) elements.weatherMain.textContent = "--";
      if (elements.weatherDescription)
        elements.weatherDescription.textContent = "--";
      if (elements.temperature) elements.temperature.textContent = "--°C";
      if (elements.feelsLike) elements.feelsLike.textContent = "--°C";
      if (elements.minMaxTemp) elements.minMaxTemp.textContent = "--°C / --°C";

      console.log("❌ Weather display shows error state");
    }
  } catch (error) {
    console.error("❌ Error updating weather display:", error);
  }
}

function kelvinToCelsius(kelvin) {
  // Convert temperature from Kelvin to Celsius
  return Math.round(kelvin - 273.15);
}

// ==================== TEXT-TO-SPEECH FUNCTION ====================

function readOut(message) {
  console.log("🔊 Speaking:", message);

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create speech utterance
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 0.9;
    speech.pitch = 1;

    // Set voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.name.includes("Google") ||
        voice.name.includes("Microsoft") ||
        voice.lang === "en-US"
    );

    if (preferredVoice) {
      speech.voice = preferredVoice;
    }

    // Update speech status
    updateSystemStatus("speech-status", "Speaking", "active");

    // Handle speech events
    speech.onstart = () => {
      updateSystemStatus("speech-status", "Speaking", "active");
    };

    speech.onend = () => {
      updateSystemStatus("speech-status", "Ready", "success");
    };

    speech.onerror = (error) => {
      console.error("❌ Speech error:", error);
      updateSystemStatus("speech-status", "Error", "error");
    };

    // Speak the message
    window.speechSynthesis.speak(speech);
  } catch (error) {
    console.error("❌ Error in text-to-speech:", error);
    updateSystemStatus("speech-status", "Error", "error");
  }
}

function speakWelcomeMessage() {
  console.log("👋 Speaking welcome message...");

  const welcomeMsg = userData
    ? `Welcome back, ${userData.name}! SOFIA is ready to assist you.`
    : "Welcome to SOFIA! Please complete the setup to get started.";

  // Delay welcome message to let page load
  setTimeout(() => {
    readOut(welcomeMsg);
  }, 1000);
}

// ==================== UI UPDATE FUNCTIONS ====================

function updateStatusMessage(message, type = "") {
  try {
    if (elements.statusMessage) {
      elements.statusMessage.textContent = message;

      // Remove all existing classes
      elements.statusMessage.className = "status-message";

      // Add new class if specified
      if (type) {
        elements.statusMessage.classList.add(type);
      }
    }

    console.log("📢 Status updated:", message);
  } catch (error) {
    console.error("❌ Error updating status message:", error);
  }
}

function updateUserMessage(message) {
  try {
    if (elements.userMessage) {
      elements.userMessage.textContent = message;
    }
    console.log("👤 User message updated:", message);
  } catch (error) {
    console.error("❌ Error updating user message:", error);
  }
}

function updateAssistantMessage(message) {
  try {
    if (elements.assistantMessage) {
      elements.assistantMessage.textContent = message;
    }
    console.log("🤖 Assistant message updated:", message);
  } catch (error) {
    console.error("❌ Error updating assistant message:", error);
  }
}

function updateAssistantStatus(message) {
  try {
    if (elements.assistantStatus) {
      elements.assistantStatus.textContent = message;
    }
    console.log("📢 Assistant status updated:", message);
  } catch (error) {
    console.error("❌ Error updating assistant status:", error);
  }
}

function updateSystemStatus(elementId, status, type = "success") {
  try {
    const element =
      elements[elementId.replace("-", "").replace("status", "Status")];
    if (element) {
      element.textContent = status;

      // Remove existing classes
      element.className = "stat-value";

      // Add status class
      if (type === "error") {
        element.classList.add("error");
      } else if (type === "active") {
        element.style.color = "#feca57";
      } else {
        element.style.color = "#22c55e";
      }
    }
  } catch (error) {
    console.error("❌ Error updating system status:", error);
  }
}

function showError(message) {
  console.error("🚨 Showing error:", message);
  updateStatusMessage(message, "error");
  updateAssistantMessage(`Error: ${message}`);
  readOut(message);
}

// ==================== UTILITY FUNCTIONS ====================

function safeOpenWindow(url) {
  try {
    window.open(url, "_blank");
    console.log("🌐 Opened URL:", url);
  } catch (error) {
    console.error("❌ Error opening window:", error);
    showError("Failed to open website. Please check your browser settings.");
  }
}

function updateDateTime() {
  console.log("🕒 Starting date/time updates...");

  function update() {
    try {
      const now = new Date();

      if (elements.timeDisplay) {
        elements.timeDisplay.textContent = now.toLocaleTimeString();
      }

      if (elements.dateDisplay) {
        elements.dateDisplay.textContent = now.toDateString();
      }
    } catch (error) {
      console.error("❌ Error updating date/time:", error);
    }
  }

  // Update immediately and then every second
  update();
  setInterval(update, 1000);
}

async function checkBattery() {
  console.log("🔋 Checking battery status...");

  try {
    if ("getBattery" in navigator) {
      const battery = await navigator.getBattery();
      const level = Math.round(battery.level * 100);

      if (elements.batteryLevel) {
        elements.batteryLevel.textContent = `${level}%`;
      }

      console.log("✅ Battery level:", level + "%");
    } else {
      if (elements.batteryLevel) {
        elements.batteryLevel.textContent = "N/A";
      }
      console.log("⚠️ Battery API not supported");
    }
  } catch (error) {
    console.error("❌ Error checking battery:", error);
    if (elements.batteryLevel) {
      elements.batteryLevel.textContent = "Error";
    }
  }
}

function checkOnlineStatus() {
  console.log("🌐 Checking online status...");

  function updateOnlineStatus() {
    try {
      const isOnline = navigator.onLine;

      if (elements.statusIndicator) {
        elements.statusIndicator.className = isOnline
          ? "status-indicator"
          : "status-indicator offline";
      }

      if (elements.connectionStatus) {
        elements.connectionStatus.textContent = isOnline ? "Online" : "Offline";
      }

      updateSystemStatus(
        "api-status",
        isOnline ? "Connected" : "Disconnected",
        isOnline ? "success" : "error"
      );

      console.log("🌐 Online status:", isOnline ? "Online" : "Offline");
    } catch (error) {
      console.error("❌ Error updating online status:", error);
    }
  }

  // Update immediately
  updateOnlineStatus();

  // Listen for online/offline events
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
}

// ==================== ERROR HANDLING ====================

window.addEventListener("error", function (event) {
  console.error("🚨 Global error caught:", event.error);
  showError(
    "An unexpected error occurred. Please refresh the page if problems persist."
  );
});

window.addEventListener("unhandledrejection", function (event) {
  console.error("🚨 Unhandled promise rejection:", event.reason);
  showError("A network error occurred. Please check your connection.");
});

// ==================== INITIALIZATION CHECK ====================

// Make sure everything loads properly
window.addEventListener("load", function () {
  console.log("✅ Page fully loaded");

  // Double-check critical elements exist
  if (!document.getElementById("main-app")) {
    console.error("❌ Critical elements missing");
    document.body.innerHTML =
      '<div style="color: white; text-align: center; padding: 50px;">Error: Page not loaded correctly. Please refresh.</div>';
  }
});

console.log("📄 SOFIA JavaScript loaded successfully!");
