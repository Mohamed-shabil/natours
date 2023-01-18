import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import {updateData} from './updateSettings';

// DOM Elements

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.getElementsByClass('.form-user-data');


// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if(userDataForm){
  userDataForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const email = docuement.getElementById('email').value;
    const name = docuement.getElementById('name').value;
    updateData(name,email);
  })
}

if(loginForm){
    loginForm.addEventListener("submit", (e) => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      e.preventDefault();
      login(email, password);
    });
}
if(logoutBtn) logoutBtn.addEventListener('click',logout);


