# 📚 FoodRush Project - Complete Code Guide

## 🎯 Project Overview

**FoodRush** is a food ordering web application built with:
- **Frontend**: React with Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Storage**: Browser localStorage

---

## 📁 Project Structure Explained

### 1. **Redux Store** (`src/redux/`)
Think of Redux as the "brain" of your app - it stores all important data.

```
src/redux/
├── store.jsx           ← Creates the Redux store (main data container)
├── cartSlice.jsx       ← Manages shopping cart (add, remove, update items)
├── userSlice.jsx       ← Manages user info (login, logout, addresses)
├── orderSlice.jsx      ← Manages order history (placed orders, tracking)
└── favoritesSlice.jsx  ← Manages favorite restaurants
```

**How it works**:
- Data lives in Redux store
- Components use `useSelector` to READ data
- Components use `dispatch` to CHANGE data
- Changes automatically persist to localStorage

### 2. **Pages** (`src/pages/`)
Each file is a full-page view:

```
src/pages/
├── home.jsx              ← Landing page with hero & featured
├── login.jsx             ← User login form (SIMPLE & CLEAN)
├── signup.jsx            ← User registration form (SIMPLE & CLEAN)
├── restaurants.jsx       ← Browse all restaurants
├── restaurant-details.jsx ← View single restaurant menu
├── food.jsx              ← Browse all menu items with filters
├── cart.jsx              ← Shopping cart view
├── checkout.jsx          ← Order placement with delivery form
├── orders.jsx            ← Order history & tracking
├── profile.jsx           ← User profile & address management
└── deals.jsx             ← Promotions & promo codes
```

**Page Flow**:
```
Home → Restaurants → Restaurant Details/Menu → Cart → Checkout → Orders
          ↓
        Food (All Menu Items) → Cart → Checkout
          ↓
       Profile (Account Management)
```

### 3. **Components** (`src/components/`)
Reusable UI parts:

```
src/components/
├── navbar.jsx              ← Top navigation bar
├── footer.jsx              ← Bottom footer
├── search.jsx              ← Search functionality
├── filters.jsx             ← Filtering options
├── address-management.jsx  ← Address management UI
└── ui/
    ├── button.jsx          ← Reusable button component
    ├── card.jsx            ← Card/box component
    └── input.jsx           ← Input field component
```

### 4. **Libraries** (`src/lib/`)
Helper functions & utilities:

```
src/lib/
├── storage.js      ← localStorage operations (user, addresses, favorites)
├── validation.js   ← Form validation (email, password, phone, etc)
└── utils.js        ← General utility functions
```

---

## 🔄 Data Flow (How It Works)

### Example: Adding Item to Cart

```
User clicks "Add to Cart" button
    ↓
Button calls: dispatch(addToCart(itemData))
    ↓
Redux cartSlice processes the action
    ↓
State updates + saves to localStorage
    ↓
All components watching the cart are notified
    ↓
Cart badge updates, Cart page refreshes
```

### Example: User Login

```
User fills login form
    ↓
Form calls: handleSubmit()
    ↓
Validation checks email & password
    ↓
storage.js calls: verifyLogin(email, password)
    ↓
If valid: dispatch(login(userData))
    ↓
Redux userSlice updates state
    ↓
localStorage stores current user
    ↓
Page redirects to /profile
```

---

## 🛠️ Key Files Explained (SIMPLE VERSIONS)

### **Authentication Flow** (`src/pages/login.jsx` & `signup.jsx`)
```javascript
// What happens:
1. User enters email & password
2. Form validation runs (isValidEmail, isValidPassword)
3. If valid → check storage for user (verifyLogin)
4. If user exists → update Redux state
5. If Redux updated → redirect to profile
6. Done! ✅
```

### **Cart Management** (`src/redux/cartSlice.jsx`)
```javascript
// Simple operations:
addToCart(item)         → Add new item or update quantity
removeFromCart(id)      → Remove item completely
updateQuantity(id, qty) → Change quantity
clearCart()             → Empty entire cart
```

### **Storage** (`src/lib/storage.js`)
```javascript
// Key concepts:
registerUser(data)      → Save new user to localStorage
verifyLogin(email, pwd) → Check if user exists
getCurrentUser()        → Get logged-in user info
saveAddresses(addr)     → Save delivery addresses
getFavorites()          → Get favorite restaurants
```

---

## 🎨 Styling Guide

### Colors Used:
- **Orange**: `from-orange-500`, `bg-orange-600` (Primary)
- **Red**: `to-red-500` (Accent)
- **White**: `bg-white` (Backgrounds)
- **Gray**: `text-gray-600` (Secondary text)
- **Green**: `text-green-600` (Success messages)

### Common Classes:
```html
<!-- Buttons -->
<button class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
  Click Me
</button>

<!-- Cards -->
<div class="bg-white p-6 rounded-xl shadow-lg">
  Card content
</div>

<!-- Gradients (NEW - Tailwind v4) -->
<div class="bg-linear-to-r from-orange-500 to-red-500">
  Gradient background
</div>

<!-- Text -->
<h1 class="text-4xl font-bold text-orange-600">Title</h1>
<p class="text-gray-600">Subtitle</p>
```

