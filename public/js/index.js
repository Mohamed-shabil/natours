import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import {signup} from './signup';
import {updateSettings} from './updateSettings';

// DOM Elements

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const signupForm = document.querySelector('.form--signup');


// Delegation
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}


if(loginForm){
  loginForm.addEventListener("submit", (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email , password);
    e.preventDefault();
    login(email, password);
  });
}

if(logoutBtn) {
  logoutBtn.addEventListener('click',logout);
}


if(userDataForm){
  userDataForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    const form = new FormData();
    form.append('name',document.getElementById('name').value)
    form.append('email',document.getElementById('email').value)
    form.append('photo',document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form,'data');
  })
}

if(userPasswordForm){
  userPasswordForm.addEventListener("submit", async e =>{
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    
    await updateSettings({passwordCurrent, password,passwordConfirm},'password');
    document.querySelector('.btn--save-password').textContent= 'Save Password';
    document.getElementById('password-current').value ='';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value ='';
  })
}

if(signupForm){
  signupForm.addEventListener("submit", async e =>{
    e.preventDefault();
    console.log('signup......');
    const name = document.getElementById('name-signup').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const passwordConfirm = document.getElementById('passwordConfirm-signup').value;
    console.log(name, email,  password, passwordConfirm);
    await signup(name,email,password,passwordConfirm);
  })
}
