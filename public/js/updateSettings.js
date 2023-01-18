//  updateData
import axios from 'axios';
import {showAlert} from './alerts';

export const updateData = async(name,email) => {
    cosole.log(email, name );
    try{
        const res = await axios({
            method:'PATCH',
            url:'http://:3000/api/v1/users/updateMe',
            data:{
                name,
                email
            }
        })
        if(res.data.status === 'success'){
            showAlert('success','Data Updated Successfully!');
        }
    }
    catch(err){
        showAlert('error',err.response.data.message);
    }
}



