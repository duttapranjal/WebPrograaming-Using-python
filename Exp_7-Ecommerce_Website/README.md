# 🛍️ ShopEasy — E-Commerce Website
**Experiment-7 | Web Development with Django**

---

## 📌 Project Overview

ShopEasy is a beginner-friendly e-commerce website built using **Django** (Python web framework). It demonstrates a complete shopping experience including product listing, cart management, and checkout simulation — all without any real payment gateway.

---

## 🗂️ Project Structure

```
ecommerce_website/
│
├── manage.py                      ← Django management script (run server here)
│
├── ecommerce_website/             ← Django project config folder
│   ├── settings.py                ← Project settings (database, apps, etc.)
│   ├── urls.py                    ← Main URL router
│   └── wsgi.py                    ← Server entry point
│
└── store/                         ← Main app folder
    ├── models.py                  ← Product database model
    ├── views.py                   ← All page logic (homepage, cart, checkout)
    ├── urls.py                    ← App URL patterns
    ├── admin.py                   ← Django admin config
    │
    ├── migrations/                ← Database migration files
    │   ├── 0001_initial.py
    │   └── 0002_add_initial_products.py   ← Seeds 8 sample products
    │
    ├── templates/store/           ← HTML templates
    │   ├── base.html              ← Base layout (navbar, footer)
    │   ├── index.html             ← Homepage / Product listing
    │   ├── cart.html              ← Shopping cart page
    │   ├── checkout.html          ← Checkout form page
    │   └── confirmation.html      ← Order confirmation page
    │
    └── static/store/
        ├── css/style.css          ← All CSS styles
        └── js/script.js           ← All JavaScript (AJAX cart logic)
```

---

## ✅ Tasks Completed

| Task | Description | Status |
|------|-------------|--------|
| Task 1 | Project Setup & Structure | ✅ Done |
| Task 2 | Product Listing Page (8 products) | ✅ Done |
| Task 3 | CSS Styling & Layout | ✅ Done |
| Task 4 | Shopping Cart Functionality | ✅ Done |
| Task 5 | Cart Summary & Price Calculation | ✅ Done |
| Task 6 | Checkout Simulation | ✅ Done |
| Task 7 | Bonus: Qty +/−, Sessions, Hover Effects | ✅ Done |

---

## 🚀 How to Run

### Step 1: Install Django
```bash
pip install django
```

### Step 2: Navigate to project folder
```bash
cd ecommerce_website
```

### Step 3: Apply database migrations
```bash
python manage.py migrate
```

### Step 4: Start the development server
```bash
python manage.py runserver
```

### Step 5: Open in browser
```
http://127.0.0.1:8000/
```

---

## 🔑 Key Features

- **Product Listing** — 8 products displayed in a responsive grid with emoji icons, descriptions, prices, and category badges
- **Add to Cart** — Uses AJAX (no page reload), updates cart badge instantly
- **Cart Management** — Increase/decrease quantity with +/− buttons, remove items
- **Dynamic Totals** — Prices recalculate in real-time using JavaScript
- **Django Sessions** — Cart data stored server-side in browser session
- **Checkout Form** — Collects Name, Email, Address, City
- **Order Confirmation** — Generates a random order number, clears cart
- **Toast Notifications** — Popup messages when items are added/removed
- **Responsive Design** — Works on mobile, tablet, and desktop

---

## 🛠️ Technologies Used

| Technology | Purpose |
|-----------|---------|
| Python 3 | Backend language |
| Django 5.x | Web framework |
| SQLite | Database (built-in with Django) |
| HTML5 | Page structure |
| CSS3 | Styling, animations, responsive layout |
| JavaScript (Vanilla) | AJAX cart operations, DOM updates |
| Django Sessions | Cart persistence |
| Django Admin | Product management panel |

---

## 🌐 URL Routes

| URL | View | Page |
|-----|------|------|
| `/` | `index` | Homepage with products |
| `/cart/` | `cart` | Shopping cart |
| `/checkout/` | `checkout` | Checkout form |
| `/place-order/` | `place_order` | Order confirmation |
| `/add-to-cart/` | `add_to_cart` | AJAX: Add item |
| `/remove-from-cart/` | `remove_from_cart` | AJAX: Remove item |
| `/update-cart/` | `update_cart` | AJAX: Update quantity |
| `/admin/` | Django Admin | Product management |

---

## 📦 Django Admin Panel

To manage products via admin:
```bash
python manage.py createsuperuser
# Then go to http://127.0.0.1:8000/admin/
```

---

## 📝 External References

- Django Official Documentation: https://docs.djangoproject.com/
- Google Fonts (Baloo 2, Nunito): https://fonts.google.com/
- Django Sessions: https://docs.djangoproject.com/en/5.0/topics/http/sessions/
- Fetch API (MDN): https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## 👤 Author

- **Name:** [Your Name]
- **Date:** April 2026
- **Course:** Web Development — Experiment 7
