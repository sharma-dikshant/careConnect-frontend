# 1. Project Overview

The project is a **patient monitoring and communication system** that integrates IoT hardware and software to provide real-time interaction between patients and doctors. Patients authenticate themselves via a fingerprint sensor on the device and communicate using **voice commands**. Doctors can input patient medical details, symptoms, and treatment protocols. In emergencies, the system automatically notifies the respective doctor.

---

# 2. Objective

The main objective of **CareConnect** is to provide a **real-time, multilingual, AI-powered healthcare communication platform** that bridges the gap between patients and doctors by:
- Simplifying patient-doctor interaction using voice in native languages.
- Enabling fast and accurate emergency response.
- Reducing barriers caused by language differences.
- Allowing doctors to manage patient information and receive real-time updates via a secure dashboard.

---

# 3. MVP (Minimum Viable Product)

The **MVP** will focus on:

- **Patient authentication** via fingerprint (through ESP32 microcontroller).
- **Voice-based interaction** between the patient and system.
- **Multi-lingual support** for voice communication using **Google API** for speech recognition & translation.
- **FastAPI backend** for managing patient data and communication logic.
- **React frontend** for the doctor portal.
- **Basic database storage** for patient details.
- **JWT authentication** for secure access.
- Integration with **OpenAI/GPT-OSS-20B** for intelligent, conversational responses.

---

# 4. Functional & Non-Functional Requirements

| **Requirement Type** | **Description** |
|----------------------|-----------------|
| **Functional** | System must allow patient fingerprint authentication via ESP32. |
| **Functional** | System must allow patients to communicate via voice in their preferred language. |
| **Functional** | System must convert voice to text using Google API Speech-to-Text. |
| **Functional** | System must translate non-English text to English for backend processing. |
| **Functional** | System must use GPT-OSS-20B to process patient queries and generate responses. |
| **Functional** | System must send emergency alerts to doctors when critical conditions are detected. |
| **Functional** | Doctors must be able to log in, log out, and manage their profiles via the React dashboard. |
| **Functional** | Doctors must be able to add, view, edit, and delete patient records. |
| **Functional** | Doctors must be able to view patient chat history and uploaded context files ̥(PDF/CSV). |
| **Functional** | Doctors must be able to manage global context files for all patients. |
| **Non-Functional** | The system must support secure authentication using JWT. |
| **Non-Functional** | The system must process voice-to-text and translations with high accuracy. |
| **Non-Functional** | The dashboard should be responsive and user-friendly. |
| **Non-Functional** | The system should have minimal latency for emergency alerts (≤ 3 seconds). |
| **Non-Functional** | All data must be stored securely in the SQL database. |

---

# 5. Assumptions

1. Patients have access to the CareConnect device with ESP32, microphone, and fingerprint scanner.
2. Internet connectivity is available for device-to-server communication.
3. Doctors are registered and authorized to access the dashboard.
4. Google API services and GPT-OSS-20B are accessible and functional.
5. Patients and doctors will use the system in supported languages.

---

# 6. Constraints

1. The system heavily depends on internet connectivity for real-time processing.
2. Google API usage may have rate limits or costs depending on volume.
3. AI model responses depend on the training and capabilities of GPT-OSS-20B.
4. Hardware (ESP32) has limited processing power — most computation will happen server-side.
5. System performance could degrade with a large number of simultaneous voice processing requests without proper scaling.

---

# 7. Development Flow

1. **Hardware Layer (ESP32)**
   - Integrate fingerprint sensor and microphone
   - Connect ESP32 to backend via Wi-Fi
   - Send authenticated voice commands to backend

2. **Backend Layer (FastAPI)**
   - Implement REST endpoints for authentication, data retrieval, and voice processing
   - Integrate Google API for speech recognition & translation
   - Pass processed text to GPT-OSS-20B for response generation
   - Store relevant details in SQL database
   - Trigger alerts for emergencies

3. **Frontend Layer (React)**
   - Doctor dashboard UI
   - Patient data visualization
   - Real-time emergency alerts
   - Secure login using JWT

4. **Database Layer (SQL)**
   - Tables for patient data, doctor info, and logs
   - Store treatment protocols & emergency instructions

5. **Integration & Testing**
   - Test ESP32 communication with FastAPI
   - Test multilingual speech processing
   - Test AI responses and emergency alerts

---

# Team Details
__Section and Group: CSE-BG1__

| **Student Name** | **Student Roll No.** | **Signature** |
|----------------------|-----------------|----------------|
| Dikshant Sharma | 22ESKCS076 |  |
| Gaurvi Tekriwal | 22ESKCS089 |  |
| Gautam Jain | 22ESKCS090 |  |
| Geetika Paliwal | 22ESKCS091 |  |

| **Project Mentor** | **Project Lab Coordinator** |
|--------------------|-----------------------------|
| Dr. Yogendra Kumar Gupta<br>Associate Professor | Dr. Sumit Mathur<br>Assistant Professor |



