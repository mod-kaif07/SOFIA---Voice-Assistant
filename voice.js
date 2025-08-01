const start_btn = document.querySelector("#start");
const stop_btn = document.querySelector("#stop");
const speak_btn = document.querySelector("#speak");
const location_btn = document.querySelector(".loc");
const message_print = document.querySelector(".message_print");
const message_nexa = document.querySelector(".nexavoice");
const alering_message = document.querySelector(".alrting");
const animate = document.querySelector(".googleassist");
const battry_display = document.querySelector(".battery");
const holemessage = document.querySelector("hole_message");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
let userData;
// Nexa start
recognition.onstart = function () {
  alering_message.innerHTML = ` SOFIA  is activated`;
  alering_message.style.color = "red";
  console.log("NEXA is activated");
};
let batteryPromise = navigator.getBattery().then(batteryCallback);

function batteryCallback(batteryObject) {
  setInterval(() => {
    printBatteryStatus(batteryObject);
  }, 1000); // Set an interval time in milliseconds (e.g., 1000ms = 1 second)
}

function printBatteryStatus(battery) {
  let batteryLevel = Math.floor(battery.level * 100); // Converts to integer
  // console.log("Battery level: " + batteryLevel + "%");

  battry_display.innerHTML = `${batteryLevel}% ${
    battery.charging ? "⚡️" : ""
  }`;

  // console.log("Charging: " + battery.charging);
}

let onlineDisplay = document.querySelector(".online");
function checkOnlineStatus() {
  if (navigator.onLine) {
    onlineDisplay.innerHTML = "Online🚀";
    // readOut("You're online.");
    onlineDisplay.style.color = "limegreen";
  } else {
    onlineDisplay.innerHTML = "Offline📴";
    readOut("Oops! You're offline.");
    onlineDisplay.style.color = "tomato";
  }
}

checkOnlineStatus();
window.addEventListener("online", checkOnlineStatus);
window.addEventListener("offline", checkOnlineStatus);

