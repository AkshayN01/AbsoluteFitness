var product = {};
var similarProducts = [];
var allProducts = [];

const getProductInfo = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    console.log(id);
    data  = getData();
    data.then((res) => {
        allProducts = res;
        product = res.find((equipment) => equipment.id == id);
        similarProducts = res.filter((equipment) => equipment.subCategory == product.subCategory || equipment.productType == product.productType);
        console.log(product);
        displayProductInformation();
    })
}

const displayProductInformation = () => {
    var productOuterDiv = document.createElement('div');
    productOuterDiv.className = 'product-info';

    var productImageDiv = document.createElement('div');
    productImageDiv.className = 'product-image';

    var productImage = document.createElement('img');
    productImage.src = product.images.productImageUrl;
    productImage.alt = 'Product Image';
    productImageDiv.appendChild(productImage);
    productOuterDiv.appendChild(productImageDiv);

    var productDetails = document.createElement('div');
    productDetails.className = 'product-details';

    var brandName = document.createElement('h2');
    var brandNameText = document.createTextNode(product.brandName);
    brandName.appendChild(brandNameText);
    productDetails.appendChild(brandName);

    var productName = document.createElement('h3');
    var productNameText = document.createTextNode(product.name);
    productName.appendChild(productNameText);
    productDetails.appendChild(productName);
    
    var productDescription = document.createElement('p');
    var productDescriptionText = document.createTextNode(product.description);
    productDescription.appendChild(productDescriptionText);
    productDetails.appendChild(productDescription);

    var addToCartButton = document.createElement('button');
    addToCartButton.id = 'cartButton';
    addToCartButton.className = 'add-to-cart';
    var buttonMessage = 'Add to Cart'
    if(checkProductAlreadyInCart()){
        buttonMessage = 'Already in Cart'
        addToCartButton.disabled = true;
    }
    var buttonText = document.createTextNode(buttonMessage);
    addToCartButton.onclick = function() { addToCart(); };
    addToCartButton.appendChild(buttonText);
    productDetails.appendChild(addToCartButton);

    productOuterDiv.appendChild(productDetails);
    var mainContent = document.getElementById('productInfo');
    mainContent.appendChild(productOuterDiv);

    if(similarProducts.length > 0){
        var similarProductsDiv = displaySimilarProducts();
        mainContent.appendChild(similarProductsDiv);
    }   
}

const displaySimilarProducts = () => {
    var similarProductsDiv = document.createElement('div');

    var heading = document.createElement('h2');
    var headingText = document.createTextNode('Similar Products you might be interested in');
    heading.appendChild(headingText);
    similarProductsDiv.appendChild(heading);

    var productOuterDiv = document.createElement('div');
    productOuterDiv.className = 'suggested-product-card-container';

    var carouselDiv = document.createElement('div');
    carouselDiv.className = 'carousel';
    
    similarProducts.forEach((p) => {
        // var card = document.createElement('div');
        // card.className = 'card';

        // var productImage = document.createElement('img');
        // productImage.src = p.images.displayImageUrl;
        // productImage.alt = 'Product Image';
        // card.appendChild(productImage);

        // var productDetails = document.createElement('div');

        // var productName = document.createElement('h2');
        // var productNameText = document.createTextNode(p.name);
        // productName.appendChild(productNameText);
        
        // productDetails.appendChild(productName);
        // card.appendChild(productDetails);
        var equipmentCard = document.createElement('a');
        equipmentCard.onclick = "urlRoute()";
        equipmentCard.setAttribute("data-clickSource", "product");
        equipmentCard.setAttribute("data-productId", 'id='+p.id);
        equipmentCard.className = 'similar-product-card';
            
        // card top
        var cardImage = document.createElement('div');
        cardImage.style.backgroundImage = "url(" + p.images.displayImageUrl + ")";
        cardImage.className = 'card-top';
        cardImage.setAttribute("data-clickSource", "product");
        cardImage.setAttribute("data-productId", 'id='+p.id);
        // card body
        var cardBody = document.createElement('div');
        cardBody.className = 'card-bottom';
        cardBody.setAttribute("data-clickSource", "product");
        cardBody.setAttribute("data-productId", 'id='+p.id);

        var producName = document.createElement('h4');
        var productNameText = document.createTextNode(p.name);
        producName.appendChild(productNameText);
        producName.setAttribute("data-clickSource", "product");
        producName.setAttribute("data-productId", 'id='+p.id);
        cardBody.appendChild(producName);

        equipmentCard.appendChild(cardImage);
        equipmentCard.appendChild(cardBody);
        carouselDiv.appendChild(equipmentCard);
    })
    
    productOuterDiv.appendChild(carouselDiv);
    similarProductsDiv.appendChild(productOuterDiv);

    return similarProductsDiv;
}

const addToCart = () => {
    var item = {
        id: product.id,
        quantity: 1
    }
    setSessionStorage(item);
    var button = document.getElementById('cartButton');
    button.innerHTML = 'Already in Cart';
    button.disabled = true;
}

const checkProductAlreadyInCart = () => {
    var isPresent = true;
    cartItems = sessionStorage.getItem(sessionStorageCartName);
    console.log(cartItems);
    if(cartItems != undefined && cartItems != null && cartItems != '[]'){
        cartItems = JSON.parse(cartItems);
        var item = cartItems.find((c) => c.id == product.id)
        if(item == undefined || item == {}){
            isPresent = false;
        }
    }
    else{
        isPresent = false;
    }
    return isPresent;
}