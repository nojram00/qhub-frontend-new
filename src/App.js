import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QuotationPage from './components/quotationPage';
import Home from './components/homepage'
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
// import "./app.scss";
import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import Header from './partials/_header';
import http from './axios_config/axios.config';
import Login from './components/login';


function App() {

  const getUser = async () => {

    await http.get('/sanctum/csrf-cookie').then((csrf) => {
      console.log('csrf: ', csrf);
    }).catch((err) => {
      console.error(err);
    });


    await http.get('/api/user', {

    }).then((user) => {
      console.log("user: ", user);
    }).catch((err) => {
      console.log(err);
    });

  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Header />
          <Routes>
            <Route element={<QuotationPage />} path='/quote'/>
            <Route element={<Home />} path='/'/>
            <Route element={<Login />} path='/login'/>
          </Routes>
      </BrowserRouter>
    // </PrimeReactProvider>
  );
}

export default App;
