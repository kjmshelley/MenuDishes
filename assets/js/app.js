const app = document.querySelector("#app");
const navContainerList = document.querySelector(".nav-container-list");
const menuTitle = document.querySelector("#menu-title");
const menuItemsContainer = document.querySelector(".menu-items");
const menuItemTemplate = document.querySelector("#menu-item-template");
const ordersButtonSpan = document.querySelector(".order-button span");
const orderButton = document.querySelector(".order-button");

const menuItemTemplateHTML = menuItemTemplate.innerHTML;
const api = new API("https://ooh-menu-api.onrender.com");

const menuNavItems = [];
let dataMenu = [];
let orders = [];

const formatTypeName = (type) => `${type[0].toUpperCase()}${type.substring(1)}`;

function loadNavItems() {
    // first get list of types
    const arrayOfTypes = dataMenu.map(m => m.type);
    
    // create unique list of types 
    const list = arrayOfTypes.filter((cv, i, arr) => {
        // everytime you see this value for the first time, return true. all other times return false
        //console.log(cv, i, arr.indexOf(cv), arr.indexOf(cv) === i, arr);
        return arr.indexOf(cv) === i;
    });
    
    for (const type in list) {
        const li = document.createElement("li");
        let value = formatTypeName(list[type]);
        
        if (type == 0) {
            li.classList.add("nav-container-list-item-active");
            value = `${value} Dishes`;
            menuTitle.innerText = value;
        }

        li.innerText = value;
        li.classList.add("nav-container-list-item");
        li.setAttribute("data-type", list[type]);

        navContainerList.append(li);
    }

    const listItems = document.querySelectorAll(".nav-container-list-item");
    listItems.forEach(l => {
        l.addEventListener("click", (evt) => {
            const type = l.dataset.type;
            menuTitle.innerText = type === "main" ? `${formatTypeName(type)} Dishes` : formatTypeName(type);
            
            // remove the active class
            listItems.forEach(ll => ll.classList.remove("nav-container-list-item-active"));

            // now attach the active class to the nav item that is currently clicked
            l.classList.add("nav-container-list-item-active");

            loadMenuItems(type);
        });
    });
}

function loadMenuItems(type) {
    let dishes = [];
    if (Array.isArray(type)) { // this will be a list of orders
        let listOfOrders = type;
        dishes = dataMenu.filter(item => listOfOrders.indexOf(item.id) > -1);
        menuTitle.innerText = "My Orders";
        document.querySelectorAll(".nav-container-list-item").forEach(ll => ll.classList.remove("nav-container-list-item-active"));
    } else {
        dishes = dataMenu.filter(item => item.type === type);
    }
    
    let dishesHTML = "";
    for(const dish of dishes) {
        let html = menuItemTemplateHTML;
        html = html.replace("{{menu-item-picture}}", `/assets/img/${dish.img}`);
        html = html.replace("{{menu-item-name}}", dish.dish);
        html = html.replace("{{menu-item-price}}", dish.price);
        html = html.replace("{{id}}", dish.id);

       dishesHTML += html; 
    }

    menuItemsContainer.innerHTML = dishesHTML;

    // we need to re attach the event to the order buttons
    const buttons = document.querySelectorAll(".button");
    if (buttons.length === 0) return;

    if (Array.isArray(type)) { // this will be a list of orders
        buttons.forEach(btn => btn.style.display = "none");
        return;
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", evt => {
            const id = btn.dataset.id;
            orders.push(parseInt(id));
            ordersButtonSpan.innerText = orders.length;
        });
    });
}

(async () => {
    try {
        dataMenu = await api.get("/api/menu");
        loadNavItems();
        loadMenuItems("main");

        orderButton.addEventListener("click", evt => {
            loadMenuItems(orders);
        });

    } catch (ex) {
        console.log(ex);
        menuItemsContainer.innerHTML = "<h3>Error downloading menu...</h3>";
    }
})();
