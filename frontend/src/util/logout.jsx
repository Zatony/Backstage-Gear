import { redirect } from "react-router-dom";

export function action(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    try{ window.dispatchEvent(new Event('authChanged')); }catch(e){}
    return redirect('/');
}