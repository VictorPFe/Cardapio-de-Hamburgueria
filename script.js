const menu = document.getElementById("menu")
const spanItem = document.getElementById("date-span")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address") 
const addressWarn = document.getElementById("address-warn") 

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"

})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

//Função para adicionar no carrinho
function addToCart(name, price){

    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //Se o item ja exister , apenas aumentar a quantidade!
        existingItem.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
    
        })
    }
    updateCartModal()
}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    //Percorrer a lista
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "md-4", "flex-col")

        //Adicionar os item pelo DOM no carrinho
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                                
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            
            </div>
        `
        //Fazer a soma total dos preços
        total += item.price * item.quantity 

        //Adicionar itens
        cartItemsContainer.appendChild(cartItemElement)
    })
    //Converter para a moeda REAL
    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    });
    //Quantidade de itens
    cartCounter.innerHTML = cart.length;
}

//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        
        removeItemCart(name);
    }
})

//Função para remover item do carrinho
function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}
//Verificar se foi adicionado o endereço
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Verificar se foi adicionado o endereço
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestauranteOpen();
    if(!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(to right, #FF0000, #990000)",
            },
    }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

    //Enviar o pedido para API do WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `${item.name}, Quantidade: (${item.quantity}), Preço: R$${item.price} | `
        )
    }).join("")

    //Enviar mensagem para o WhatsApp de forma gratuita
    const message = encodeURIComponent(cartItems)
    const phone = "71992989634"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})

function checkRestauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora <22;
    //True = Restaurante está aberto
}

const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
