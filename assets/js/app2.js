const app = document.querySelector("#app");
const navContainerList = document.querySelector(".nav-container-list");
const menuTitle = document.querySelector("#menu-title");
const menuItemsContainer = document.querySelector(".menu-items");
const menuItemTemplate = document.querySelector("#menu-item-template");
const ordersButtonSpan = document.querySelector(".order-button span");
const orderButton = document.querySelector(".order-button");

const menuItemTemplateHTML = menuItemTemplate.innerHTML;
//const api = new API("https://ooh-menu-api.onrender.com");

const menuNavItems = [];
let dataMenu = [
    { id: 1, type: "main", dish: "Hamburger", price: 15.99, img: "burger.jpeg" },
    { id: 2, type: "main", dish: "Chicken Fingers", price: 12.99, img: "chicken_fingers.jpeg" },
    { id: 3, type: "main", dish: "Pasta", price: 13.00, img: "pasta.jpeg" },
    { id: 4, type: "main", dish: "Parmeasan Pasta", price: 13.69, img: "pasta_parmesan.jpeg" },
    { id: 5, type: "main", dish: "White Pasta", price: 15.21, img: "paste_white.jpeg" },
    { id: 6, type: "main", dish: "Steak", price: 32.51, img: "steak.jpeg" },
    { id: 7, type: "salad", dish: "Salad", price: 9.99, img: "salad.jpeg" },
    { id: 8, type: "salad", dish: "Caesar Salad", price: 13.50, img: "salad_caesar.jpeg" },
    { id: 9, type: "salad", dish: "Vegetable Salad", price: 10.99, img: "salad_vegetable.jpeg" },
    { id: 10, type: "soup", dish: "Lentil Soup", price: 2.00, img: "soup_lentil.jpeg" },
    { id: 11, type: "soup", dish: "Pumpkin Soup", price: 9.82, img: "soup_pumpkin.jpeg" },
    { id: 12, type: "soup", dish: "Tomato Soup", price: 5.99, img: "soup_tomato.jpeg" },
    { id: 13, type: "soup", dish: "Wanton Soup", price: 6.99, img: "soup_wanton.jpeg" },
    { id: 14, type: "dessert", dish: "Carrot Cake", price: 12.59, img: "dessert_carrot_cake.jpeg" },
    { id: 15, type: "dessert", dish: "Chocolate Cake", price: 16.00, img: "dessert_cake.jpeg" },
    { id: 16, type: "dessert", dish: "Chocolate Brownies", price: 13.50, img: "dessert_brownie.jpeg" },
    { id: 17, type: "dessert", dish: "Cookies", price: 7.52, img: "dessert_cookies.jpeg" },
];
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
        //dataMenu = await api.get("/api/menu");
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
