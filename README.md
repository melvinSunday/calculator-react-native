# Calculator Mobile App

A beautiful, feature-rich calculator application built with React Native and Expo. This app offers a modern, intuitive interface with both light and dark themes, calculation history, and smooth animations.

<div align="center">
  <img src="assets/images/icon2.png" alt="Calculator App">
</div>

## Download

Get the Android APK: [Download Here](https://expo.dev/accounts/m.sundae/projects/CalculatorMobileApp/builds/6cf61110-b708-48f8-a5ab-119bfeeb6a13)

## Features

- **Modern UI Design**: Clean, intuitive interface with beautiful transitions
- **Theme Support**: Toggle between light and dark themes with smooth animations
- **Calculation History**: View and manage your calculation history
- **Haptic Feedback**: Enhanced user experience with tactile feedback
- **Responsive Layout**: Works seamlessly across different device sizes
- **Gesture Support**: Swipe to access additional features
- **Persistent Storage**: Your calculation history is saved between sessions

## Technology Stack

- [React Native](https://reactnative.dev/) - Cross-platform mobile framework
- [Expo](https://expo.dev/) - React Native development platform
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [Async Storage](https://react-native-async-storage.github.io/async-storage/) - Local data persistence

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

## Usage

- **Basic Calculations**: Add, subtract, multiply, and divide numbers
- **Theme Switching**: Toggle between light and dark themes using the theme button
- **History View**: Swipe down or tap the history button to view past calculations
- **Clear History**: Remove all history items with a single tap

## Project Structure


 ```
 CalculatorMobileApp/
 ├── app/                   # Main application code
 │   ├── components/        # UI components
 │   ├── constants/         # Theme and other constants
 │   ├── context/           # React context (theme, etc.)
 │   ├── utils/             # Helper functions
 │   ├── _layout.tsx        # App layout
 │   └── index.tsx          # Main app entry point
 ├── assets/                # Images, fonts and other static files
 ├── node_modules/          # Dependencies
 └── package.json           # Project metadata and dependencies
 ```
 