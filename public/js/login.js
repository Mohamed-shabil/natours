import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email,password)=>{ 
    console.log('login is working');
    try{
        const res = await axios({
            method:'POST',
            url:'http://127.0.0.1:3000/api/v1/users/login',
            data:{
                email,
                password
            }
        })
        console.log(res.data.status);
        if(res.data.status === 'success'){
            showAlert('success','Logged in Successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }
        console.log(res);
    } catch(err){
        showAlert('error', err.response.data.message);
    } 
}

export const logout = async () =>{
    try{
        const res = await axios({
            method:'GET',
            url:'http://127.0.0.1:3000/api/v1/users/logout', 
        });
        if(res.data.status === 'success') location.reload(true);
        // location.reload(true) the argument true is used to truely reload the page instead of getting the page from cache
    }catch(err){
        showAlert('error', 'Error Logging Out ! Try Again')
    }
} 