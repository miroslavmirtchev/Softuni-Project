window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
}