import React from 'react'
import ReactDOM from 'react-dom/client'
import {Helmet, HelmetProvider} from "react-helmet-async";
import {Provider} from "react-redux";
import {persistor, store} from "./state/store";
import {PersistGate} from "redux-persist/integration/react";
import {Application} from "./main";
import "./styles/tailwind.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Athena</title>
      </Helmet>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Application />
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
)
