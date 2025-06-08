document.addEventListener("DOMContentLoaded", () => {
  const summaryDiv = document.getElementById("checkout-summary");
  const couponInput = document.getElementById("coupon");
  const form = document.getElementById("checkout-form");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  let couponApplied = false;
  let subtotal = 0;
  let discount = 0;

  if (!loggedUser) {
    alert("You must be logged in to access checkout.");
    window.location.href = "auth.html";
    return;
  }

  document.getElementById("fullName").value = loggedUser.name;
  document.getElementById("ownerEmail").value = loggedUser.email;

  if (cart.length === 0) {
    summaryDiv.innerHTML = "<p>Your cart is empty. <a href='index.html'>Shop now</a>.</p>";
    form.style.display = "none";
    return;
  }

  summaryDiv.innerHTML = "<ul class='list-group mb-3'></ul>";
  const listGroup = summaryDiv.querySelector("ul");

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    const sizeDisplay = item.size ? `Size ${item.size}, ` : "";
    li.innerHTML = `${item.name} (${sizeDisplay}x${item.quantity}) <span>$${(item.price * item.quantity).toFixed(2)}</span>`;
    subtotal += item.price * item.quantity;
    listGroup.appendChild(li);
  });

  couponInput.addEventListener("change", () => {
    const code = couponInput.value.trim().toUpperCase();
    const existingDiscount = document.getElementById("discount-row");
    if (existingDiscount) existingDiscount.remove();

    if (code === "WELCOME10") {
      couponApplied = true;
      discount = subtotal * 0.10;

      const discountLi = document.createElement("li");
      discountLi.id = "discount-row";
      discountLi.className = "list-group-item d-flex justify-content-between text-success";
      discountLi.innerHTML = `Coupon Applied (WELCOME10) <span>-$${discount.toFixed(2)}</span>`;
      listGroup.insertBefore(discountLi, listGroup.lastElementChild);
    } else if (code !== "") {
      couponApplied = false;
      discount = 0;
      alert("Invalid coupon code.");
    }

    const totalAmount = subtotal - discount;
    document.getElementById("total-row").innerHTML = `Total <span>$${totalAmount.toFixed(2)}</span>`;
  });

  const totalLi = document.createElement("li");
  totalLi.className = "list-group-item d-flex justify-content-between fw-bold";
  totalLi.id = "total-row";
  totalLi.innerHTML = `Total <span>$${(subtotal - discount).toFixed(2)}</span>`;
  listGroup.appendChild(totalLi);

  form.addEventListener("submit", e => {
    e.preventDefault();

    const code = couponInput.value.trim().toUpperCase();
    if (code && code !== "WELCOME10") {
      alert("Invalid coupon code. Please correct it before placing the order.");
      return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const recipientName = document.getElementById("recipientName").value.trim();
    const ownerEmail = document.getElementById("ownerEmail").value.trim();
    const submitEmail = document.getElementById("submitEmail").value.trim();
    const address = form.querySelector("textarea").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    const userOrders = JSON.parse(localStorage.getItem("userOrders")) || {};
    const userEmail = loggedUser.email;

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      registeredName: fullName,
      recipientName: recipientName || null,
      registeredEmail: ownerEmail,
      alternateEmail: submitEmail || null,
      paymentMethod,
      shippingAddress: address,
      items: cart,
      subtotal,
      discount,
      total: subtotal - discount
    };

    if (!userOrders[userEmail]) userOrders[userEmail] = [];
    userOrders[userEmail].push(newOrder);

    localStorage.setItem("userOrders", JSON.stringify(userOrders));
    localStorage.removeItem("cart");

    let message = "Order placed successfully!\n\n";

    if (recipientName) message += `Recipient: ${recipientName}\n`;

    if (!submitEmail || ownerEmail.toLowerCase() === submitEmail.toLowerCase()) {
      message += `Updates and tracking will be shared via: ${ownerEmail}\n`;
    } else {
      message += `Registered Email: ${ownerEmail}\n`;
      message += `Alternate Contact Email: ${submitEmail}\n`;
    }

    if (paymentMethod === "cod") {
      message += `Payment Method: Cash on Delivery (COD)\nPlease keep the amount ready at the time of delivery.`;
    } else {
      message += `Payment: A payment link will be shared via email.\nPlease complete payment within 24 hours to confirm your order.`;
    }

    alert(message);
    window.location.href = "index.html";
  });
});
