"""
Admin configuration for the store app.
Register models here to manage them via Django admin panel.
"""

from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin panel settings for Product model."""
    list_display = ('name', 'price', 'category', 'is_available', 'created_at')
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'description')
    list_editable = ('price', 'is_available')
