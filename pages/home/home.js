const displayEquipmentList = (clickSource) => {
    var searchKeyword = '';
    if(clickSource == 'searchbar'){
        searchKeyword = document.getElementById('searchbar').value;
    }
    data  = getData();
    data.then((res) => {
        if(searchKeyword != '')
            res = filterEquipment(searchKeyword.toLowerCase(), res)

        if(res.length == 0){
            var primaryMsg = 'No Results for ' + searchKeyword;
            var secondaryMsg = 'Try checking your spelling or use more general terms'; 
            displayEmptyContent(primaryMsg, secondaryMsg);
        }
        else
            res.forEach(equipment => {
                addProductCards(equipment)
            });

    });
}
const addProductCards = (equipment) => {
    var equipmentCard = document.createElement('a');
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
            
    var discountImage = document.createElement('span');
    discountImage.className = 'discount';
    var discount = document.createTextNode(equipment.discountPercentage + '%');
    discountImage.setAttribute("data-clickSource", "product");
    discountImage.setAttribute("data-productId", 'id='+equipment.id);

    discountImage.appendChild(discount);
    cardImage.appendChild(discountImage);

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

    var productPriceInfo = document.createElement('p');
    var originalPriceText = document.createTextNode('\u20AC' + equipment.amount);
    if(equipment.discountPercentage >= 0){
        var originalPrice = document.createElement('span');
        originalPrice.className = 'discounted-price';
        originalPrice.appendChild(originalPriceText);
        originalPrice.setAttribute("data-clickSource", "product");
        originalPrice.setAttribute("data-productId", 'id='+equipment.id);

        productPriceInfo.appendChild(originalPrice);

        var discountedPriceText = document.createTextNode('\u20AC' + equipment.discountAmount);
        productPriceInfo.appendChild(discountedPriceText);
    }
    else
        productPriceInfo.appendChild(originalPriceText);
        productPriceInfo.setAttribute("data-clickSource", "product");
        productPriceInfo.setAttribute("data-productId", 'id='+equipment.id);

    cardBody.appendChild(producName);
    cardBody.appendChild(productPriceInfo);

    equipmentCard.appendChild(cardImage);
    equipmentCard.appendChild(cardBody);
        
    document.getElementById('equipementList').appendChild(equipmentCard);
}