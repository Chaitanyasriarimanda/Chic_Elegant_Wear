document.addEventListener("DOMContentLoaded", () => {
  const saleContainer = document.getElementById("summer-sale");

  const baseProducts = window.products || [];
  const localProducts = JSON.parse(localStorage.getItem("localProducts")) || [];
  const allProducts = [...baseProducts, ...localProducts];

  if (saleContainer) {
    const staticSaleProducts = baseProducts.filter(p => p.sale);
    staticSaleProducts.forEach(product => {
      const productCard = document.createElement("div");
      productCard.className = "col-md-3 product-card";
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h6 class="product-name">${product.name}</h6>
        <p class="product-price">$${product.price}</p>
        <span class="sale-badge">50% OFF</span>
      `;
      saleContainer.appendChild(productCard);
    });
  }

  // Login / Dropdown Menu
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const loginItem = document.getElementById("login-item");
  const logoutItem = document.getElementById("logout-item");

  if (user && loginItem && logoutItem) {
    loginItem.classList.add("d-none");
    logoutItem.innerHTML = `
      <div class="dropdown">
        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Welcome, ${user.name.split(" ")[0]}
        </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a class="dropdown-item" href="orders.html">My Orders</a></li>
          <li><a class="dropdown-item text-danger" href="#" id="logout-btn">Logout</a></li>
        </ul>
      </div>
    `;
    logoutItem.classList.remove("d-none");
  }

  // --- Handle Logout ---
  document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
    }
  });
});

