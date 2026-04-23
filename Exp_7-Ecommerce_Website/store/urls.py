"""
URL patterns for the store app.
Project: ShopEasy E-Commerce Website
"""

from django.urls import path
from . import views

urlpatterns = [
    # Homepage - product listing
    path('', views.index, name='index'),

    # Cart page
    path('cart/', views.cart, name='cart'),

    # Checkout page
    path('checkout/', views.checkout, name='checkout'),

    # Order confirmation
    path('place-order/', views.place_order, name='place_order'),

    # AJAX endpoints for cart operations
    path('add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),
    path('update-cart/', views.update_cart, name='update_cart'),
]
