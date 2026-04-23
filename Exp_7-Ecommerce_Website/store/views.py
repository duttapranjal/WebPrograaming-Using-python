"""
Views for the ShopEasy e-commerce store.
Project: ShopEasy E-Commerce Website
Author: [Your Name]
Date: April 2026

This file handles:
- Homepage (product listing)
- Cart (add, remove, update)
- Checkout
- Order confirmation
"""

import json
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Product


# ─────────────────────────────────────────────
# Helper: Get cart from session
# ─────────────────────────────────────────────
def get_cart(request):
    """
    Returns the cart stored in the user's session.
    Cart format: { product_id: { name, price, quantity, emoji } }
    """
    return request.session.get('cart', {})


def save_cart(request, cart):
    """Save the cart back into the session."""
    request.session['cart'] = cart
    request.session.modified = True  # Tell Django the session changed


def get_cart_count(request):
    """Returns total number of items (sum of quantities) in cart."""
    cart = get_cart(request)
    return sum(item['quantity'] for item in cart.values())


def get_cart_total(request):
    """Returns the total price of all cart items."""
    cart = get_cart(request)
    return sum(float(item['price']) * item['quantity'] for item in cart.values())


# ─────────────────────────────────────────────
# View 1: Homepage - Product Listing
# ─────────────────────────────────────────────
def index(request):
    """
    Homepage view - shows all available products.
    """
    products = Product.objects.filter(is_available=True)
    cart_count = get_cart_count(request)

    context = {
        'products': products,
        'cart_count': cart_count,
    }
    return render(request, 'store/index.html', context)


# ─────────────────────────────────────────────
# View 2: Cart Page
# ─────────────────────────────────────────────
def cart(request):
    """
    Cart view - shows all items added to cart.
    """
    cart_data = get_cart(request)
    cart_items = []

    # Build a list of cart items with calculated totals
    for product_id, item in cart_data.items():
        item_total = float(item['price']) * item['quantity']
        cart_items.append({
            'id': product_id,
            'name': item['name'],
            'price': item['price'],
            'quantity': item['quantity'],
            'emoji': item.get('emoji', '📦'),
            'total': round(item_total, 2),
        })

    # Calculate overall cart total
    cart_total = sum(item['total'] for item in cart_items)
    cart_count = get_cart_count(request)

    context = {
        'cart_items': cart_items,
        'cart_total': round(cart_total, 2),
        'cart_count': cart_count,
    }
    return render(request, 'store/cart.html', context)


# ─────────────────────────────────────────────
# View 3: Add to Cart (AJAX)
# ─────────────────────────────────────────────
@require_POST
def add_to_cart(request):
    """
    Adds a product to the cart (called via AJAX from product page).
    """
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))
        product = Product.objects.get(id=product_id)

        cart = get_cart(request)

        # If product already in cart, increase quantity
        if product_id in cart:
            cart[product_id]['quantity'] += 1
        else:
            # New product - add to cart
            cart[product_id] = {
                'name': product.name,
                'price': str(product.price),
                'quantity': 1,
                'emoji': product.emoji,
            }

        save_cart(request, cart)

        return JsonResponse({
            'success': True,
            'message': f'{product.name} added to cart!',
            'cart_count': get_cart_count(request),
            'cart_total': get_cart_total(request),
        })

    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found!'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


# ─────────────────────────────────────────────
# View 4: Remove from Cart
# ─────────────────────────────────────────────
@require_POST
def remove_from_cart(request):
    """
    Removes a product completely from the cart.
    """
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))

        cart = get_cart(request)

        if product_id in cart:
            removed_name = cart[product_id]['name']
            del cart[product_id]
            save_cart(request, cart)

            return JsonResponse({
                'success': True,
                'message': f'{removed_name} removed from cart!',
                'cart_count': get_cart_count(request),
                'cart_total': get_cart_total(request),
            })
        else:
            return JsonResponse({'success': False, 'message': 'Item not in cart!'}, status=400)

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


# ─────────────────────────────────────────────
# View 5: Update Cart Quantity
# ─────────────────────────────────────────────
@require_POST
def update_cart(request):
    """
    Updates the quantity of a product in the cart.
    If quantity becomes 0, the item is removed.
    """
    try:
        data = json.loads(request.body)
        product_id = str(data.get('product_id'))
        action = data.get('action')  # 'increase' or 'decrease'

        cart = get_cart(request)

        if product_id in cart:
            if action == 'increase':
                cart[product_id]['quantity'] += 1
            elif action == 'decrease':
                cart[product_id]['quantity'] -= 1
                # Remove item if quantity drops to 0
                if cart[product_id]['quantity'] <= 0:
                    del cart[product_id]
                    save_cart(request, cart)
                    return JsonResponse({
                        'success': True,
                        'removed': True,
                        'cart_count': get_cart_count(request),
                        'cart_total': get_cart_total(request),
                    })

            save_cart(request, cart)

            # Calculate new item total
            if product_id in cart:
                item = cart[product_id]
                item_total = float(item['price']) * item['quantity']
            else:
                item_total = 0

            return JsonResponse({
                'success': True,
                'removed': False,
                'quantity': cart.get(product_id, {}).get('quantity', 0),
                'item_total': round(item_total, 2),
                'cart_count': get_cart_count(request),
                'cart_total': round(get_cart_total(request), 2),
            })

    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=400)


# ─────────────────────────────────────────────
# View 6: Checkout Page
# ─────────────────────────────────────────────
def checkout(request):
    """
    Checkout page - collects user name and address.
    """
    cart_data = get_cart(request)

    # If cart is empty, redirect to homepage
    if not cart_data:
        return redirect('index')

    cart_items = []
    for product_id, item in cart_data.items():
        item_total = float(item['price']) * item['quantity']
        cart_items.append({
            'id': product_id,
            'name': item['name'],
            'price': item['price'],
            'quantity': item['quantity'],
            'emoji': item.get('emoji', '📦'),
            'total': round(item_total, 2),
        })

    cart_total = sum(item['total'] for item in cart_items)
    cart_count = get_cart_count(request)

    context = {
        'cart_items': cart_items,
        'cart_total': round(cart_total, 2),
        'cart_count': cart_count,
    }
    return render(request, 'store/checkout.html', context)


# ─────────────────────────────────────────────
# View 7: Place Order (Form Submit)
# ─────────────────────────────────────────────
def place_order(request):
    """
    Handles form submission from checkout page.
    Shows order confirmation and clears the cart.
    """
    if request.method == 'POST':
        # Get form data
        name = request.POST.get('name', 'Customer')
        email = request.POST.get('email', '')
        address = request.POST.get('address', '')
        city = request.POST.get('city', '')

        # Get cart before clearing
        cart_data = get_cart(request)
        order_items = []
        for product_id, item in cart_data.items():
            item_total = float(item['price']) * item['quantity']
            order_items.append({
                'name': item['name'],
                'quantity': item['quantity'],
                'price': item['price'],
                'emoji': item.get('emoji', '📦'),
                'total': round(item_total, 2),
            })

        order_total = sum(item['total'] for item in order_items)

        # Generate a simple order number
        import random
        order_number = f"ORD{random.randint(10000, 99999)}"

        # Clear the cart after order
        request.session['cart'] = {}
        request.session.modified = True

        context = {
            'name': name,
            'email': email,
            'address': address,
            'city': city,
            'order_items': order_items,
            'order_total': round(order_total, 2),
            'order_number': order_number,
            'cart_count': 0,
        }
        return render(request, 'store/confirmation.html', context)

    # If not POST request, redirect to checkout
    return redirect('checkout')
