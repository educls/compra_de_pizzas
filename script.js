let modalQt = 1;
let cart = [];
modalKey = 0;

const q = (el)=> document.querySelector(el);
const ql = (el)=> document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = q('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        precoatual = item.price.toFixed(2);
        modalKey = key;

        q('.pizzaBig img').src = pizzaJson[key].img;
        q('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        q('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        q('.pizzaInfo--size.selected').classList.remove('selected');
        ql('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });
        
        q('.pizzaInfo--qt').innerHTML = modalQt;

        q('.pizzaWindowArea').style.opacity = 0;
        q('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            q('.pizzaWindowArea').style.opacity = 1;
        }, 100);
    });

    q('.pizza-area').append(pizzaItem);
});

//Eventos do MODAL
function closeModal(){
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        q('.pizzaWindowArea').style.display = 'none';
    }, 500);
   
}

ql('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
q('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    modalQt--;
    if(modalQt < 1){
        modalQt = 1;
    }
    atual = precoatual*modalQt;
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${atual.toFixed(2)}`;
    q('.pizzaInfo--qt').innerHTML = modalQt;
});
q('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    aatual = precoatual*modalQt;
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${aatual.toFixed(2)}`;
    q('.pizzaInfo--qt').innerHTML = modalQt;
    
    
});
ql('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
q('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identity = pizzaJson[modalKey].id+'#'+size;

    let key =  cart.findIndex((item)=>item.identity == identity);

    if(key > -1){
        cart[key].qt += modalQt;
    } else{
        cart.push({
            identity,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }
    
    updateCart();
    closeModal();
});

q('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0){
        q('aside').style.left = '0';
    }
});
q('.menu-closer').addEventListener('click', ()=>{
    q('aside').style.left = '100vW';
})

function updateCart(){
    q('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        q('aside').classList.add('show');
        q('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;



            let cartItem = q('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;        
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            })
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                } else{
                    cart.splice(i, 1);
                }
                updateCart();
            })

            q('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else{
        q('aside').classList.remove('show');
        q('aside').style.left = '100vW';
    }
}