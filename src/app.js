"use strict";

import {
  fetchResult,
  productURL,
  showLoader,
  hideLoader,
  displayNumberOfItemsAddedInCart,
} from "../src/js/utils";

const createCardFromProduct = (product) => {
  return `<div class="card">
  <a href="../src/pages/details.html?product_id=${product.id}">
    <img src="${product.imgURL}" />
  </a>
  <a href="../src/pages/details.html?product_id=${product.id}">
    <h4>${product.name}</h4>
  </a>
  <p>$${product.price}</p>
  <div> 
    <a href="./src/pages/details.html?product_id=${product.id}">View product &rarr;</a>
  </div>
  </div>
  `;
};

const showProducts = async () => {
  displayNumberOfItemsAddedInCart();
  scroll(0, 0);
  showLoader("products", "loader");
  const products = await fetchResult(productURL);
  const productCard = products.map((product) => createCardFromProduct(product));
  const cardString = productCard.join("");
  document.querySelector(".products").innerHTML = cardString;
  hideLoader("loader", "products");
};

window.addEventListener("load", showProducts);

const showSelectedCategoryProducts = async (value) => {
  showLoader("products", "loader");
  const products = await fetchResult(productURL);
  const filteredProducts = products.filter((p) => p.category == `${value}`);
  const filteredProductsCards = filteredProducts.map((product) =>
    createCardFromProduct(product)
  );
  const filteredInnerHTMLProducts = filteredProductsCards.join("");
  document.querySelector(".products").innerHTML = filteredInnerHTMLProducts;
  hideLoader("loader", "products");
};

const clickedCategory = (event) => {
  // Uncheck the other options
  if (event.target.type == "checkbox") {
    const checkboxes = document
      .querySelector(".category")
      .querySelectorAll("[type=checkbox]");

    checkboxes.forEach((checkbox) => {
      if (checkbox != event.target) {
        checkbox.checked = false;
      }
    });
  }

  if (event.target.checked == true) {
    const specifiedCategory = event.target.id;
    showSelectedCategoryProducts(specifiedCategory);
  } else if (event.target.checked == false) {
    showProducts();
  }
};

document.querySelector(".category").addEventListener("click", clickedCategory);
