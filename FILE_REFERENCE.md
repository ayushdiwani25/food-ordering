# 📖 FoodRush - File-by-File Explanation (Simple Terms)

## 🏃 Quick Navigation
- [Redux Store](#redux-store-files) - Data management
- [Pages](#page-files) - Full-page views
- [Components](#component-files) - Reusable pieces
- [Libraries](#library-files) - Helper functions
- [Configuration](#config-files) - Project settings

---

## Redux Store Files
*"The brain" of your app - stores all important information*

### `src/redux/store.jsx`
```
Purpose: Creates the central data storage
Simple: Like a box that holds all important data
Used for: Everything in the app reads/writes to this box
```

### `src/redux/cartSlice.jsx`
```
Purpose: Manages shopping cart
Key Functions:
✅ addToCart(item) - Add item or update quantity
✅ removeFromCart(id) - Remove item
✅ updateQuantity(id, qty) - Change amount
✅ clearCart() - Empty cart

Example:
- User clicks "Add to Cart"
- Item goes into Redux cart
- Cart badge updates automatically
- Data saves to browser storage
```

### `src/redux/userSlice.jsx`
```
Purpose: Manages currently logged-in user
Key Functions:
✅ login(user) - User logged in
✅ logout() - User logged out
✅ addAddress(address) - Save delivery address
✅ addFavorite(restaurant) - Save favorite

Stores:
- User name, email, phone
- Multiple delivery addresses
- Favorite restaurants
```

### `src/redux/orderSlice.jsx`
```
Purpose: Manages order history
Key Functions:
✅ placeOrder(orderData) - Create new order
✅ updateOrderStatus(orderId, status) - Change order status
✅ cancelOrder(orderId) - Cancel an order
✅ addReview(orderId, review) - Add feedback

Example:
- User places order
- Order saved with ID, items, total, timestamp
- As delivery updates, status changes
- User can see order history anytime
```

### `src/redux/favoritesSlice.jsx`
```
Purpose: Manages favorite restaurants
Note: Currently not used (userSlice handles favorites)
Can be extended for advanced features
```

---

## Page Files
*"Screens" - what user sees when visiting different URLs*

### `src/pages/home.jsx` 🏠
```
Shows: Landing page
Features:
- Hero section with welcome message
- Featured restaurants & menu items
- Special offers & promotions
- Call-to-action buttons

How to use:
- Go to http://localhost:5173/
- See beautiful landing page
- Click buttons to explore
```

### `src/pages/login.jsx` 🔓
```
Shows: Login form
Features:
- Email input field
- Password input field
- Form validation
- Success/error messages
- Links to signup

How it works:
1. User enters email & password
2. Validation checks format
3. If valid, checks if user is registered
4. If registered, updates Redux + redirects
5. If not registered, shows error

Code Quality: ✅ CLEAN (duplicate code removed)
```

### `src/pages/signup.jsx` ✍️
```
Shows: Registration form
Features:
- Full name input
- Email input
- Password input
- Confirm password input
- Form validation
- Success/error messages

How it works:
1. User fills all fields
2. Validation checks all requirements
3. If valid, creates new user account
4. Saves to localStorage
5. Updates Redux + redirects to profile

Code Quality: ✅ CLEAN (duplicate code removed)
```

### `src/pages/restaurants.jsx` 🍽️
```
Shows: List of all restaurants
Features:
- Displays all restaurant cards
- Shows rating, delivery fee, time
- Filter/search functionality
- Click to view restaurant details

How to use:
- Click "Restaurants" in navbar
- See list of all restaurants
- Click restaurant card to see menu
```

### `src/pages/restaurant-details.jsx` 📋
```
Shows: Single restaurant menu
Features:
- Restaurant header with image
- Restaurant info (rating, delivery fee, etc)
- Menu items in categories
- Filter by category
- Add items to cart

How to use:
- Click on restaurant from list
- See all menu items
- Click category to filter
- Click "Add to Cart" to order

Code Quality: ✅ COMPLETE (fully implemented)
```

### `src/pages/food.jsx` 🍕
```
Shows: All menu items from all restaurants
Features:
- Browse all food items
- Search functionality
- Filter by category
- Add items to cart
- Animation when item added

How to use:
- Click "Menu" in navbar
- See all available items
- Use search to find specific food
- Add to cart to order
```

### `src/pages/cart.jsx` 🛒
```
Shows: Shopping cart contents
Features:
- List all items in cart
- Show prices and quantities
- Update quantities
- Remove items
- Show total price
- Checkout button

How it works:
1. Shows all items user selected
2. Can increase/decrease quantities
3. Can remove items
4. Shows final total
5. Checkout button goes to payment
```

### `src/pages/checkout.jsx` 💳
```
Shows: Order placement form
Features:
- Delivery address form
  (Name, Phone, Address, City, Postal Code)
- Payment method selection
  (Card, UPI, Cash on Delivery)
- Order summary
- Final total with delivery charge
- Place order button

How it works:
1. User fills delivery address
2. User chooses payment method
3. Shows order summary
4. User clicks "Place Order"
5. Order saved + redirects to confirmation
6. Cart clears

Code Quality: ✅ COMPLETE (fully functional)
```

### `src/pages/orders.jsx` 📦
```
Shows: User's order history
Features:
- List of all orders placed
- Order ID, date, total, status
- Track order delivery
- View order details
- Cancel order option
- Add review/rating

How to use:
- Click "Orders" in profile/navbar
- See all past orders
- Click order to see details
- Track delivery status
```

### `src/pages/profile.jsx` 👤
```
Shows: User profile & settings
Features:
- User info (name, email, phone)
- Saved delivery addresses
- Address management (add, edit, delete)
- Favorite restaurants
- Order history
- Account settings
- Logout button

How to use:
- Click user avatar in navbar
- See profile information
- Manage addresses
- View favorites
- Logout option
```

### `src/pages/deals.jsx` 🎉
```
Shows: Promotions & special offers
Features:
- Available promo codes
- Copy promo code functionality
- Discount details
- Apply in checkout

How to use:
- Click "Deals" in navbar
- See available promotions
- Copy promo code
- Use in checkout for discount
```

---

## Component Files
*"Pieces" - reusable parts used on multiple pages*

### `src/components/navbar.jsx` (Navigation Bar)
```
Shows: Top navigation bar (sticky, always visible)
Contains:
- Logo & app name
- Navigation links (Home, Restaurants, Menu, Deals)
- Search bar
- User avatar/login button
- Shopping cart count

Code Quality: ✅ WELL-ORGANIZED
- Helper components for reusability
- Smooth animations
- Responsive design
```

### `src/components/footer.jsx` (Footer)
```
Shows: Bottom footer on every page
Contains:
- Company info
- Quick links
- Social media
- Contact info
- Copyright notice

Code Quality: ✅ CLEAN
- Simple structure
- Consistent styling
```

### `src/components/search.jsx` (Search Bar)
```
Purpose: Search for restaurants or menu items
Features:
- Real-time search
- Filter results
- Matches name and cuisine

How to use:
- Type in search box
- See matching results
- Click result to view
```

### `src/components/filters.jsx` (Filter Options)
```
Purpose: Filter menu items
Features:
- Filter by category
- Filter by price range
- Filter by rating
- Filter by availability

How to use:
- Select filters
- See matching items
- Combine multiple filters
```

### `src/components/address-management.jsx` (Address Manager)
```
Purpose: Manage delivery addresses
Features:
- Add new address
- Edit existing address
- Delete address
- Set default address
- Save to localStorage

How to use:
- Click "Manage Addresses"
- Add/edit/delete addresses
- Set which is default
- Use in checkout
```

### `src/components/ui/button.jsx` (Reusable Button)
```
Purpose: Standardized button component
Features:
- Different colors/sizes
- Hover effects
- Loading state
- Disabled state

How to use:
<Button onClick={handleClick}>
  Click Me
</Button>
```

### `src/components/ui/card.jsx` (Reusable Card)
```
Purpose: Container for content
Features:
- Rounded corners
- Shadow effect
- Consistent padding
- Hover effect

How to use:
<Card>
  Card content here
</Card>
```

### `src/components/ui/input.jsx` (Reusable Input)
```
Purpose: Standardized input field
Features:
- Text input
- Email input
- Password input
- Number input
- Focus effects

How to use:
<Input type="email" placeholder="Enter email" />
```

---

## Library Files
*"Tools" - helper functions used throughout app*

### `src/lib/storage.js` 💾
```
Purpose: Handle all localStorage operations
Simple: Like a notepad where browser saves data

Key Functions:
✅ registerUser(userData) - Save new user
   - Takes name, email, phone
   - Checks if email exists
   - Creates new user
   - Saves to localStorage

✅ verifyLogin(email, password) - Check login
   - Finds user by email
   - Returns user data if found
   - Updates current user

✅ getCurrentUser() - Get logged-in user
   - Returns current user + login status

✅ logoutUser() - Clear user session
   - Removes current user
   - Clears all session data

✅ saveAddresses(addresses) - Save addresses
✅ getAddresses() - Get addresses
✅ saveFavorites(favorites) - Save favorites
✅ getFavorites() - Get favorites

Code Quality: ✅ SECURE & CLEAN
- Passwords NOT stored
- Error handling
- Try-catch blocks
- Comments explaining code
```

### `src/lib/validation.js` ✓
```
Purpose: Validate user input
Simple: Check if data is correct format

Key Functions:
✅ isValidEmail(email) - Check email format
   Example: invalid@, valid@email.com ✓

✅ isValidPassword(password) - Check password
   - Minimum 6 characters
   - No special requirements (for demo)

✅ isValidName(name) - Check name
   - Minimum 3 characters

✅ isValidPhone(phone) - Check phone
   - 10+ digits
   - Only numbers

✅ validateSignup(formData) - Full signup validation
   - Checks name, email, password, confirm
   - Returns error message if invalid

✅ validateLogin(formData) - Full login validation
   - Checks email and password

Code Quality: ✅ SIMPLE & CLEAR
- Each function does one thing
- Returns true/false or error message
- Reusable across app
```

### `src/lib/utils.js` 🔧
```
Purpose: General utility functions
Contains:
- String formatting functions
- Date formatting functions
- Price formatting functions
- Array/object helpers
- Any other general tools

Used for: Making code cleaner & reusable
```

---

## Configuration Files
*"Settings" - how project is built/configured*

### `jsconfig.json` ⚙️
```
Purpose: Configure JavaScript/JSX
Settings:
- baseUrl: "." - Base folder for imports
- paths: "@/*" - Allows @/folder syntax for imports
- include: ["src"] - Which folders to process

Example:
Instead of: import x from "../../../lib/storage"
Use: import x from "@/lib/storage"
```

### `vite.config.js` 🚀
```
Purpose: Configure build tool (Vite)
Settings:
- React plugin setup
- Build optimization
- Development server settings
- Hot module replacement

Simple: Tells Vite how to build your app
```

### `package.json` 📦
```
Purpose: Project metadata & dependencies
Contains:
- Project name: "food-ordering"
- Version: "0.0.0"
- Scripts: npm run dev, npm run build
- Dependencies: react, redux, tailwind, etc

Key Scripts:
npm run dev     - Start development server
npm run build   - Make production version
npm run preview - Preview production build
```

### `tailwind.config.js` 🎨
```
Purpose: Configure Tailwind CSS styling
Contains:
- Custom colors
- Font sizes
- Spacing
- Breakpoints
- Plugins

Used for: Making colors & sizes consistent
```

### `.eslintrc.js` 🔍
```
Purpose: Code quality checker
Checks for:
- Syntax errors
- Unused variables
- Code style issues
- Best practices

Helps: Keep code clean & consistent
```

---

## Data File

### `src/data.js` 📊
```
Purpose: Sample data for the app
Contains:
- List of restaurants
  (name, image, rating, delivery fee, menu items)
- Menu items
  (name, price, category, description, image, rating)
- Cuisines
- Categories

Why: Demo data to show app functionality
For production: Fetch from backend API
```

---

## Main Application Files

### `src/App.jsx` 🎯
```
Purpose: Main app component
What it does:
1. Sets up routing (different pages)
2. Restores user from localStorage on startup
3. Renders navbar and footer
4. Shows different pages based on URL

Structure:
<Router>
  <Navbar />
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    ... etc ...
  </Routes>
  <Footer />
</Router>

Code Quality: ✅ CLEAN
```

### `src/main.jsx` 🔌
```
Purpose: App entry point
What it does:
1. Creates React root
2. Wraps app with Redux provider
3. Wraps app with React Router
4. Mounts app to HTML

Simple: First file that runs when app starts
```

### `src/App.css` & `src/index.css` 🎨
```
Purpose: Global styles
Contains:
- Font imports
- Global styling
- CSS variables
- Tailwind imports

Used for: App-wide styling rules
```

### `index.html` 📄
```
Purpose: Main HTML file
Contains:
- <head> with metadata
- <link> for fonts/icons
- <div id="root"> where React mounts
- <script> for main.jsx

Simple: The HTML shell that holds the React app
```

---

## Summary Table

| Location | Type | Purpose |
|----------|------|---------|
| `redux/` | Store | Data management |
| `pages/` | Views | Full-page screens |
| `components/` | Parts | Reusable pieces |
| `lib/` | Tools | Helper functions |
| `assets/` | Files | Images, fonts, etc |
| `.jsx` | Code | React components |
| `.js` | Code | JavaScript files |
| `.css` | Styles | Styling |
| `.json` | Config | Project settings |

---

## How Code Flows

### When User Logs In:
```
1. User types email/password in login.jsx
2. handleSubmit() called
3. validateLogin() checks format
4. verifyLogin() checks if user exists in storage.js
5. If valid, dispatch(login()) called
6. userSlice receives login action
7. Redux state updates (user + isLoggedIn)
8. localStorage saves current user
9. Component detects change + redirects to /profile
10. User sees their profile page
```

### When User Adds Item to Cart:
```
1. User clicks "Add to Cart" button on food.jsx
2. addToCart action dispatched with item data
3. cartSlice receives action
4. Item added to cart array
5. localStorage saves updated cart
6. Navbar component detects change
7. Cart badge updates (shows new count)
8. User sees cart increased
```

---

## Key Takeaways

✅ **Redux** = Shared data storage
✅ **Pages** = Different screens
✅ **Components** = Reusable pieces
✅ **Storage** = Browser saves data
✅ **Validation** = Check user input
✅ **Routing** = Navigate between pages
✅ **Styling** = Tailwind CSS (classes)
✅ **State** = Data that changes

**The app is SIMPLE because**:
- Clear folder structure
- Each file has one purpose
- Comments explain complex parts
- Consistent naming conventions
- Reusable components

---

**🎓 Now you understand the entire codebase!**
**Ready to make changes? Remember the tips above!**