---

## 🚀 How to Make Changes

### Adding a New Feature:

1. **Check if data is needed**
   - Yes? Add to Redux slice (`src/redux/`)
   - No? Keep it in component state

2. **Create the UI**
   - Add component in `src/components/` or page in `src/pages/`
   - Use existing components (Button, Card, Input)

3. **Connect Redux (if needed)**
   ```javascript
   import { useDispatch, useSelector } from 'react-redux';
   const dispatch = useDispatch();
   const data = useSelector(state => state.slice.data);
   dispatch(action(payload));
   ```

4. **Add Validation (if needed)**
   - Create validation function in `src/lib/validation.js`
   - Use it in component before processing data

5. **Add Storage (if needed)**
   - Create storage function in `src/lib/storage.js`
   - Call after successful operation
   ```javascript
   localStorage.setItem("key", JSON.stringify(data));
   ```

### Modifying Existing Code:

1. **Find the file** (refer to structure above)
2. **Read the comments** (they explain what code does)
3. **Make changes** carefully
4. **Test the changes** - run `npm run dev`
5. **Check for errors** - look at console

---

## ✅ Testing Your Changes

### Run Development Server:
```bash
npm run dev
```
This starts the live server at `http://localhost:5173`

### Check for Errors:
1. Open browser DevTools (F12)
2. Check **Console** tab for errors
3. Check **Network** tab for failed requests
4. Check **Redux** tab (if Redux DevTools installed)

### Build for Production:
```bash
npm run build
```
Creates optimized version in `dist/` folder

---

## 🔐 Security & Best Practices

✅ **What's Done Right**:
- Password validation (minimum 6 chars)
- Email format validation
- Form input validation
- Error messages for users
- localStorage for simple persistence

⚠️ **Important Notes**:
- Passwords are NOT stored in localStorage
- This is a DEMO app (not production-ready)
- For real apps, use backend authentication
- Never trust client-side validation alone

---

## 📱 Features Overview

### User Features:
- ✅ Register & Login
- ✅ Browse restaurants & menus
- ✅ Add items to cart
- ✅ Place orders
- ✅ Save favorites
- ✅ Add delivery addresses
- ✅ View order history
- ✅ User profile

### Restaurant Features:
- ✅ Display restaurant info
- ✅ Show menu with categories
- ✅ Filter by category
- ✅ Display prices & ratings
- ✅ Show special offers

### Cart Features:
- ✅ Add/remove items
- ✅ Update quantities
- ✅ View total price
- ✅ Free delivery over ₹500
- ✅ Persistent storage

### Checkout Features:
- ✅ Delivery address form
- ✅ Multiple payment methods
- ✅ Order summary
- ✅ Order confirmation
- ✅ Order history tracking

---

## 🐛 Common Issues & Solutions

### Issue: Cart not showing items
- **Fix**: Check localStorage → Settings → Storage → Clear all → Reload

### Issue: Login not working
- **Fix**: Make sure you signed up first
- **Debug**: Open Console (F12) → look for errors

### Issue: Page not loading
- **Fix**: Run `npm install` to install dependencies
- **Debug**: Check console for errors

### Issue: Styles look broken
- **Fix**: Run `npm run dev` to restart dev server

---

## 📖 File Reference Quick Guide

| Task | File Location |
|------|---|
| Add new user fields | `src/redux/userSlice.jsx` |
| Add validation | `src/lib/validation.js` |
| Add storage function | `src/lib/storage.js` |
| Create new page | `src/pages/new-page.jsx` |
| Create new component | `src/components/new-component.jsx` |
| Add new Redux slice | `src/redux/newSlice.jsx` |
| Modify navbar | `src/components/navbar.jsx` |
| Update colors/styling | Any JSX file (Tailwind classes) |

---

## 🎓 Learning Resources

**Redux Basics**:
- useSelector() = READ data from store
- useDispatch() = SEND actions to store
- Reducers = Process actions & update state

**React Basics**:
- useState() = Component-level state
- useEffect() = Run code on load/change
- Props = Pass data between components

**Tailwind CSS**:
- Use `class="..."` for styling
- `bg-*` = background colors
- `text-*` = text colors
- `px-* py-*` = padding
- `rounded-*` = border radius

---

## ✨ Summary

**The app is organized as**:
1. **Pages** (full screens)
2. **Redux** (shared data)
3. **Components** (reusable parts)
4. **Utils** (helper functions)

**Data flows**:
1. **Action** (user clicks button)
2. **Validation** (check if data is valid)
3. **Dispatch** (send to Redux)
4. **Storage** (save to localStorage)
5. **Update** (components re-render)

**Always remember**:
- Read the code comments
- Use console for debugging
- Check localStorage in DevTools
- Test changes in browser
- Keep code simple & clean

---

**Happy Coding! 🚀**
**FoodRush - Making Food Delivery Simple**
