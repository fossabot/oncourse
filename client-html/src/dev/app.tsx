/**
 * Entry point for DEV mode
 * Enable Hot Module Reloading, MOCKs and other dev functionality
 * */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { DEFAULT_CONFIG } from "../js/constants/Config";
import { initMockDB } from "./mock/MockAdapter";
import store from "../js/constants/Store";
import AppEntry from "../js/AppEntry";

initMockDB();

const start = () => {
  ReactDOM.render(
    <Provider store={store as any}>
      <AppEntry />
    </Provider>,
    document.getElementById(DEFAULT_CONFIG.CONTAINER_ID)
  );
};

start();
