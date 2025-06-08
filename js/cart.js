function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElem = document.getElementById("cart-total");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalElem.textContent = "0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    // Determine available sizes
    let sizesAvailable = Array.isArray(item.sizesAvailable) ? item.sizesAvailable : ["S", "M", "L", "XL"];
    const isOutOfStock = sizesAvailable.length === 0;

    // Dropdown or out of stock badge
    const sizeOptions = sizesAvailable.map(size => `
      <option value="${size}" ${item.size === size ? "selected" : ""}>${size}</option>
    `).join("");

    const sizeSelectHTML = isOutOfStock
      ? `<span class="badge bg-danger">Out of Stock</span>`
      : `<select class="form-select form-select-sm size-select mb-1" data-index="${index}" style="width:100px;">
           ${sizeOptions}
         </select>`;

    const div = document.createElement("div");
    div.className = "d-flex align-items-center justify-content-between border-bottom py-3";
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${item.image}" style="width:80px; height:100px; object-fit:cover; margin-right:15px;" />
        <div>
          <h6 class="mb-1">${item.name}</h6>
          <p class="mb-1">$${item.price}</p>
          <label class="form-label mb-1">Size:</label>
          ${sizeSelectHTML}
          <input type="number" min="1" value="${item.quantity}" class="form-control form-control-sm quantity-input" data-index="${index}" style="width:70px;" />
        </div>
      </div>
      <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${index})">Remove</button>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotalElem.textContent = total.toFixed(2);
  attachQuantityListeners();
  attachSizeListeners();
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function attachQuantityListeners() {
  document.querySelectorAll(".quantity-input").forEach(input => {
    input.addEventListener("change", e => {
      const index = e.target.dataset.index;
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity = parseInt(e.target.value);
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });
  });
}

function attachSizeListeners() {
  document.querySelectorAll(".size-select").forEach(select => {
    select.addEventListener("change", e => {
      const index = e.target.dataset.index;
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].size = e.target.value;
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCart();
    });
  });
}

document.addEventListener("DOMContentLoaded", loadCart);
