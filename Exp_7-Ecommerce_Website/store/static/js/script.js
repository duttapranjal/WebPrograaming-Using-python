/**
 * script.js - Main JavaScript for ShopEasy E-Commerce Website
 * Project: Experiment-7
 * Author: [Your Name]
 * Date: April 2026
 *
 * This file handles:
 * 1. Add to Cart (AJAX request to Django)
 * 2. Remove from Cart (AJAX request to Django)
 * 3. Update Cart Quantity (AJAX request to Django)
 * 4. Toast Notification (popup messages)
 * 5. Cart Badge Update (navbar counter)
 */


// ─────────────────────────────────────────────
// UTILITY: Get CSRF Token
// Django requires a CSRF token for POST requests to prevent attacks.
// We read it from the hidden input Django adds to forms,
// or from the cookie.
// ─────────────────────────────────────────────
function getCsrfToken() {
    // Try to get it from a variable set in the template
    if (typeof CSRF_TOKEN !== 'undefined') {
        return CSRF_TOKEN;
    }
    // Fallback: read from cookie
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return '';
}


// ─────────────────────────────────────────────
// UTILITY: Show Toast Notification
// Displays a small popup message at the bottom of the screen.
// ─────────────────────────────────────────────
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-message');
    if (!toast) return;

    // Set message text and style
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


// ─────────────────────────────────────────────
// UTILITY: Update Cart Badge in Navbar
// Updates the number shown on the cart icon in the navbar.
// ─────────────────────────────────────────────
function updateCartBadge(count) {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.textContent = count;

        // Hide badge if cart is empty
        if (count <= 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = 'flex';
        }
    }
}


// ─────────────────────────────────────────────
// FUNCTION: Add to Cart
// Called when user clicks "Add to Cart" button on a product.
// Sends an AJAX POST request to Django's add_to_cart view.
// ─────────────────────────────────────────────
function addToCart(productId, productName) {
    // Show loading state on button
    const button = document.getElementById(`btn-${productId}`);
    if (button) {
        button.textContent = 'Adding...';
        button.disabled = true;
    }

    // Send POST request to Django
    fetch('/add-to-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),  // Required by Django!
        },
        body: JSON.stringify({ product_id: productId }),
    })
    .then(response => response.json())  // Parse JSON response
    .then(data => {
        if (data.success) {
            // Show success toast message
            showToast(`✅ ${productName} added to cart!`, 'success');

            // Update the cart badge number
            updateCartBadge(data.cart_count);

            // Update button to show "Added ✓"
            if (button) {
                button.textContent = 'Added ✓';
                button.classList.add('added');

                // Reset button after 2 seconds
                setTimeout(() => {
                    button.textContent = '+ Add to Cart';
                    button.classList.remove('added');
                    button.disabled = false;
                }, 2000);
            }
        } else {
            // Show error message
            showToast(`❌ ${data.message}`, 'error');
            if (button) {
                button.textContent = '+ Add to Cart';
                button.disabled = false;
            }
        }
    })
    .catch(error => {
        // Network or other error
        console.error('Add to cart error:', error);
        showToast('❌ Something went wrong. Please try again.', 'error');
        if (button) {
            button.textContent = '+ Add to Cart';
            button.disabled = false;
        }
    });
}


// ─────────────────────────────────────────────
// FUNCTION: Remove from Cart
// Called when user clicks the ✕ button on a cart item.
// ─────────────────────────────────────────────
function removeFromCart(productId) {
    // Ask for confirmation before removing
    if (!confirm('Remove this item from your cart?')) return;

    fetch('/remove-from-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ product_id: productId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the item row from the DOM (no page reload!)
            const itemElement = document.getElementById(`cart-item-${productId}`);
            if (itemElement) {
                // Fade out animation before removing
                itemElement.style.transition = 'opacity 0.3s, transform 0.3s';
                itemElement.style.opacity = '0';
                itemElement.style.transform = 'translateX(-20px)';
                setTimeout(() => itemElement.remove(), 300);
            }

            // Update cart total in summary box
            updateCartTotal(data.cart_total, data.cart_count);

            // Update navbar badge
            updateCartBadge(data.cart_count);

            showToast('🗑️ Item removed from cart', 'success');

            // If cart is now empty, reload to show empty cart message
            if (data.cart_count === 0) {
                setTimeout(() => location.reload(), 800);
            }
        } else {
            showToast(`❌ ${data.message}`, 'error');
        }
    })
    .catch(error => {
        console.error('Remove from cart error:', error);
        showToast('❌ Something went wrong.', 'error');
    });
}


// ─────────────────────────────────────────────
// FUNCTION: Update Cart Quantity (+ / -)
// Called when user clicks the + or - buttons on cart page.
// ─────────────────────────────────────────────
function updateCart(productId, action) {
    fetch('/update-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken(),
        },
        body: JSON.stringify({ product_id: productId, action: action }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.removed) {
                // Item quantity reached 0 - remove the row
                const itemElement = document.getElementById(`cart-item-${productId}`);
                if (itemElement) {
                    itemElement.style.transition = 'opacity 0.3s';
                    itemElement.style.opacity = '0';
                    setTimeout(() => itemElement.remove(), 300);
                }
                showToast('🗑️ Item removed from cart', 'success');

                // Reload if cart is empty
                if (data.cart_count === 0) {
                    setTimeout(() => location.reload(), 800);
                }
            } else {
                // Update quantity display
                const qtyDisplay = document.getElementById(`qty-${productId}`);
                if (qtyDisplay) {
                    qtyDisplay.textContent = data.quantity;
                    // Small bounce animation on quantity change
                    qtyDisplay.style.transform = 'scale(1.4)';
                    setTimeout(() => { qtyDisplay.style.transform = 'scale(1)'; }, 200);
                }

                // Update item total
                const itemTotal = document.getElementById(`item-total-${productId}`);
                if (itemTotal) {
                    itemTotal.textContent = `₹${data.item_total}`;
                }
            }

            // Update the cart summary totals
            updateCartTotal(data.cart_total, data.cart_count);

            // Update navbar badge
            updateCartBadge(data.cart_count);
        }
    })
    .catch(error => {
        console.error('Update cart error:', error);
        showToast('❌ Something went wrong.', 'error');
    });
}


// ─────────────────────────────────────────────
// HELPER: Update Cart Total Display
// Updates the total price shown in the cart summary box.
// ─────────────────────────────────────────────
function updateCartTotal(newTotal, itemCount) {
    // Update summary box total
    const summaryTotal = document.getElementById('summary-total');
    if (summaryTotal) summaryTotal.textContent = `₹${newTotal}`;

    // Update grand total
    const grandTotal = document.getElementById('grand-total');
    if (grandTotal) grandTotal.textContent = `₹${newTotal}`;

    // Update item count in subtitle (optional)
    const subtitle = document.querySelector('.section-subtitle');
    if (subtitle && itemCount !== undefined) {
        subtitle.textContent = `${itemCount} item(s) in your cart`;
    }
}


// ─────────────────────────────────────────────
// PAGE LOAD: Initialize cart badge
// When the page loads, make sure the badge shows correctly.
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    // Hide badge if it shows "0"
    const badge = document.getElementById('cart-badge');
    if (badge && (badge.textContent === '0' || badge.textContent === '')) {
        badge.style.display = 'none';
    }

    // Add smooth transition to qty displays
    const qtyDisplays = document.querySelectorAll('.qty-display');
    qtyDisplays.forEach(el => {
        el.style.transition = 'transform 0.2s ease';
    });

    console.log('✅ ShopEasy script.js loaded successfully!');
});