// Function to fetch weather data
function weather(location) {
  const weatherCont = document.querySelector(".temp").querySelectorAll("*");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=48ddfe8c9cf29f95b7d0e54d6e171008`;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (this.status === 200) {
      let data = JSON.parse(this.responseText);
      globalWeatherData = data; // Store weather data globally
      weatherCont[0].textContent = `Location: ${data.name}`;
      weatherCont[1].textContent = `Country: ${data.sys.country}`;
      weatherCont[2].textContent = `Weather Type: ${data.weather[0].main}`;
      weatherCont[3].textContent = `Description: ${data.weather[0].description}`;
      weatherCont[4].textContent = `Original Temp: ${ktc(data.main.temp)}`;
      weatherCont[5].textContent = `Feels-Like: ${ktc(data.main.feels_like)}`;
      weatherCont[6].textContent = `Min Temp: ${ktc(data.main.temp_min)}`;
      weatherCont[7].textContent = `Max Temp: ${ktc(data.main.temp_max)}`;
      // weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      weatherStatement = `Sir, the weather in ${data.name} is ${
        data.weather[0].description
      }, and the temperature feels like ${ktc(data.main.feels_like)}°C.`;
    } else {
      weatherCont[0].textContent = "Weather Info Not Found";
      globalWeatherData = null; // Reset global weather data if fetch fails
    }
  };
  xhr.send();
}

// convert kelvin to celcius
function ktc(k) {
  k = k - 273.15;
  return k.toFixed(2);
}

// Check if jarvis_setup data exists in localStorage
if (localStorage.getItem("jarvis_setup") !== null) {
  const savedSetup = JSON.parse(localStorage.getItem("jarvis_setup"));
  weather(savedSetup.location); // Call the weather function with saved location
}

const setupDiv = document.querySelector(".jarvi_setup_in_middle");
setupDiv.style.display = "none";

// If no jarvis_setup in localStorage, show setup form
if (localStorage.getItem("jarvis_setup") === null) {
  setupDiv.style.display = "block";

  // Add event listener to the submit button
  setupDiv.querySelector("button").addEventListener("click", userinfo);
}

function userinfo() {
  const inputs = setupDiv.querySelectorAll("input");

  // Collect user input data
  const setupInfo = {
    name: inputs[0].value.trim(),
    location: inputs[1].value.trim(),
    github: inputs[2].value.trim(),
    linkedin: inputs[3].value.trim(),
  };

  // Check if any field is empty
  const testArr = Array.from(inputs).map((input) => input.value.trim());
  if (testArr.includes("")) {
    readOut("Please fill all the details");
    alert("Please fill all the details");
  } else {
    // Save data to localStorage
    localStorage.clear();
    localStorage.setItem("jarvis_setup", JSON.stringify(setupInfo));

    // Hide setup form and call weather function
    setupDiv.style.display = "none";
    weather(setupInfo.location);
  }
}

// Function for text-to-speech
function readOut(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US"; // Set language for speech synthesis
  window.speechSynthesis.speak(speech);
}

// Nexa result
let transcript = " ";
recognition.onresult = function (event) {
  let current = event.resultIndex;
  transcript = event.results[current][0].transcript;

  // Normalize input: remove extra spaces and convert to lowercase
  transcript = transcript.trim().toLowerCase();
  message_print.innerHTML = `MY words:- ${transcript}`;
  message_print.style.color = "#FFD700";
  console.log(`MY words : ${transcript}`);

  let iscommandsreconize = false;

  // Command Handlers
  if (transcript.includes("hello")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- Hello, sir! I am SOFIA, How can I assist you?`;
    readOut("Hello, sir! I am SOFIA, How can I assist you?");
  }
  if (transcript.includes("my name")) {
    iscommandsreconize = true;
    let storedData = localStorage.getItem("jarvis_setup"); // Get the stored JSON string
    userData = storedData ? JSON.parse(storedData) : null; // Parse it into an object

    if (userData && userData.name) {
      message_nexa.innerHTML = `SOFIA voice:- Hello ${userData.name}, nice to meet you`;
      readOut(`Hello ${userData.name}, nice to meet you`);
    } else {
      message_nexa.innerHTML = `SOFIA voice:- Local Storage is Empty`;
      readOut(`Local Storage is Empty`);
    }
  }

  if (transcript.includes("your name")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- My name is SOFIA `;
    readOut("My name is SOFIA");
  }

  if (transcript.includes("open chat gpt")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- Opening ChatGPT, sir`;
    readOut("Opening ChatGPT, sir");
    window.open("https://chat.openai.com/");
  }

  if (transcript.includes("created you")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- Mohammad Kaif`;
    readOut("Mohammad Kaif");
  }

  if (transcript.includes("programming language used")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- "I am built in JavaScript, using Speech Recognition and Speech Synthesis API. HTML and CSS are used to style my user interface, and I fetch weather information from the OpenWeatherMap API.".`;
    readOut(
      "I am built in JavaScript, using Speech Recognition and Speech Synthesis API. HTML and CSS are used to style my user interface, and I fetch weather information from the OpenWeatherMap API."
    );
  }

  if (transcript.includes("saif") || transcript.includes("safe")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- saaif you have to work hard and get into the IIT , so work hard , stay focused`;
    readOut(
      "saaif you have to work hard and get into the IIT , so work hard , stay focused"
    );
  }

  if (transcript.includes("open youtube")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- Opening YouTube, sir`;
    readOut("Opening YouTube, sir");
    window.open("https://www.youtube.com/");
  }

  if (transcript.includes("open amazon")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- Opening amazon, sir`;
    readOut("Opening Amazon, sir");
    window.open("https://www.amazon.in/");
  }

  if (transcript.includes("open wikipedia")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- Sure, sir! Let me fetch the information for you on Wikipedia.`;
    readOut("Sure, sir! Let me fetch the information for you on Wikipedia.");

    // Extract the topic after "open wikipedia"
    let searchQuery = transcript.replace("open wikipedia", "").trim(); // Remove the trigger phrase
    if (searchQuery) {
      let wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
        searchQuery
      )}`; // Encode the query for a valid URL
      window.open(wikiUrl, "_blank"); // Open the Wikipedia page in a new tab
    } else {
      readOut("Please specify what you want to search on Wikipedia.");
      message_nexa.innerHTML = `SOFIA voice :- Please specify what you want to search on Wikipedia.`;
    }
  }

  if (transcript.includes("open flipkart")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening the filpkart`;
    readOut("Opening Flipkart, sir");
    window.open("https://www.flipkart.com/");
  }
  if (transcript.includes("your command")) {
    iscommandsreconize = true;

    message_nexa.innerHTML = `📜 SOFIA voice :- Opening the command PDF...`;
    readOut("Opening Command PDF, sir.");

    // Open the command guide in a new tab
    window.open(
      "https://docs.google.com/document/d/1eKjCMQC7GhpHI_R3s6fpjUzxooZRtVozdKstDiY3oes/edit?usp=sharing",
      "_blank"
    );
  }

  if (transcript.includes("open google")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening the Google`;
    readOut("Opening Google, sir");
    window.open("https://www.google.com/");
  }

  if (
    transcript.includes("firebase") ||
    transcript.includes("open fire base")
  ) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening the firebase`;
    readOut("Opening Firebase, sir");
    window.open("https://firebase.google.com/");
  }

  if (transcript.includes("open gmail")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening the gmail`;
    readOut("Opening Gmail, sir");
    window.open("https://workspace.google.com/");
  }

  if (transcript.includes("open linkedin")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening the Linkdin`;
    readOut("Opening LinkedIn, sir");
    window.open("https://in.linkedin.com/");
  }
  if (transcript.includes("open github")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening the github`;
    readOut("Opening Github, sir");
    window.open("https://github.com/");
  }

  if (transcript.includes("open my linkedin")) {
    iscommandsreconize = true;
    message_nexa.innerHTML = `SOFIA voice :- opening your linkedin account`;
    readOut("Opening your personal account, sir");
    window.open("https://www.linkedin.com/in/mohammad-kaif-9a0bb6284/");
  }

  if (transcript.toLowerCase().includes("search for")) {
    iscommandsreconize = true;
    // Extract the search query after "search for"
    let input = transcript.toLowerCase().replace("search for", "").trim(); // Remove "search for" and trim spaces

    if (input.length === 0) {
      readOut("Please provide a valid search query.");
      return; // Stop if there's no valid search query
    }

    message_nexa.innerHTML = `SOFIA voice :- Here are the ${input} results`;
    readOut(`Here are the ${input} results`);

    // Replace spaces with "+" for the Google search URL
    input = encodeURIComponent(input); // Safely encode any special characters or spaces

    console.log(input); // Debugging: See the processed query

    // Redirect to Google with the search query
    window.open(`https://www.google.com/search?q=${input}`, "_blank");
  }

  if (
    transcript.toLowerCase().includes("play song") ||
    transcript.toLowerCase().includes(" nath ")
  ) {
    iscommandsreconize = true;
    // Remove "play" and "youtube" (case-insensitive) from the transcript
    let videoQuery = transcript.replace(/(play|youtube)/gi, "").trim();

    // Check if the query is valid (not empty)
    if (videoQuery.length > 0) {
      // Notify the user
      message_nexa.innerHTML = `SOFIA voice :- Searching and playing ${videoQuery} on YouTube.`;
      readOut(`Searching and playing ${videoQuery} on YouTube.`);

      // Use "search_query" to find videos and automatically open the first one with autoplay enabled
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          videoQuery
        )}&autoplay=1`,
        "_blank"
      );
    } else {
      // Prompt the user if the query is empty
      readOut(
        "I didn't catch that. Please specify what you want to play on YouTube."
      );
      message_nexa.innerHTML = `SOFIA voice :- I didn't catch that. Please specify what you want to play on YouTube.`;
    }
  }

  if (
    transcript.includes("what's the time") ||
    transcript.includes("tell me the time") ||
    transcript.includes("current time")
  ) {
    iscommandsreconize = true;
    let timespeak = new Date().toLocaleTimeString();
    message_nexa.innerHTML = `SOFIA voice :- The time is ${timespeak}`;
    readOut(`The time is  ${timespeak}`);
  }

  if (
    transcript.includes("what's the date") ||
    transcript.includes("tell me the date") ||
    transcript.includes("today date") ||
    transcript.includes("current date")
  ) {
    iscommandsreconize = true;
    let datespeak = new Date().toDateString();
    message_nexa.innerHTML = `SOFIA voice :- The Date is ${datespeak}`;
    readOut(`The Date  is  ${datespeak}`);
  }

  // Update the "weather today" command logic
  if (transcript.includes("weather today") || transcript.includes("weather")) {
    iscommandsreconize = true;
    if (globalWeatherData && globalWeatherData.name) {
      const tempCelsius = (globalWeatherData.main.feels_like - 273.15).toFixed(
        2
      );
      readOut(
        `Today's weather in ${globalWeatherData.name}: ${globalWeatherData.weather[0].description}, feels like ${tempCelsius}°C, with humidity at ${globalWeatherData.main.humidity}%.`
      );
      message_nexa.innerHTML = `SOFIA voice :- Today's weather in ${globalWeatherData.name}: ${globalWeatherData.weather[0].description}, feels like ${tempCelsius}°C, with humidity at ${globalWeatherData.main.humidity}%.`;
    } else {
      readOut(
        " Sorry, I cannot fetch the weather data at the moment. Please try again."
      );
      message_nexa.innerHTML =
        "SOFIA voice :- Sorry, I cannot fetch the weather data at the moment. Please try again.";
    }
  }
  if (transcript.includes("meaning of")) {
    iscommandsreconize = true;
    let wordArray = transcript.split(" ");

    let index = wordArray.indexOf("meaning");
    if (index !== -1 && index + 1 < wordArray.length) {
      let specificTask = wordArray[index + 2];

      console.log("Specific Task:", specificTask);

      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${specificTask}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            let definition = data[0].meanings[0].definitions[0].definition;

            message_print.innerHTML = `MY WORDS: ${data[0].word}`;
            readOut(definition);
            message_nexa.innerHTML = `SOFIA voice: ${definition}`;
          } else {
            throw new Error("Word not found");
          }
        })
        .catch((error) => {
          readOut("Sorry, could not fetch the data");
          message_nexa.innerHTML = `
                    <h3>Sorry, could not fetch the data</h3>
                    <div class="error-bg"></div>
                    <img src="errorimage.png" alt="Error Image" class="error-img">
                `;
        });
    } else {
      console.log("No word found after 'meaning'");
    }
  }
  if (transcript.includes("joke")) {
    iscommandsreconize = true;

    const URL = "https://official-joke-api.appspot.com/random_joke";

    const getnewjoke = async () => {
      try {
        let response = await fetch(URL);
        let jsonresponse = await response.json();
        let messagejoke = `${jsonresponse.setup} ${jsonresponse.punchline}`;

        message_nexa.innerHTML = `SOFIA voice: ${messagejoke}`;
        readOut(messagejoke);

        // Add a short delay before laughing (so it happens *after* joke)
        setTimeout(() => {
          const laugh = " Haha Haha  , that was funny!";
          message_nexa.innerHTML += `<br/>SOFIA laughs: ${laugh}`;
          readOut(laugh);
        }, 2500); // 2.5 seconds delay (adjust if needed)
      } catch (error) {
        console.error("Failed to fetch joke:", error);
        message_nexa.innerHTML =
          "SOFIA voice: Sorry, I couldn't get a joke right now.";
      }
    };

    getnewjoke();
  }

  if (
    transcript.includes("my location") ||
    transcript.includes("where am i") ||
    transcript.includes("current location")
  ) {
    iscommandsreconize = true;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          // ✅ Make function async
          // Extracting latitude and longitude
          const latitude = position.coords.latitude.toFixed(2);
          const longitude = position.coords.longitude.toFixed(2);

          // ✅ Use API key correctly
          const locationApiKey = "5a01b967555b40fc880113649251703";
          const url = `http://api.weatherapi.com/v1/current.json?key=${locationApiKey}&q=${latitude},${longitude}&aqi=no`;

          try {
            const response = await fetch(url); // ✅ Await fetch correctly
            const data = await response.json();

            console.log("Location Data:", data);

            // ✅ Display location details
            const locationMessage = `Your location: ${data.location.name}, ${data.location.region}, ${data.location.country}.`;
            message_nexa.innerHTML = `SOFIA voice :- ${locationMessage}`;
            readOut(locationMessage);

            // ✅ Open in Google Maps
            const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
            window.open(googleMapsUrl, "_blank");
            readOut("Redirecting to your location in Google Maps.");
          } catch (error) {
            console.error("Error fetching location:", error);
            readOut("Sorry, I couldn't retrieve your location details.");
          }
        },
        function (error) {
          // ✅ Handle geolocation errors
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "You denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "The request to get your location timed out.";
              break;
            default:
              errorMessage = "An unknown error occurred.";
              break;
          }

          message_nexa.innerHTML = `SOFIA voice :- ${errorMessage}`;
          readOut(errorMessage);
        }
      );
    } else {
      message_nexa.innerHTML =
        "SOFIA voice :- Geolocation is not supported by this browser.";
      readOut("Geolocation is not supported by this browser.");
    }
  }

  //here for calculation
  if (transcript.includes("add") || transcript.includes("plus")) {
    iscommandsreconize = true;
    let operation = transcript.split(" "); // Split the transcript into words
    let specificTask = operation[0]; // Extract the first word as the specific task

    // Extract the numbers part (everything after "add")
    let numbersPart = operation.slice(1).join(" "); // Join back everything after "add"
    let operator = numbersPart
      .split("+") // Split by "+"
      .map((num) => num.trim()) // Remove extra spaces
      .filter((num) => !isNaN(num) && num !== "") // Filter out invalid or empty strings
      .map((num) => parseInt(num, 10)); // Convert to numbers

    console.log("Specific Task:", specificTask);
    console.log("Numbers Array:", operator);
    let final_sum = 0;
    for (let i = 0; i < operator.length; i++) {
      final_sum += operator[i];
    }
    message_nexa.innerHTML = `SOFIA Voice :- Addition is ${final_sum}`;
    readOut(`Addition is ${final_sum}`);
  }
  if (transcript.includes("multiply")) {
    iscommandsreconize = true;
    let output = 1;
    let words = transcript.split(" ");
    let numbers = words.filter((word) => !isNaN(word)).map(Number);
    for (let i = 0; i < numbers.length; i++) {
      output = output * numbers[i];
    }
    console.log(output);
    message_nexa.innerHTML = `SOFIA Voice:- Mutipication is ${output}`;
    readOut(`mutipication is ${output}`);
  }

  if (
    transcript.includes("sub") ||
    transcript.includes("subtract") ||
    transcript.includes("track")
  ) {
    iscommandsreconize = true;
    let operation = transcript.split(" "); // Split the transcript into words
    let specificTask = operation[0]; // Extract the first word as the specific task

    // Extract the numbers part (everything after "add")
    let numbersPart = operation.slice(1).join(" "); // Join back everything after "add"
    let operator = numbersPart
      .split("-") // Split by "+"
      .map((num) => num.trim()) // Remove extra spaces
      .filter((num) => !isNaN(num) && num !== "") // Filter out invalid or empty strings
      .map((num) => parseInt(num, 10)); // Convert to numbers

    console.log("Specific Task:", specificTask);
    console.log("Numbers Array:", operator);
    let final_sum = operator[0];
    for (let i = 1; i < operator.length; i++) {
      final_sum -= operator[i];
    }
    message_nexa.innerHTML = `SOFIA voice :- Subtraction is ${final_sum}`;
    readOut(`Subtraction is ${final_sum}`);
  }
  if (transcript.includes("divide") || transcript.includes("/")) {
    iscommandsreconize = true;
    let check = true;
    let Divide_output = 0;
    let Divide_reminder = 0;

    const arrya = transcript.split(" ");
    const filerts = arrya.filter((word) => !isNaN(word)).map(Number);
    for (let i = 1; i < filerts.length; i++) {
      if (filerts[1] == 0) {
        check = false;
        readOut("Denominator can't be ZERO!");
        message_nexa.innerHTML = `Denominator can't be ZERO!`;
        console.log("Denominator cnat be ZERO");
      }
      if (filerts[0] < filerts[i]) {
        check = false;
        console.log("Numerator cant be small");
        readOut("Numerator cant be small");
        message_nexa.innerHTML = `Numerator cant be small !`;
      } else {
        Divide_output = (filerts[0] / filerts[1]).toFixed(1);
        Divide_reminder = filerts[0] % filerts[1];
      }
    }
    fractionalPart = Divide_reminder
      ? `${Math.floor(Divide_output)} ${Divide_reminder}/${filerts[1]}`
      : `${Math.floor(Divide_output)}`;

    let message = `
   Division Result:-
     ${filerts[0]} ÷ ${filerts[1]} = ${Divide_output} ,
     Remainder:- ${Divide_reminder},
    Fractional-Form:- ${fractionalPart}
    `;
    if (check == true) {
      readOut(message);
      message_nexa.innerHTML = `SOFIA voice:- ${message}`;
    }
  }

  if (transcript.includes("news")) {
    iscommandsreconize = true;
    const API_KEY = `e268f947d09e4a5397457e3dd8cc20f1`;
    let apiLink = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${API_KEY}`;

    const getnews = async () => {
      let response = await fetch(apiLink);
      let jsondata = await response.json();

      if (jsondata.articles.length > 0) {
        let messagenews_title = `Title: ${jsondata.articles[0].title}`;
        let messagenews_description = `Description: ${jsondata.articles[0].description}`;
        console.log(`${messagenews_title} ${messagenews_description}`);
        readOut(messagenews_title);
        readOut(messagenews_description);
        message_nexa.innerHTML = `Sofia Voice:- ${messagenews_title} ${messagenews_description}`;
      } else {
        let errormessage = "No news found";
        console.log(`${errormessage}`);
        readOut(errormessage);
        message_nexa.innerHTML = `Sofia Voice:-${errormessage}`;
      }
    };

    getnews();
  }

  // defalut message
  if (!iscommandsreconize) {
    let errorMessage =
      "Sorry, I didn't understand that command. Please provide a valid command. ";

    message_nexa.innerHTML = `SOFIA voice :- ${errorMessage}`;
    readOut(errorMessage);
  }
};

// Nexa stop
recognition.onend = function () {
  alering_message.innerHTML = `SOFIA is deactivated`;
  alering_message.style.color = "#FFA500";
  console.log("SOFIA is deactivated");
  let opacity = 1; // Initial opacity
  const blinkInterval = setInterval(() => {
    opacity = opacity === 1 ? 0.3 : 1; // Toggle between full and dim
    alering_message.style.opacity = opacity;
  }, 500); // Blinking speed (500ms)

  // Optional: Stop blinking after 5 seconds
  start_btn.addEventListener("click", function () {
    clearInterval(blinkInterval);
    alering_message.style.opacity = 1; // Reset opacity
    alering_message.style.color = "white";
  });
};

// Nexa Continuation for long until I press the stop button
// recognition.continuous = true;

// This helps to make button clickable and function execute
const hole_body = document.body;
start_btn.addEventListener("click", function () {
  hole_body.style.border = "1px solid #FF9999"; // Light red border
  start_btn.style.cursor = "not-allowed"; // Change cursor
  try {
    recognition.start();
  } catch (error) {
    console.error("Speech recognition error:", error);
  }
});

stop_btn.addEventListener("click", function () {
  hole_body.style.border = "1px solid black";
  start_btn.style.cursor = "default";
  hole_body.style.border = "1px solid green";
  hole_body.style.transition = "border 0.2s ease-in-out";
  setTimeout(function () {
    hole_body.style.border = "1px solid black";
  }, 2000);

  try {
    recognition.stop();
  } catch (error) {
    console.error("Speech recognition error:", error);
  }
});

// Nexa speech
function readOut(message) {
  const speech = new SpeechSynthesisUtterance();
  const synth = window.speechSynthesis;

  // Wait for voices to load
  const loadVoices = () => {
    const allVoices = synth.getVoices();
    if (allVoices.length > 0) {
      // Choose a specific voice (e.g., allVoices[1], or any preferred voice)
      speech.voice =
        allVoices.find((voice) => voice.name.includes("Google US English")) ||
        allVoices[1];
      speech.volume = 1; // Set volume (0.0 to 1.0)
      speech.text = message;

      // Speak the message
      synth.speak(speech);
      console.log("Speaking out");
    }
  };

  if (synth.getVoices().length > 0) {
    loadVoices(); // Voices are already available
  } else {
    // Wait for voices to load
    synth.onvoiceschanged = loadVoices;
  }
}

window.onload = function () {
  // First call with an empty string
  readOut(" ");
  // setTimeout(function () {
  //   readOut(`Hello ${userData.name} sir, welcome back! I am your assistant. How can I help you?`);

  // }, 1000);
};

speak_btn.addEventListener("click", function () {
  message_nexa.innerHTML =
    "SOFIA Voice :- Hello , I'm SOFIA , your voice assistant. How can I assist you?";
  readOut("Hello , I'm SOFIA , your voice assistant. How can I assist you?");
});

const clock = document.querySelector(".time");
const r_date = document.querySelector(".date");
r_date.innerHTML = `<h3>${new Date().toDateString()}</h3>`;
setInterval(() => {
  let date = new Date().toLocaleTimeString();
  clock.innerHTML = `<h2>${date}</h2>`;
}, 1000);

//clear data
const stroge = document.querySelector("#local_stroge");

stroge.addEventListener("click", function () {
  let confirmation = confirm(
    "Are you sure you want to clear the Local Storage?"
  );
  if (confirmation) {
    readOut("Clearing the local storage");

    localStorage.clear();
    setTimeout(() => {
      location.reload(); // Delays reload so UI changes are visible
    }, 1000); // Small delay
  } else {
    readOut("Local storage was not cleared");
  }
});
