# ReWear Admin Panel

## Overview
The ReWear Admin Panel is a comprehensive dashboard for managing the ReWear platform. It provides a beautiful, modern interface with full CRUD operations for managing users, items, orders, and categories.

## Features

### 🎨 Design Features
- **Modern UI**: Sleek design with gradient colors (#667eea, #764ba2, #A695FF)
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Sidebar navigation with clear icons and labels
- **Interactive Elements**: Hover effects, smooth transitions, and animated components
- **Professional Color Scheme**: Consistent with the ReWear brand

### 📊 Dashboard Overview
- **Statistics Cards**: Total users, items, orders, and revenue
- **Recent Activity**: Latest users and items with real-time updates
- **Visual Indicators**: Color-coded status badges and progress indicators

### 👥 User Management
- **User List**: Complete user directory with search and filter options
- **User Actions**: Suspend, activate, or delete user accounts
- **Role Management**: Admin and user role assignments
- **User Details**: Profile information, registration date, and activity status

### 👕 Item Management
- **Product Grid**: Visual product catalog with images and details
- **Item Actions**: Edit, toggle visibility, or remove items
- **Category Organization**: Organize items by categories
- **Status Management**: Active/inactive item status control

### 📦 Order Management
- **Order Tracking**: Complete order history and status tracking
- **Order Details**: Customer information, items, and total amounts
- **Status Updates**: Pending, processing, completed, cancelled states
- **Order Filters**: Filter by status, date, or customer

### 🏷️ Category Management
- **Category Overview**: Manage product categories and subcategories
- **Category Stats**: View item counts per category
- **CRUD Operations**: Create, edit, and delete categories
- **Category Descriptions**: Detailed category information

### ⚙️ System Settings
- **General Settings**: Site configuration and basic information
- **Security Settings**: Two-factor authentication and security options
- **Payment Settings**: Payment gateway and currency configuration
- **Email Settings**: Notification and communication preferences

## Access Control

### Admin Authentication
The admin panel is protected by role-based access control:

1. **Authentication Required**: Must be logged in with valid token
2. **Admin Role Required**: Only users with `role: 'admin'` can access
3. **Automatic Redirection**: 
   - Non-authenticated users → Login page
   - Regular users → Regular dashboard
   - Admin users → Admin panel

### Testing Access
To test the admin panel:

1. **Create Admin User**: Set `role: 'admin'` in user data
2. **Login**: Use admin credentials to login
3. **Automatic Redirect**: Will redirect to `/admin` after login
4. **Manual Access**: Navigate to `/admin` if already logged in as admin

## Technical Implementation

### Frontend Architecture
- **React Components**: Modular, reusable component structure
- **React Router**: Protected routing with role-based access
- **CSS Styling**: Custom CSS with responsive design patterns
- **State Management**: React hooks for local state management

### API Integration
- **RESTful APIs**: Connects to backend admin endpoints
- **Error Handling**: Graceful fallback to sample data
- **Token Authentication**: JWT-based authentication headers
- **Real-time Updates**: Fetch fresh data after operations

### Sample Data Fallback
When backend is unavailable, the admin panel displays sample data:
- 5 sample users with different roles and statuses
- 5 sample items with various categories and prices
- 4 sample orders with different statuses
- 6 sample categories with item counts

## Routes

- `/admin` - Main admin dashboard
- `/admin/users` - User management (future enhancement)
- `/admin/items` - Item management (future enhancement)
- `/admin/orders` - Order management (future enhancement)
- `/admin/settings` - System settings (future enhancement)

## Security Features

1. **Route Protection**: AdminProtectedRoute component
2. **Role Verification**: Checks user role before access
3. **Token Validation**: Verifies authentication token
4. **Automatic Logout**: Clears session on unauthorized access

## Demo Instructions

### For Testing:
1. **Start the application**: `npm start`
2. **Create admin user**: Manually set user role to 'admin' in localStorage
3. **Login**: Use any credentials (will work with sample data)
4. **Access Admin Panel**: Click "Admin Panel" button or navigate to `/admin`

### Sample Admin User Data:
```javascript
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@rewear.com",
  "role": "admin",
  "_id": "admin123"
}
```

## Color Palette
- **Primary**: #667eea (Blue gradient start)
- **Secondary**: #764ba2 (Purple gradient end)
- **Accent**: #A695FF (Brand purple)
- **Success**: #28a745 (Green)
- **Warning**: #ffc107 (Yellow)
- **Danger**: #dc3545 (Red)
- **Background**: #f8f9fa (Light gray)

## Responsive Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

The admin panel is fully responsive and adapts to all screen sizes with optimized layouts for each device type.
