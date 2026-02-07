import { redirect } from "react-router-dom";

export function action(){
    console.log("Logout action called");
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    localStorage.removeItem('expiration');
    try{ window.dispatchEvent(new Event('authChanged')); }catch(e){}
    return redirect('/');
}