const equipmentJSONFilePath = './data/equipment.json';
const sessionStorageCartName = 'cart-items';

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

const getData = async () => {
    data = await readJsonFile(equipmentJSONFilePath);
    return data;
}

const filterEquipment = (searchKeyword, data) => {
    const filterKeys = ['name', 'productType', 'subCategory', 'brandName'];
    var filteredData = data.filter(item => {
        var isValid = false;
        filterKeys.every(key => {
            if(item[key].toLowerCase().includes(searchKeyword)){
                isValid = true;
                return false;
            }
            return true; //every func will stop if not returned true
        });
        return isValid;
    });

    return filteredData;
}



const displayEmptyContent = (primaryMsg, secondaryMsg) => {
    var outerDiv = document.createElement('div');
    outerDiv.className = 'noResults';

    var title = document.createElement('h2');
    var titleText = document.createTextNode(primaryMsg);
    title.appendChild(titleText);

    var message = document.createElement('p');
    var messageText = document.createTextNode(secondaryMsg);
    message.appendChild(messageText);

    outerDiv.appendChild(title);
    outerDiv.appendChild(message);

    document.getElementById('root').appendChild(outerDiv);
}



const setSessionStorage = (item) => {
    var cartItems = [];
    var cartItemsData = sessionStorage.getItem(sessionStorageCartName);
    if(cartItemsData != undefined && cartItemsData != null && cartItems != '[]'){
        cartItems = JSON.parse(cartItemsData);
        var objIndex = cartItems.findIndex(obj => obj.id == item.id);
        if(objIndex >= 0){
            if(item.quantity == 0){
                cartItems.splice(objIndex,1);
            }
            else{
                cartItems[objIndex].quantity = item.quantity;
            }
        }
        else{
            cartItems.push(item);
        }
    }
    else{
        cartItems.push(item);
    }
    sessionStorage.setItem(sessionStorageCartName, JSON.stringify(cartItems));
}

function openNav() {
    document.getElementById("sidenav").style.width = "250px";
}
  
function closeNav() {
    document.getElementById("sidenav").style.width = "0";
}