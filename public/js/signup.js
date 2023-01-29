import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name,email,password,passwordConfirm)=>{ 
    console.log(name , email ,password , passwordConfirm);
    try{
        const res = await axios({
            method:'POST',
            url:'http://127.0.0.1:3000/api/v1/users/signup',
            data:{
                name,
                email,
                password,
                passwordConfirm
            }
        })
        console.log(res.data.status);
        if(res.data.status === 'success'){
            showAlert('success','signed up Successfully!');
            window.setTimeout(()=>{
                location.assign('/login');
            },1500);
        }
        console.log(res);
    } catch(err){
        showAlert('error', err.response.data.message);
    } 
}