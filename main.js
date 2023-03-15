let productsContainer = document.querySelector(".products .container");
let userCart = document.querySelector(".cart-items ul");
let total = document.querySelector(".total span");
let cartIcon = document.querySelector(".right-nav > i");
let cartItems = document.querySelector(".cart-items");
let searchSection = document.querySelector(".search-section");
let searchInput = document.querySelector(".search-section > input");
let searchIcon = document.querySelector(".search-section > i");
let middleNav = document.querySelector(".middle-nav");
let amount = 0;
fetch("https://dummyjson.com/products?skip=0&limit=100")
  .then((res) => res.json())
  .then((json) => {
    let products = json.products;
    let productsLen = products.length;
    let titleArray = [];
    let userCartList = [];
    let afterDiscount;

    // Add Products To Page
    for (let i = 0; i < productsLen; i++) {
      addElementsToPage(i);

      titleArray.push(products[i].title.toLowerCase());
    }

    // Search for product Name
    searchIcon.onclick = function () {
      productSearch();
    };
    searchInput.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        productSearch();
      }
    });

    let error = document.createElement("div");

    function productSearch() {
      error.classList.add("error");
      if (searchInput.value === "") {
        productsContainer.innerHTML = "";
        for (let i = 0; i < productsLen; i++) {
          error.innerHTML = "";
          errorText = document.createTextNode("Search Input cannot be empty!");
          error.style.display = "flex";
          addElementsToPage(i);
        }
      } else {
        productsContainer.innerHTML = "";
        for (let i = 0; i < productsLen; i++) {
          if (searchInput.value.toLowerCase() === titleArray[i]) {
            error.innerHTML = "";
            error.style.display = "none";
            return addElementsToPage(i);
          }
        }

        for (let i = 0; i < productsLen; i++) {
          error.innerHTML = "";
          errorText = document.createTextNode(
            "Please enter Valid product name"
          );
          error.style.display = "flex";
          addElementsToPage(i);
        }
      }

      middleNav.appendChild(error);
      error.appendChild(errorText);
    }
    // Add Elements to Page Function
    function addElementsToPage(i) {
      let productBox = document.createElement("div");
      productBox.innerHTML = `
        <div class = "thumbnail">
        <img src = ${products[i].thumbnail}>
        </div>
        <div class ="title">
        <h2>${products[i].title}</h2>
        </div>
        <div class = "info">
        <p class = "description">${products[i].description}</p>
        <div class = "item-info">
        <span class = "price">Price: <span>$${products[i].price}</span></span>
        <span class = "stocks">Stocks: ${products[i].stock}</span>
        </div>
        </div>
        <div class = "add-to-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Add to Cart</span>
        </div> `;

      productBox.classList.add("product-box");
      productBox.setAttribute("item-number", i + 1);
      productsContainer.appendChild(productBox);

      let price = document.querySelectorAll(".item-info .price");
      if (products[i].discountPercentage > 0) {
        price[i].classList.add("discount");
        afterDiscount =
          products[i].price -
          products[i].price * (products[i].discountPercentage / 100);
        price[i].innerHTML = `Price: <span>$${
          products[i].price
        }</span> $${Math.floor(afterDiscount)}</span>`;
      }
    }

    // Trigger getLocalData
    getLocal();
    // add Items To Cart
    document.addEventListener("click", (e) => {
      let x = "";
      if (
        e.target.classList.contains("add-to-cart") ||
        e.target.parentElement.classList.contains("add-to-cart")
      ) {
        if (e.target.parentElement.getAttribute("item-number") === null) {
          x = e.target.parentElement.parentElement.getAttribute("item-number");
        } else {
          x = e.target.parentElement.getAttribute("item-number");
        }
        addItemToCart(x);
      }
    });

    function addItemToCart(x) {
      let itemLis = document.createElement("li"),
        itemDiv = document.createElement("div"),
        itemCount = document.createElement("span"),
        itemName = document.createElement("span"),
        itemPrice = document.createElement("span"),
        deleteIcon = document.createElement("i"),
        afterDiscount;

      const item = {
        id: Date.now(),
        title: x,
      };

      afterDiscount = Math.floor(
        products[x - 1].price -
          products[x - 1].price * (products[x - 1].discountPercentage / 100)
      );
      itemLis.setAttribute("item-number", x);
      itemName.innerHTML = products[x - 1].title;
      itemPrice.innerHTML = `$${afterDiscount}`;

      itemDiv.classList.add("item-cart-info");
      itemName.classList.add("item-name");

      itemLis.setAttribute("item-id", item.id);
      itemPrice.classList.add("item-price");
      deleteIcon.classList.add("fa-regular", "fa-trash-can", "delete");
      cartIcon.classList.add("item-added");

      userCart.appendChild(itemLis);
      itemLis.appendChild(itemDiv);
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemPrice);
      itemLis.appendChild(deleteIcon);

      let deleteIconBtn = document.querySelectorAll(".delete");

      amount += afterDiscount;

      deleteIconBtn.forEach((btn) => {
        btn.onclick = function (e) {
          e.target.parentElement.remove();
          let currentItemNumber =
            e.target.parentElement.getAttribute("item-number");
          amount -= Math.floor(
            products[currentItemNumber - 1].price -
              products[currentItemNumber - 1].price *
                (products[currentItemNumber - 1].discountPercentage / 100)
          );
          total.innerHTML = `Total Amount: ${amount}$`;
          // Remove item From local Storage
          delItem(e.target.parentElement.getAttribute("item-id"));
        };
      });
      total.innerHTML = `Total Amount: ${amount}$`;

      userCartList.push(item);
      // Add Elements to Local Storage
      addLocal(userCartList);
    }
    function addLocal(userCartList) {
      window.localStorage.setItem("item-number", JSON.stringify(userCartList));
    }
    // GET Elements From Local Storage
    function getLocal() {
      let data = localStorage.getItem("item-number");

      if (data) {
        let items = JSON.parse(data);
        for (let i = 0; i < items.length; i++) {
          addItemToCart(items[i].title);
        }
      }
    }
    // Delete Item from Local Storage
    function delItem(itemId) {
      userCartList = userCartList.filter((item) => item.id != itemId);
      addLocal(userCartList);
    }
    // Extra Images Show
    let allImgs = document.querySelectorAll(".thumbnail img");
    let imgsContainer = document.querySelector(".imgs-container");
    let imgsHolder = document.querySelector(".imgs-holder");
    allImgs.forEach((e) => {
      e.onclick = function (e) {
        imgsHolder.style.display = "flex";
        createExtraImgs(e);
      };
    });
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("imgs-holder")) {
        imgsHolder.style.display = "none";
        imgsContainer.innerHTML = "";
      }
    });
    // Create produt Extra images
    function createExtraImgs(e) {
      let imgNumber =
        e.target.parentElement.parentElement.getAttribute("item-number");
      for (let i = 0; i < products[imgNumber - 1].images.length; i++) {
        let imgBox = document.createElement("div"),
          img = document.createElement("img");

        img.setAttribute("src", `${products[imgNumber - 1].images[i]}`);

        imgBox.classList.add("img-box");
        imgBox.appendChild(img);
        imgsContainer.appendChild(imgBox);
      }
    }
  });

cartIcon.onclick = function () {
  cartItems.classList.toggle("show");
  if (cartIcon.classList.contains("item-added")) {
    cartIcon.classList.remove("item-added");
  }
};

cartItems.onclick = function (e) {
  e.stopPropagation();
};

document.addEventListener("click", (e) => {
  if (cartItems.classList.contains("show")) {
    if (e.target !== cartIcon && e.target !== cartItems) {
      cartItems.classList.toggle("show");
    }
  }
});
