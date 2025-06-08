document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const categoryTitle = document.getElementById("category-title");
  const filterSection = document.getElementById("filter-section");
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const sortSelect = document.getElementById("sortPrice");

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const view = params.get("view");

  const baseProducts = window.products || [];
  const localProducts = JSON.parse(localStorage.getItem("localProducts")) || [];
  const productMap = new Map();
  baseProducts.forEach(p => productMap.set(p.id, p));
  localProducts.forEach(p => productMap.set(p.id, p));
  const allProducts = Array.from(productMap.values());

  const enableFilters = view === "shop";
  if (enableFilters && filterSection) {
    filterSection.classList.remove("d-none");
  }

  const showToast = (message) => {
  const toast = document.createElement("div");

  toast.className = "toast-notification position-fixed top-0 end-0 alert alert-success shadow";
  toast.style.margin = "80px 20px 0 0";
  toast.style.zIndex = "1055";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
};

  const renderProducts = () => {
    productGrid.innerHTML = "";

    let filtered;

    if (enableFilters) {
      const selectedCategories = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

      filtered = allProducts.filter(p => {
        const categoryMatch = selectedCategories.includes(p.category);
        const saleMatch = selectedCategories.includes("sale") && p.sale;
        return selectedCategories.length === 0 || categoryMatch || saleMatch;
      });
    } else {
      if (type === "sale") {
        filtered = baseProducts.filter(p => p.sale);
      } else if (type === "all") {
        filtered = allProducts;
      } else {
        filtered = allProducts.filter(p => p.category.toLowerCase() === type.toLowerCase());
      }
    }

    const sortVal = sortSelect?.value;
    if (sortVal === "asc") filtered.sort((a, b) => a.price - b.price);
    else if (sortVal === "desc") filtered.sort((a, b) => b.price - a.price);

    if (filtered.length === 0) {
      productGrid.innerHTML = `<p class="text-center">No products found.</p>`;
      return;
    }

    filtered.forEach(product => {
      const col = document.createElement("div");
      col.className = "col-md-3 mb-4";

      const sizeId = `size-${product.id}`;
      let availableSizes = product.sizesAvailable;

      if (!Array.isArray(availableSizes)) {
        availableSizes = ["S", "M", "L", "XL"];
      }

      const isOutOfStock = availableSizes.length === 0;

      const sizeOptions = !isOutOfStock
        ? availableSizes.map(size => `<option value="${size}">${size}</option>`).join("")
        : "";

      col.innerHTML = `
        <div class="product-card h-100 p-2 border rounded shadow-sm">
          <img src="${product.image}" class="img-fluid mb-2" alt="${product.name}" />
          <h6 class="product-name fw-bold">${product.name}</h6>
          <p class="product-price">$${product.price}</p>

          ${
            isOutOfStock
              ? `<span class="badge bg-danger mb-2">Out of Stock</span>`
              : `
              <label for="${sizeId}" class="form-label">Select Size:</label>
              <select id="${sizeId}" class="form-select mb-2">
                <option value="">Choose...</option>
                ${sizeOptions}
              </select>`
          }

          <button class="btn btn-sm btn-outline-dark add-to-cart" data-id="${product.id}" ${isOutOfStock ? "disabled" : ""}>
            Add to Cart
          </button>
        </div>
      `;

      productGrid.appendChild(col);

      if (!isOutOfStock) {
        const sizeSelect = col.querySelector("select");
        const addBtn = col.querySelector(".add-to-cart");

        addBtn.addEventListener("click", () => {
          const selectedSize = sizeSelect.value;

          if (!selectedSize) {
            showToast("Please select a size before adding to cart.");
            return;
          }

          const cart = JSON.parse(localStorage.getItem("cart")) || [];
          const existing = cart.find(item => item.id === product.id && item.size === selectedSize);

          if (existing) {
            existing.quantity += 1;
          } else {
            cart.push({ ...product, quantity: 1, size: selectedSize });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          showToast(`${product.name} (Size ${selectedSize}) added to cart!`);
        });
      }
    });
  };

  if (enableFilters) {
    checkboxes.forEach(cb => cb.addEventListener("change", renderProducts));
    sortSelect?.addEventListener("change", renderProducts);
  }

  categoryTitle.textContent =
    type === "all" ? "All Collection" : `${type.charAt(0).toUpperCase()}${type.slice(1)} Collection`;

  renderProducts();
});
