import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ChakraProvider} from "@chakra-ui/react"
import Theme from "./styles/Theme";
import Fonts from "./styles/Fonts";

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
