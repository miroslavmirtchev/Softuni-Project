// create small product cards
const createSmallCards = (data) => {
    return `
    <div class="sm-product">
        <img src="${data.image}" class="sm-product-img" alt="">
        <div class="sm-text">
            <p class="sm-product-name">${data.name}</p>
            <p class="sm-des">${data.shortDes}</p>
        </div>
        <div class="item-counter">
            <button class="counter-btn decrement">-</button>
            <p class="item-count">${data.item}</p>
            <button class="counter-btn increment">+</button>
        </div>
        <p class="sm-price" data-price="${data.sellPrice}">$${data.sellPrice * data.item}</p>
        <button class="sm-delete-btn"><img src="img/close.png" alt=""></button>
    </div>
    `;
}

let totalBill = 0;

const setProducts = (name) => {
    const element = document.querySelector(`.${name}`);
    let data = JSON.parse(localStorage.getItem(name));
    if(data == null){
        element.innerHTML = `<img src="img/empty-cart.png" class="empty-img" alt="">`;
    } else{
        for(let i = 0; i < data.length; i++){
            element.innerHTML += createSmallCards(data[i]);
            if(name == 'cart'){
                totalBill += Number(data[i].sellPrice * data[i].item);
            }
            updateBill();
        }
    }

    setupEvents(name);
}

const updateBill = () => {
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `$${totalBill}`;
}