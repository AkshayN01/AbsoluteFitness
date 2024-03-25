const cartPageVariables = {
    cartItems : '',
    allProducts : [],
    primaryMsg: 'Your Cart is Empty',
    secondaryMsg: 'Go to our Home page to checkout products'
};

let displayCartItems = () => {
    var cartItems = sessionStorage.getItem(sessionStorageCartName);
    if(cartItems == undefined || cartItems == null || cartItems == '[]'){
        displayEmptyContent(cartPageVariables.primaryMsg, cartPageVariables.secondaryMsg);
        removeTotalPriceEl();
    }
    else{
        cartPageVariables.cartItems = JSON.parse(cartItems);
        getData().then((res) => {
            cartPageVariables.allProducts = res;
            cartPageVariables.cartItems.forEach((item) => {
                var equipment = res.find((c) => c.id == item.id);
                addCartProductElements(item, equipment);
            });
            updateTotalPrice();
        })
    }
}

const addCartProductElements = (cartItem, equipment) => {
    var equipmentCard = document.createElement('a');
    equipmentCard.id = cartItem.id;
    equipmentCard.onclick = "urlRoute()";
    equipmentCard.setAttribute("data-clickSource", "product");
    equipmentCard.setAttribute("data-productId", 'id='+equipment.id);
    equipmentCard.className = 'card';
            
    // card top
    var cardImage = document.createElement('div');
    cardImage.style.backgroundImage = "url(" + equipment.images.displayImageUrl + ")";
    cardImage.className = 'card-top';
    cardImage.setAttribute("data-clickSource", "product");
    cardImage.setAttribute("data-productId", 'id='+equipment.id);

    // card body
    var cardBody = document.createElement('div');
    cardBody.className = 'card-bottom';
    cardBody.setAttribute("data-clickSource", "product");
    cardBody.setAttribute("data-productId", 'id='+equipment.id);

    var producName = document.createElement('h4');
    var productNameText = document.createTextNode(equipment.name);
    producName.appendChild(productNameText);
    producName.setAttribute("data-clickSource", "product");
    producName.setAttribute("data-productId", 'id='+equipment.id);
    
    var inputGroup = document.createElement('div');
    inputGroup.className = 'input-group';

    var quantityContainer = document.createElement('div');
    quantityContainer.className = 'quantity-container';

    var incrementButton = document.createElement('button');
    incrementButton.className = 'quantity-btn';
    incrementButton.id = 'incrementBtn-'+ equipment.id;
    incrementButton.innerHTML = '+';
    incrementButton.addEventListener('click', (event) =>{ updateQuantity(event, 1) });

    var quantity = document.createElement('span');
    var quantityText = document.createTextNode(cartItem.quantity);
    quantity.className = 'quantity-display';
    quantity.id = 'quantityDisplay-'+ equipment.id;
    quantity.appendChild(quantityText);
    
    var decrementButton = document.createElement('button');
    decrementButton.className = 'quantity-btn';
    decrementButton.id = 'decrementBtn-'+ equipment.id;
    decrementButton.innerHTML = '-';
    decrementButton.addEventListener('click', (event) => {updateQuantity(event, -1)});

    quantityContainer.appendChild(decrementButton);
    quantityContainer.appendChild(quantity);
    quantityContainer.appendChild(incrementButton);

    inputGroup.appendChild(quantityContainer);

    var totalPriceDiv = document.createElement('div');
    var totalPriceDivText = document.createTextNode('\u20AC');
    totalPriceDiv.appendChild(totalPriceDivText);

    var totalPrice = document.createElement('span');
    totalPrice.id = 'totalPrice-'+ equipment.id;
    var price = (equipment.discountAmount != 0 ? equipment.discountAmount : equipment.amount) * cartItem.quantity;
    var totalPriceText = document.createTextNode(price);
    totalPrice.appendChild(totalPriceText);
    totalPriceDiv.appendChild(totalPrice);
    inputGroup.appendChild(totalPriceDiv);

    cardBody.appendChild(producName);
    cardBody.appendChild(inputGroup);

    equipmentCard.appendChild(cardImage);
    equipmentCard.appendChild(cardBody);
        
    document.getElementById('cartList').appendChild(equipmentCard);
}

const updateQuantity = (event, value) => {
    var elementId = event.srcElement.id;
    var productId = elementId.split('-')[1];
    console.log(productId)
    var selectedEquipment = cartPageVariables.allProducts.find((a) => a.id = productId);
    var quantityElement = document.getElementById('quantityDisplay-'+ productId);
    var previousQuantity = Number(quantityElement.innerHTML);
    var totalQuantity = previousQuantity + value;
    console.log('Total Quantity: '+ totalQuantity)
    if(totalQuantity > 0 ){
        quantityElement.innerHTML = totalQuantity;

        var totalPriceElement = document.getElementById('totalPrice-'+ productId);
        var equipmentPrice = (selectedEquipment.discountAmount == 0 ? selectedEquipment.amount : selectedEquipment.discountAmount)
        totalPriceElement.innerHTML = equipmentPrice * totalQuantity;
        var item = {id: productId, quantity : totalQuantity};
        setSessionStorage(item);
    }
    else{
        var productCard = document.getElementById(productId);
        productCard.remove();
        var item = {id: productId, quantity : 0};
        setSessionStorage(item);
        checkCartIsEmpty();
    }
    console.log(cartPageVariables.allProducts.find((c) => c.id == productId))
    updateTotalPrice();
}

const checkCartIsEmpty = () => {
    var cartItems = sessionStorage.getItem(sessionStorageCartName);
    if(cartItems == undefined || cartItems == null || cartItems == '[]'){
        displayEmptyContent(cartPageVariables.primaryMsg, cartPageVariables.secondaryMsg);
        removeTotalPriceEl();
    }
}
const updateTotalPrice = () => {
    document.getElementById('overallPrice').innerHTML = calculateOverallPrice();
}

const removeTotalPriceEl = () => {
    document.getElementById('overall-price').style.display = 'none';
}
const calculateOverallPrice = () => {
    var total = 0;
    var cartItems = sessionStorage.getItem(sessionStorageCartName);
    cartItems = JSON.parse(cartItems);
    cartItems.forEach((item) => {
        console.log(item);
        var equipment = cartPageVariables.allProducts.filter((product) => product.id == item.id)[0];
        console.log(equipment);
        console.log(cartPageVariables.allProducts);
        var equipmentPrice = equipment.discountAmount == 0 ? equipment.amount : equipment.discountAmount;
        total += Number(equipmentPrice * item.quantity);
    });

    return total;
}