import React from "react";
import { LogBox } from "react-native";
import Navigation from "./app/navigations/Navigation";
import { FirebaseApp } from "./app/utils/firebase";

LogBox.ignoreAllLogs(true)

export default function App() {
  
  return (
    <Navigation />
  );
}