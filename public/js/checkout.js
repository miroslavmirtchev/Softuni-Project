window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
}

const placeOrderBtn = document.querySelector('.place-order-btn');
placeOrderBtn.addEventListener('click', () => {
    let address = getAddress();

    if(address){
        fetch('/order', {
            method: 'post',
            headers: new Headers({'Content-Type': 'application/json'}),
            body: JSON.stringify({
                order: JSON.parse(localStorage.cart),
                email: JSON.parse(sessionStorage.user).email,
                add: address,
            })
        }).then(res => res.json())
        .then(data => {
            if(data.alert == 'your order is placed'){
                delete localStorage.cart;
                showAlert(data.alert, 'success');
            } else{
                showAlert(data.alert);
            }
        })
    }
})