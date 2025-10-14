# Vercel Deployment Guide

## Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Vercel CLI installed globally (optional but recommended)

## Environment Variables
Before deploying, make sure you have the following environment variables ready:
- `MONGODB_URI` or your database connection string
- `JWT_SECRET` or any authentication secrets
- `EMAIL` and `PASS` for nodemailer
- Any other environment variables from your `.env` file

## Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your repository
   - Configure your project:
     - Framework Preset: Other
     - Root Directory: ./
     - Build Command: (leave empty)
     - Output Directory: (leave empty)

3. **Add Environment Variables**
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add all your environment variables from `.env` file

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI globally**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**
   ```bash
   vercel
   ```
   
4. **Follow the prompts:**
   - Set up and deploy? Y
   - Which scope? (select your account)
   - Link to existing project? N
   - What's your project's name? (choose a name)
   - In which directory is your code located? ./
   
5. **Add environment variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add EMAIL
   vercel env add PASS
   # Add other variables as needed
   ```

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Important Notes

1. **Database Connection**: Make sure your MongoDB connection string is accessible from Vercel's servers. If using MongoDB Atlas, whitelist Vercel's IP addresses or use `0.0.0.0/0` (all IPs).

2. **Static Files**: The `/public` folder will be served for static files (images, PDFs, etc.)

3. **File Uploads**: Note that Vercel has a 50MB limit for serverless functions. For large file uploads, consider using cloud storage services like AWS S3, Cloudinary, or Vercel Blob.

4. **Cold Starts**: Serverless functions on Vercel may have cold starts. The first request after inactivity might be slower.

5. **Logs**: View logs in Vercel dashboard under your project > Deployments > Click on deployment > Function Logs

## Testing Your Deployment

After deployment, you'll receive a URL like `https://your-project.vercel.app`

Test your API endpoints:
- `https://your-project.vercel.app/api/v1/...`

## Troubleshooting

### Common Issues:

1. **Module not found errors**: Make sure all dependencies are in `package.json` dependencies (not devDependencies)

2. **Database connection fails**: 
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure environment variables are set in Vercel

3. **Timeout errors**: Vercel has a 10-second timeout for hobby plan. Optimize slow operations.

4. **File upload issues**: Consider using external storage for files exceeding size limits.

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database connection tested and working
- [ ] MongoDB IP whitelist configured
- [ ] API endpoints tested
- [ ] File upload functionality verified
- [ ] Email service configured and tested
- [ ] CORS settings reviewed for production domains
- [ ] Error handling and logging in place

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs <deployment-url>

# List all deployments
vercel ls

# Remove deployment
vercel rm <deployment-name>
```

## Support

For more information, visit:
- Vercel Documentation: https://vercel.com/docs
- Vercel Node.js: https://vercel.com/docs/functions/serverless-functions/runtimes/node-js
