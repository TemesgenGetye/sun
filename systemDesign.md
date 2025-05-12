# 📱 SunShine Meri Luke Village – Mobile App (React Native + Expo) Summary

## 🔹 Overview

This mobile app is designed for **residents** of the SunShine Meri Luke Village compound to manage daily tasks like payments, guests, service requests, and incidents. Built using **React Native with JSX** and **Expo**, it connects to a **Django REST API backend** and uses **PostgreSQL** for data storage.

---

## 🧩 Functional Modules

### 1. 👤 Resident Account Management

- **Registration Form**: Name, phone number, and house number.
- **SMS Verification**: Validate phone via SMS (backend + SMS Gateway).
- **Admin Approval**: Accounts require approval before activation.
- **Profile Settings**: Update personal info and change password.

---

### 2. 💵 Payment Handling

- **View Bills**: List of admin-created monthly or one-time payments.
- **Pay Online**: Integration with **Telebirr, CBE, Chapa** (via backend).
- **Status Tracking**: See pending, successful, or failed transactions.
- **Reminders**: Push notifications for due/overdue bills.

---

### 3. 🧑‍🤝‍🧑 Guest Management

- **Pre-register Guests**: Submit visitor details (name, date/time).
- **Track Logs**: View logs of previous guest visits and access status.

---

### 4. 🚗 Vehicle Entry/Exit

- **View Logs**: Vehicle check-in/out history (linked to resident).
- **ID Handling**: See if visitor ID was submitted and returned.

---

### 5. 🚨 Incident Reporting (Anonymous)

- **Report Issue**: Submit anonymous reports with optional media.
- **Upload Evidence**: Attach images/documents (use expo-image-picker).
- **View Reports**: Browse community-reported issues.

---

### 6. 🛠 Service Requests

- **Submit Requests**: Request repairs or compound services.
- **Track Status**: View progress (`Pending → In Progress → Completed`).
- **Receive Updates**: Get notified on status changes.

---

### 7. 📢 Community Announcements

- **Digital Noticeboard**: See upcoming events and general info.
- **Emergency Alerts**: Receive critical updates via push notifications.

---

### 8. 💬 Feedback & Communication

- **Submit Feedback**: Residents can share complaints or suggestions.
- **Admin Replies**: View admin responses in a chat-style format.

---

### 9. 📈 Resident Analytics

- **Payment Overview**: See how much has been paid this year.
- **Service History**: View all past requests and statuses.

---

## 🧱 Architecture & Tech Stack

| Layer         | Technology                                  |
| ------------- | ------------------------------------------- |
| Frontend      | React Native (Expo)                         |
| Navigation    | `expo-router` or `@react-navigation/native` |
| Backend API   | Django REST Framework                       |
| Database      | PostgreSQL                                  |
| Notifications | Expo Notifications / SMS Gateway            |
| Payments      | Telebirr, CBE, Chapa                        |
| Storage       | AsyncStorage / SecureStore                  |
| Uploads       | Expo Image/File Picker                      |

---

## 🛠 Suggested Dev Steps (Expo + Cursor AI)

1. **Set up navigation + screens**
2. **Implement auth flow (register → verify via SMS → login)**
3. **Build home/dashboard screen**
4. **Add modules: Payments, Guests, Incidents, Services**
5. **Connect to APIs (via Axios or Fetch)**
6. **Integrate file/image picker + push notifications**
7. **Implement localization (i18n for Amharic, English, etc.)**
8. **Final polish & testing**

---

## 🔐 Non-Functional Requirements (Mobile Focus)

- **Performance**: Fast, smooth experience with real-time updates.
- **Security**: Token-based auth, encrypted storage.
- **Scalability**: Modular design for adding features later.
- **Accessibility**: Multilingual support and large tap areas.

---

## ✅ Ready to Start?

You're now ready to build this with React Native & Expo. Let me know if you'd like boilerplate code, component templates, or help structuring the project for Cursor AI input.
