Multi-Timer App

A React Native app that allows users to create, manage, and interact with multiple customizable timers.
 Features include categories, progress visualization, and grouped actions while maintaining a clean UI/UX with minimal third-party dependencies

Setup Instructions
Prerequisites
Ensure you have the following installed:

Node.js v18.20.3
npm or yarn (Package Manager)
Expo CLI (npm install -g expo-cli)
Git (Version Control System)
Android Studio / Xcode (For testing)

Clone the Repository

git clone https://github.com/Nijinjoy/TimerApp_ReactNative.git
npm install

Running the Project
Start the development server:

npx expo start

Assumptions Made During Development

State Management: The app uses React's useState and AsyncStorage for managing timers globally.
Local Storage: Uses AsyncStorage for persisting timers across app restarts.
Timer Accuracy: Uses setInterval for countdown logic, assuming a delay of ~1 second per update.
Categories: Users can assign timers to predefined categories like Workout, Study, Break.
Progress Visualization: Each timer shows a progress bar with percentage completion.
Bulk Actions: Users can start, pause, and reset all timers in a category with one action.
Performance Optimization: Prevents unnecessary re-renders by optimizing useEffect dependencies.
Cross-Platform Compatibility: Designed for both iOS and Android with responsive layouts.

Future Enhancements

Add custom categories.
Implement push notifications for completed timers.
Dark mode support.

