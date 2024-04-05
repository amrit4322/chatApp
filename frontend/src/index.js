import React from 'react';
// import ReactDOM from 'react-dom';

//TODO
import ReactDOM from 'react-dom/client';



import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store } from './redux/store.auth';
import ToastComponent from './components/ToastComponent';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="1041409647284-jkmponna01pc6vkfcis9078casuntrl7.apps.googleusercontent.com">
    <Provider store={store}>
        <BrowserRouter>
        {/* <ToastComponent/> */}
          <App />
        </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
