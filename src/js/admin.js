"use strict";

import {
  productURL,
  fetchResult,
  showLoader,
  hideLoader,
  displayNumberOfItemsAddedInCart,
} from "./utils";

let allProducts;
let productScheme = {
  name: "",
  price: "",
  imgURL: "",
  description: "",
  category: "",
  stock: "",
};
let response;
const confirmationMessageEl = document.querySelector(".confirmation");

const createTable = () => {
  document.querySelector(".all-products").innerHTML = `
  <table class="table">
    <tr>
      <th>#</th>
      <th>Image</th>
      <th>Name</th>
      <th>Price</th>
      <th>Stock</th>
      <th>Category</th>
      <th>Handle</th>
    </tr>
  </table>
  `;

  const tableEl = document.querySelector(".table");
  allProducts.forEach((product) => {
    let row = tableEl.insertRow(1);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);
    let cell7 = row.insertCell(6);

    cell1.innerHTML = `<span>${product.id}</span>`;
    cell2.innerHTML = `<a href="../pages/details.html?product_id=${product.id}"><img src=${product.imgURL} width="85px"></img></a>`;
    cell3.innerHTML = `<p>${product.name}</p>`;
    cell4.innerHTML = `<span>$${product.price}</span>`;
    cell5.innerHTML = `<span>${product.stock}</span>`;
    cell6.innerHTML = `<p>${product.category}</p>`;
    cell7.innerHTML = `
      <button class="yellowBtn editBtn" product-id="${product.id}">
        <i class="fa-solid fa-pencil editBtn" product-id="${product.id}"></i>
      </button>
      <button class="redBtn deleteBtn"  product-id="${product.id}">
        <i class="fa-solid fa-trash" product-id="${product.id}"></i>
      </button>
    `;
  });
};

const createForm = (product, btnClassName, textBtn, iIcon, productID) => {
  const formEl = document.querySelector(".tableForm");
  formEl.innerHTML = `
    <div class="form">
        <div class="item">
          <label for="name">Name</label>
          <input type="text" id="name" value="${product.name}"/>
        </div>
      <div class="item">
        <label for="price">Price</label>
        <input type="number" id="price" value="${product.price}"/>
      </div>
      <div class="item">
        <label for="image">Image URL</label>
        <input type="text" id="image" value="${product.imgURL}"/>
      </div>
      <div class="item">
        <label for="description">Description</label>
        <textarea name="" id="description">${product.description}</textarea>
      </div>
      <div class="item">
        <label for="category">Category</label>
        <input type="text" id="category" value="${product.category}"/>
      </div>
      <div class="item">
        <label for="stock">Stock</label>
        <input type="number" id="stock" value="${product.stock}"/>
      </div>
      <div class="cancel-and-the-other-btn">
        <div class="otherBtn">
          <button class="${btnClassName}" product-id="${productID}">
          <i class="${iIcon}"> </i>${textBtn}
        </button>
        </div>
        <div class="cancel">
          <button class="redBtn">
          <i class="fa-solid fa-xmark"> </i>Cancel
          </button>
        </div>
        </div>
        <!--
        <div class="confirmation"><p>Message</p></div>
        -->

    </div>
  `;
};

const showAllProducts = async () => {
  displayNumberOfItemsAddedInCart();

  showLoader("admin-container", "loader");
  allProducts = await fetchResult(productURL);
  createTable(allProducts);
  hideLoader("loader", "admin-container");

  document
    .querySelector(".admin-container")
    .addEventListener("click", showForm);
  document
    .querySelector(".tableForm")
    .addEventListener("click", addUpdateAndCancel);
};

window.addEventListener("DOMContentLoaded", showAllProducts);

const showForm = async (e) => {
  let productId = e.target.getAttribute("product-id");

  const changeBackround = () => {
    document.querySelector(".admin-container").style.filter =
      "brightness(0.5) blur(1px)";
    document.querySelector(".tableForm").style.display = "block";
    document.querySelector(".tableForm").style.zIndex = "10";
  };

  if (e.target.id == "addBtn") {
    changeBackround();
    createForm(
      productScheme,
      "greenBtn addBtn",
      "Add product",
      "fa-sharp fa-solid fa-plus"
    );
  } else if (e.target.classList.contains("editBtn")) {
    let specificProductById = await fetchResult(`${productURL}${productId}`);
    changeBackround();
    createForm(
      specificProductById,
      "yellowBtn updateBtn",
      "Update",
      "fa-solid fa-arrows-rotate",
      productId
    );
  } else if (
    e.target.classList.contains("deleteBtn") ||
    e.target.classList.contains("fa-trash")
  ) {
    let response = await fetch(`${productURL}${productId}`, {
      method: "DELETE",
    });
    console.log(response);
    showAllProducts();
  }
};

const addUpdateAndCancel = async (e) => {
  let productId = e.target.getAttribute("product-id");

  const hideForm = () => {
    document.querySelector(".admin-container").style.removeProperty("filter");
    document.querySelector(".tableForm").style.display = "none";
    document.querySelector(".tableForm").style.zIndex = "-1";
  };

  if (e.target.classList.contains("addBtn")) {
    await postAndPutMethods(productURL, "POST", "Product added");
    hideForm();
    await showAllProducts();
  } else if (e.target.classList.contains("updateBtn")) {
    await postAndPutMethods(`${productURL}${productId}`, "PUT", "updated");
    hideForm();
    await showAllProducts();
  } else if (
    e.target.classList.contains("redBtn") ||
    e.target.classList.contains("fa-xmark")
  ) {
    hideForm();
  }
};

const postAndPutMethods = async (URL, HTTPMethod, responseMessage) => {
  response = await fetch(URL, {
    method: HTTPMethod,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.querySelector("#name").value,
      price: document.querySelector("#price").value,
      imgURL: document.querySelector("#image").value,
      description: document.querySelector("#description").value,
      category: document.querySelector("#category").value,
      stock: document.querySelector("#stock").value,
    }),
  });
  let data = await response.json();
  console.log(responseMessage, data);
  // showConfirmationMessage();
};

// const showConfirmationMessage = (message) => {
//   if (response.ok) {
//     confirm.textContent = `The book has been ${string}.`;
//   } else {
//     confirm.classList.add("redBg");
//     confirm.textContent = "There was a problem, view console log.";
//   }
//   confirm.style.display = "block";
//   setTimeout(() => {
//     confirm.style.display = "none";
//   }, 1000);
// };
