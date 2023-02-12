import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ChakraProvider} from "@chakra-ui/react"
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import Theme from "./styles/Theme";
import Fonts from "./styles/Fonts";

Sentry.init({
    dsn: "https://89fbea2b8ce84b92994708e30c9a9f18@o1015862.ingest.sentry.io/5981536",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={Theme}>
            <Fonts/>
            <App/>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
