import React from "react";
import ReactDOM from "react-dom";
import "jquery";
import "popper.js/dist/umd/popper";
// imports bootstrap for styling
import "bootstrap/dist/js/bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
//imports components from App.jsx
import App from "./App";
//imports stylesheet
import "./styles.css";
import { BrowserRouter } from "react-router-dom";

// Renders the first parameter at id "root" in index.html
ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById("root"));