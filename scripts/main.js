$(document).ready(() => {
    displayEquipmentList();
})

const readJsonFile = (filename) => {
    return new Promise((response) => {
        $.ajax({
            url: filename, // as all the json data will be present in the file
            type: "GET", // Type of Request
            headers: {
                'accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
            },
    
            // Function to call when to
            // request is ok 
            success: function (data) {
                response(data);
            },
    
            // Error handling 
            error: function (error) {
                console.log(`Error ${error}`);
            }
        });
    });
}

const getData = async (url) => {
    data = await readJsonFile(url);

    return data;
}

const displayEquipmentList = () => {
    // var equipmentList = [];
    data  = getData('./data/equipment.json');
    data.then((res) => {
        res.forEach(equipment => {
            var equipmentCard = document.createElement('div');
            equipmentCard.className = 'card';
            
            // card top
            var cardImage = document.createElement('div');
            cardImage.style.backgroundImage = "url(" + equipment.images.displayImageUrl + ")";
            cardImage.className = 'card-top';
            
            var discountImage = document.createElement('span');
            discountImage.className = 'discount';
            var discount = document.createTextNode(equipment.discountPercentage + '%');

            discountImage.appendChild(discount);
            cardImage.appendChild(discountImage);

            // card body
            var cardBody = document.createElement('div');
            cardBody.className = 'container';

            var producName = document.createElement('h4');
            var productNameText = document.createTextNode(equipment.name);
            producName.appendChild(productNameText);

            var productPriceInfo = document.createElement('p');
            var originalPriceText = document.createTextNode('\u20AC' + equipment.amount);
            if(equipment.discountPercentage >= 0){
                var originalPrice = document.createElement('span');
                originalPrice.className = 'discounted-price';
                originalPrice.appendChild(originalPriceText);

                productPriceInfo.appendChild(originalPrice);

                var discountedPriceText = document.createTextNode('\u20AC' + equipment.discountAmount);
                productPriceInfo.appendChild(discountedPriceText);
            }
            else
                productPriceInfo.appendChild(originalPriceText);

            cardBody.appendChild(producName);
            cardBody.appendChild(productPriceInfo);

            equipmentCard.appendChild(cardImage);
            equipmentCard.appendChild(cardBody);
        
            document.getElementById('equipementList').appendChild(equipmentCard);
        });

    });
}