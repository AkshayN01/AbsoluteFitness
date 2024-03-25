//adds an event listener toonly those elements that has the custom attribute 'data-clickSource'
//data-clickSource specifies the source of the click.
document.addEventListener("click", (e) => {
    const clickSource = e.target.attributes['data-clickSource'];
    if(clickSource == undefined || clickSource == '')
        return;
    e.preventDefault();
    urlRoute(e, clickSource.value);
});

//contains all the routes info such as title, description and page location.
const urlRoutes = {
    404:{
        template: "/pages/404/404.html",
        title: "404",
        description: "Page Not Found",
        intialiseData: function(){}
    },
    "/":{
        template: "/pages/home/home.html",
        title: "Home",
        description: "This page contains all the list of equipment",
        intialiseData: function(param){ displayEquipmentList(param); }
    },
    "/login":{
        template: "/pages/login/login.html",
        title: "login",
        description: "Login page",
        intialiseData: function(){}
    },
    "/cart":{
        template: "/pages/cart/cart.html",
        title: "Cart",
        description: "Contains user's cart",
        intialiseData: function(){ displayCartItems() }
    },
    "/productInfo":{
        template: "/pages/productInfo/productInfo.html",
        title: "ProductInfo",
        description: "Contains information about the product",
        intialiseData: function(){ getProductInfo() }
    },
}

//function to get the url of the page we are about to navigate
const urlFinder = (event, clickSource) => {
    var url = event.target.href;
    if(url == undefined || url == ''){
        if(clickSource == 'product'){
            const productId = event.target.attributes['data-productId'];
            url = window.location.origin + '/productInfo?' + productId.value
        }
        else
            url = window.location.origin + (event.srcElement.parentElement.pathname || '/');
    }
    return url
}

const urlRoute = (event, clickSource) =>{
    event.preventDefault();
    window.history.pushState({}, "", urlFinder(event, clickSource));
    urlLocationHandler(clickSource);
}

const urlLocationHandler = async (clickSource) => {
    const location = window.location.pathname;
    if(location.length == 0)
        location = "/"
    const route = urlRoutes[location] || urlRoutes[404];
    const html = await fetch(route.template).then((response) => response.text());
    document.getElementById("root").innerHTML = html;
    route.intialiseData(clickSource);
}

window.onpopstate = urlLocationHandler;

urlLocationHandler();