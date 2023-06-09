import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import ContractProvider from "./hooks/contract-hook";
import {BrowserRouter, Link, Navigate, Route, Switch} from 'react-router-dom';
import Sider from "antd/es/layout/Sider";
import {Layout, Menu} from "antd";
import {CloudOutlined, HomeOutlined, TeamOutlined, UserOutlined} from "@ant-design/icons";
import {Content, Header} from "antd/es/layout/layout";
import NavigationBar from "./components/top/NavigationBar";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <ContractProvider>
            <NavigationBar>
                <App/>
            </NavigationBar>


        </ContractProvider>
    </BrowserRouter>


    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

