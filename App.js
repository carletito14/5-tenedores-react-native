import React from "react";
import { LogBox } from "react-native";
import Navigation from "./app/navigations/Navigation";
import { FirebaseApp } from "./app/utils/firebase";
import { decode, encode } from "base-64"

LogBox.ignoreAllLogs(true)

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {

  return (
    <Navigation />
  );
}