# Quick Start Guide

## Files Now Visible

All component and service files are now organized in the following structure:

### Pages (User Interfaces)
- `src/pages/Login.jsx` - Login page
- `src/pages/Register.jsx` - Registration page
- `src/pages/Dashboard.jsx` - Main dashboard
- `src/pages/Policies.jsx` - Insurance policies management
- `src/pages/Claims.jsx` - Insurance claims management

### Components (Reusable UI Elements)
- `src/components/Navbar.jsx` - Top navigation bar
- `src/components/ProtectedRoute.jsx` - Route authentication guard
- `src/components/PolicyModal.jsx` - Form for creating/editing policies
- `src/components/ClaimModal.jsx` - Form for creating/editing claims

### Services (API Integration)
- `src/services/authService.js` - Authentication operations
- `src/services/policyService.js` - Policy API calls
- `src/services/claimService.js` - Claims API calls

### Configuration
- `src/config/api.js` - Axios HTTP client with JWT interceptors

## Get Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Backend Configuration**
   - Ensure your ASP.NET Core backend is running on `http://localhost:5000`
   - If your backend runs on a different port, update `src/config/api.js`

4. **Test the Application**
   - Go to `http://localhost:5173`
   - Click "Register here" to create an account
   - Or use existing credentials to login
   - Navigate through Dashboard, Policies, and Claims pages

## Features

### Authentication
- Register new user account
- Login with email and password
- JWT token-based authentication
- Automatic logout on session expiration

### Policy Management
- View all your insurance policies
- Add new policies
- Edit existing policies
- Delete policies
- Filter by status
- Search by insurer or type

### Claims Management
- View all your insurance claims
- File new claims
- Edit pending claims
- Delete pending claims
- Track claim status (Submitted, Under Review, Approved, Rejected)

### User Interface
- Beautiful gradient blue-green design
- Responsive on mobile, tablet, and desktop
- Smooth animations and transitions
- Interactive hover effects
- Loading states and error handling

## Deployment

Build for production:
```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

## Troubleshooting

**Can't connect to backend?**
- Verify backend is running on the correct port
- Update API URL in `src/config/api.js`
- Check CORS settings on your backend

**Login not working?**
- Ensure backend registration endpoint is available
- Verify request format matches backend expectations
- Check browser console for error messages

**Styles not loading?**
- Ensure Tailwind CSS is properly configured
- Check `index.html` includes CSS
- Clear browser cache

## Next Steps

1. Review `SETUP.md` for detailed architecture information
2. Customize API endpoints in service files
3. Update branding/colors in components
4. Add additional features as needed
5. Deploy to production

## Support

Refer to individual component files for detailed implementation notes. Each service file includes comments explaining the API integration pattern.
