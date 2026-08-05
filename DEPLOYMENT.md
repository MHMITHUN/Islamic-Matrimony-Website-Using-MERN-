# Deployment Guide - Islamic Nikah Matrimony Website

## 🚀 Backend Deployment (Vercel)

### Prerequisites
- MongoDB Atlas account with connection string
- Vercel account
- All environment variables ready

### Steps

1. **Push code to GitHub** (Already done ✅)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your backend repository
   - Configure:
     - **Framework Preset**: Other
     - **Root Directory**: `./` (default)
     - **Build Command**: (leave empty)
     - **Output Directory**: (leave empty)

3. **Add Environment Variables**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=https://your-netlify-app.netlify.app
   PORT=5000
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Get Deployment URL**
   - After deployment, copy your Vercel URL (e.g., `https://your-app.vercel.app`)
   - You'll need this for the frontend configuration

---

## 🌐 Frontend Deployment (Netlify)

### Prerequisites
- Netlify account
- Backend Vercel URL from above

### Steps

1. **Update Environment Variable**
   
   Create/Update `client/.env`:
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

2. **Build the Project Locally (Optional Test)**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy to Netlify**
   
   **Option A: Netlify CLI (Recommended)**
   ```bash
   npm install -g netlify-cli
   cd client
   netlify login
   netlify init
   netlify deploy --prod
   ```

   **Option B: Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your frontend repository
   - Configure:
     - **Base directory**: `client` (if monorepo) or leave empty
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

4. **Add Environment Variables in Netlify**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend.vercel.app/api
     VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     ```

5. **Redeploy**
   - If you added env variables after first deployment, trigger a redeploy
   - Go to Deploys → Trigger deploy

---

## ✅ Post-Deployment Checklist

### Backend (Vercel)
- [ ] MongoDB connection successful
- [ ] All API endpoints working
- [ ] CORS configured for your Netlify domain
- [ ] Environment variables set correctly
- [ ] Stripe webhook configured (if using)

### Frontend (Netlify)
- [ ] Site loads without errors
- [ ] Can login/register users
- [ ] API calls work (check Network tab)
- [ ] Images and assets loading
- [ ] All routes work (SPA redirect configured)

### Testing
1. **Authentication**
   - Register new user
   - Login with credentials
   - Test logout

2. **Core Features**
   - Browse biodatas
   - View biodata details
   - Create/Edit biodata
   - Request premium
   - Add to favorites

3. **Admin Features** (login as admin)
   - View dashboard analytics
   - Manage users
   - Approve premium requests
   - View contact messages

4. **Payment Flow**
   - Go to checkout
   - Test Stripe payment (use test cards)
   - Verify premium activation

---

## 🔧 Troubleshooting

### Common Issues

**1. CORS Errors**
- Make sure `CLIENT_URL` in Vercel matches your Netlify URL exactly
- Check CORS configuration in `server/index.js`
- Ensure credentials are enabled

**2. API Connection Failed**
- Verify `VITE_API_URL` in Netlify env variables
- Check if Vercel deployment is live
- Test API endpoint directly in browser

**3. MongoDB Connection Issues**
- Verify MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- Check connection string format
- Ensure database user has correct permissions

**4. Blank Page After Deployment**
- Check browser console for errors
- Verify `netlify.toml` redirect rules
- Ensure all environment variables are set

**5. Stripe Not Working**
- Verify Stripe publishable key in frontend
- Check Stripe secret key in backend
- Use test mode keys for testing

---

## 📝 Environment Variables Reference

### Backend (Vercel)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-secure-random-string-min-32-chars
CLIENT_URL=https://your-app.netlify.app
PORT=5000
STRIPE_SECRET_KEY=sk_test_...
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.vercel.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🔄 Redeployment

### Backend
```bash
git add .
git commit -m "Update message"
git push origin main
```
Vercel will auto-deploy on push.

### Frontend
```bash
git add .
git commit -m "Update message"  
git push origin main
```
Netlify will auto-deploy on push.

Or use Netlify CLI:
```bash
cd client
netlify deploy --prod
```

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Netlify deployment logs
3. Check browser console (F12)
4. Check Network tab for failed requests

---

## 🎉 Success!

Your Islamic Nikah Matrimony Website is now live! 

- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-backend.vercel.app
- **Admin**: https://your-app.netlify.app/login (use admin credentials)
