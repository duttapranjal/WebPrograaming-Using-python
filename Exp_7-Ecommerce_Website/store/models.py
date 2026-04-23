"""
Models for the store app.
Project: ShopEasy E-Commerce Website
"""

from django.db import models


class Product(models.Model):
    """
    Model to represent a product in the store.
    Each product has a name, price, description, category, and emoji icon.
    """
    CATEGORY_CHOICES = [
        ('electronics', 'Electronics'),
        ('clothing', 'Clothing'),
        ('accessories', 'Accessories'),
        ('home', 'Home & Kitchen'),
    ]

    name = models.CharField(max_length=200)           # Product name
    price = models.DecimalField(max_digits=8, decimal_places=2)  # Price in INR
    description = models.TextField()                  # Short description
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='electronics')
    emoji = models.CharField(max_length=10, default='📦')   # Fun emoji icon
    is_available = models.BooleanField(default=True)  # Is product in stock?
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
