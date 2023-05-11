const app = document.querySelector("#app");
const navContainerList = document.querySelector(".nav-container-list");
const menuTitle = document.querySelector("#menu-title");
const menuItemsContainer = document.querySelector(".menu-items");
const menuItemTemplate = document.querySelector("#menu-item-template");

const menuItemTemplateHTML = menuItemTemplate.innerHTML;
const api = new API("https://ooh-menu-api.onrender.com");

const menuNavItems = [];
let dataMenu = [];

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
            menuTitle.innerText = formatTypeName(type);
            
            // remove the active class
            listItems.forEach(ll => ll.classList.remove("nav-container-list-item-active"));

            // now attach the active class to the nav item that is currently clicked
            l.classList.add("nav-container-list-item-active");

            loadMenuItems(type);
        });
    });
}

function loadMenuItems(type) {
    const dishes = dataMenu.filter(item => item.type === type);
    let dishesHTML = "";
    for(const dish of dishes) {
        let html = menuItemTemplateHTML;
        html = html.replace("{{menu-item-picture}}", `/assets/img/${dish.img}`);
        html = html.replace("{{menu-item-name}}", dish.dish);
        html = html.replace("{{menu-item-price}}", dish.price);

       dishesHTML += html; 
    }

    menuItemsContainer.innerHTML = dishesHTML;
}

(async () => {
    try {
        dataMenu = await api.get("/api/menu");
        loadNavItems();
        loadMenuItems("main");
    } catch (ex) {
        console.log(ex);
        menuItemsContainer.innerHTML = "<h3>Error downloading menu...</h3>";
    }
})();
