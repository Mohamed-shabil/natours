import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM Elements

console.log('Its Workingn from index .js')


const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout ')

// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if(loginForm){
    loginForm.addEventListener("submit", (e) => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      e.preventDefault();
      login(email, password);
    });
}

if(logoutBtn) logoutBtn.addEventListener('click',logout)

