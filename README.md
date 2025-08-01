# SOFIA - AI Voice Assistant 🎙️  

SOFIA is an interactive AI-powered voice assistant built using **JavaScript, Speech Recognition, and Speech Synthesis APIs**. It listens to user commands, fetches real-time data (like weather updates), performs calculations, and integrates with web services for a seamless user experience.  

## 🌟 **Key Features**
- 🎤 **Voice Recognition & Speech Output**: Uses **Web Speech API** for real-time speech-to-text and text-to-speech.
- 🌍 **Weather Updates**: Fetches weather data using **OpenWeatherMap API**.
- 🔋 **Battery & Network Monitoring**: Displays battery status and online connectivity.
- 🗺️ **Geolocation Services**: Retrieves the user's current location via **WeatherAPI**.
- 🌐 **Web Automation**: Opens websites like Google, Wikipedia, YouTube, and LinkedIn on voice command.
- 🧠 **Local Storage Management**: Stores user preferences (name, location, and accounts) and retrieves them upon restart.
- 🔢 **Mathematical Operations**: Supports addition, subtraction, multiplication, and division using voice commands.
- 📅 **Date & Time Retrieval**: Announces the current time and date on request.

---

## ⚙️ **Tech Stack**
- **JavaScript (ES6+)**
- **Web Speech API** (Speech Recognition & Synthesis)
- **OpenWeatherMap API** (Weather Fetching)
- **WeatherAPI** (Location-based data)
- **Local Storage API** (Persistent user settings)
- **HTML & CSS** (User Interface)

---

## 🌟 **Project Overview**
![SOFIA AI Voice Assistant]![Screenshot 2025-03-24 223143](https://github.com/user-attachments/assets/dc52bae8-70ee-4db0-8c5e-61943c744529)

 tou can add details in this way :-
 ![Screenshot 2025-03-24 223419](https://github.com/user-attachments/assets/39561b33-b39a-4d84-b51d-75212f8f8c82)


## 🛠️ **Setup & Installation**
### **1️⃣ Clone the Repository**

git clone https://github.com/yourusername/sofia-voice-assistant.git
cd sofia-voice-assistant

2️⃣ Open in a Browser
Simply open index.html in a modern browser (Chrome recommended).

3️⃣ API Configuration
Register for an OpenWeatherMap API key at:
https://home.openweathermap.org/api_keys

Replace the apiKey in voice.js:

const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
WeatherAPI (for location data) key:

const locationApiKey = "YOUR_WEATHERAPI_KEY";
🔥 How It Works
1️⃣ Start & Stop Voice Recognition
Click "Start" to activate SOFIA.

Click "Stop" to deactivate it.



3️⃣ Local Storage
The assistant stores user details (name, location, GitHub, LinkedIn).

This data persists between browser sessions.

To clear storage, click the "Clear Local Storage" button.

🌩️ API & Data Handling
1️⃣ OpenWeatherMap API (Weather Fetching)
API Endpoint:
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}
Example Response:

json
{
  "weather": [{"main": "Clear", "description": "clear sky"}],
  "main": {"temp": 289.92, "humidity": 56},
  "name": "London"
}


🗑️ Clearing Local Storage
Stored user preferences can be cleared manually.

Click "Clear Local Storage", and settings will reset.

document.querySelector("#local_stroge").addEventListener("click", () => {
  localStorage.clear();
  location.reload();
});
🎯 Why This Project Stands Out?
✅ Real-time API integration for weather & location
✅ Voice-controlled browser automation
✅ Persistent user settings with Local Storage
✅ Works Offline (for calculations & basic responses)
✅ Supports multiple commands including search & navigation

📌 Future Enhancements
🔊 Custom AI-generated responses (ChatGPT API)

📡 Enhanced geolocation tracking (Google Maps API)

🗣️ Multiple language support for speech recognition

👨‍💻 Developed By
👤 Mohammad Kaif
🔗 LinkedIn: https://www.linkedin.com/in/mohammad-kaif-9a0bb6284/
📧 Email:mohammadkaif6660@gmail.com

📜 License
This project is open-source under the MIT License. Feel free to contribute! 🎉

