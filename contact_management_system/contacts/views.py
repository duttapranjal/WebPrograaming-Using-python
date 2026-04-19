from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.db.models import Q
from .models import Contact
from .forms import ContactForm

def contact_list(request):
    """Display all contacts with search functionality"""
    contacts = Contact.objects.all()
    search_query = request.GET.get('search', '')
    
    if search_query:
        contacts = contacts.filter(
            Q(name__icontains=search_query) |
            Q(phone_number__icontains=search_query) |
            Q(email__icontains=search_query)
        )
        return render(request, 'contacts/contact_list.html', {
            'contacts': contacts,
            'search_query': search_query
        })
    
    return render(request, 'contacts/contact_list.html', {
        'contacts': contacts,
        'search_query': search_query
    })


def add_contact(request):
    """Add a new contact"""
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact = form.save()
            messages.success(request, f'Contact "{contact.name}" added successfully!')
            return redirect('contact_list')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ContactForm()
    
    return render(request, 'contacts/add_contact.html', {'form': form})


def view_contact(request, pk):
    """View a single contact's details"""
    contact = get_object_or_404(Contact, pk=pk)
    return render(request, 'contacts/view_contact.html', {'contact': contact})


def edit_contact(request, pk):
    """Edit an existing contact"""
    contact = get_object_or_404(Contact, pk=pk)
    
    if request.method == 'POST':
        form = ContactForm(request.POST, instance=contact)
        if form.is_valid():
            contact = form.save()
            messages.success(request, f'Contact "{contact.name}" updated successfully!')
            return redirect('contact_list')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = ContactForm(instance=contact)
    
    return render(request, 'contacts/edit_contact.html', {
        'form': form,
        'contact': contact
    })


def delete_contact(request, pk):
    """Delete a contact"""
    contact = get_object_or_404(Contact, pk=pk)
    
    if request.method == 'POST':
        contact_name = contact.name
        contact.delete()
        messages.success(request, f'Contact "{contact_name}" deleted successfully!')
        return redirect('contact_list')
    
    return render(request, 'contacts/delete_contact.html', {'contact': contact})
