from django.db import models

class Contact(models.Model):
    """Model for storing contact information"""
    name = models.CharField(max_length=100, help_text="Contact's full name")
    phone_number = models.CharField(max_length=20, help_text="Contact's phone number")
    email = models.EmailField(help_text="Contact's email address")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact"
        verbose_name_plural = "Contacts"

    def __str__(self):
        return f"{self.name} - {self.phone_number}"

    def get_absolute_url(self):
        return f"/contacts/view/{self.id}/"
