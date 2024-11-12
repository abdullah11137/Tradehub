const bar = document.getElementById('bar');
const nav = document.getElementById('navbar');
const close = document.getElementById('close');

if(bar){
    bar.addEventListener('click',()=> {
        nav.classList.add('active');
    })
}
if(close){
    close.addEventListener('click',()=> {
        nav.classList.remove('active');
    })
}


// Cart array to store products
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the localStorage whenever cart is modified
function updateCartStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add a product to the cart
function addToCart(name, price, image ) {
  const existingProduct = cart.find(product => product.name === name && product.price === price);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ name: name, price: parseFloat(price), image: image, quantity: 1 });
  }
  updateCartStorage();
  alert(`${name} added to cart`);
}

// Function to remove an item from the cart by its index
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartStorage();
  displayCart(); // Re-render the cart
}

// Function to display the cart items on cart.html
function displayCart() {
  const cartBody = document.getElementById('cart-body');
  const totalPriceElement = document.getElementById('total-price');
  cartBody.innerHTML = ''; // Clear previous entries

  let total = 0;

  cart.forEach((product, index) => {
    const subtotal = product.price * product.quantity;
    total += subtotal;

    // Create table row
    const row = document.createElement('tr');
    row.innerHTML = `
       <td>
        <button style=" background-color: #088178; color:#fff" class="remove-btn" data-index="${index}">&times;</button>
      </td>
    <td><img src="${product.image}" alt="${product.name}" style="width: 70px; height: 70px;"></td>
      <td>${product.name}</td>
      <td>Rs.${product.price}</td>
      <td>
        <input type="number" value="${product.quantity}" min="1" data-index="${index}" class="quantity-input" />
      </td>
      <td>Rs.${subtotal.toFixed(0)}</td>
     
    `;
    cartBody.appendChild(row);
  });

  totalPriceElement.textContent = total.toFixed(0);
}

// Event listener for Add to Cart buttons (on index.html)
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function () {
    const name = this.getAttribute('data-name');
    const price = this.getAttribute('data-price');
    const image = this.getAttribute('data-image');
    addToCart(name, price, image);
  });
});

// If on cart.html, initialize cart display and functionality
if (document.getElementById('cart-body')) {
  displayCart(); // Display cart items

  // Event listener for removing items from cart
  document.getElementById('cart-body').addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-btn')) {
      const index = e.target.getAttribute('data-index');
      removeFromCart(index);
    }
  });

  // Event listener for updating quantity
  document.getElementById('cart-body').addEventListener('change', function (e) {
    if (e.target.classList.contains('quantity-input')) {
      const index = e.target.getAttribute('data-index');
      const newQuantity = e.target.value;
      cart[index].quantity = newQuantity > 0 ? newQuantity : 1;
      updateCartStorage();
      displayCart(); // Re-render with updated quantity
    }
  });
}
