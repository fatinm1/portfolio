# Fatin Mojumder - Portfolio Website

A modern, futuristic portfolio website built with Next.js, featuring an AI chatbot, dynamic project management, and secure admin panel.

## ✨ Features

### 🎨 Modern Design
- **Futuristic glassmorphism** design with animated particles
- **Responsive layout** that works on all devices
- **Dark theme** with cyan accents
- **Smooth animations** using Framer Motion

### 🤖 AI Chatbot
- **OpenAI GPT-3.5 integration** for intelligent responses
- **Conversation history** for context-aware conversations
- **Fallback mode** when OpenAI is unavailable
- **Suggested questions** for easy interaction
- **Real-time chat interface** with typing indicators

### 📁 Project Management
- **Dynamic project uploads** with admin authentication
- **Video demo support** (file upload + YouTube/Vimeo URLs)
- **Technology tags** and project categorization
- **GitHub integration** for code links
- **MySQL database** for persistent storage

### 🔐 Security Features
- **Password-protected admin panel** with bcrypt hashing
- **Session-based authentication** with HTTP-only cookies
- **File upload validation** (video files only, 100MB limit)
- **Secure API endpoints** with proper error handling

### 📱 Pages
- **Home**: Hero section with animated background
- **Skills**: Interactive skill display with experience levels
- **Projects**: Dynamic project showcase with video demos
- **Chatbot**: AI-powered assistant for questions about Fatin
- **Contact**: Contact form and social media links
- **Admin**: Secure project management interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MySQL database (local or cloud)
- OpenAI API key (optional, for enhanced chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd new-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env.local
   
   # Edit .env.local and add your configuration
   OPENAI_API_KEY=your_openai_api_key_here
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio
   DB_PORT=3306
   ```

4. **Set up MySQL database**
   ```bash
   # Create a MySQL database named 'portfolio'
   mysql -u root -p -e "CREATE DATABASE portfolio;"
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### OpenAI API Setup (Optional)
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
3. The chatbot will use fallback responses if no API key is provided

### MySQL Database Setup
1. **Local Development**:
   ```bash
   # Install MySQL locally or use Docker
   docker run --name mysql-portfolio -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=portfolio -p 3306:3306 -d mysql:8.0
   ```

2. **Railway Deployment**:
   - Add MySQL service in Railway dashboard
   - Railway will provide connection details automatically
   - Set environment variables in Railway

3. **Environment Variables**:
   ```bash
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=portfolio
   DB_PORT=3306
   ```

### Admin Access
- **Login URL**: `/login`
- **Admin panel**: `/admin`
- **Default credentials**: `fatinm1` / `Bd2222Mo?`
- **Set up admin credentials** by editing the database or using the default user created on first run

### Database
- **MySQL database** with automatic table creation
- **Tables**: `projects`, `admin_users`, `contacts`, `resume`
- **Automatic initialization** on first run
- **Connection pooling** for better performance

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chatbot/       # AI chatbot API
│   │   ├── projects/      # Project management API
│   │   ├── contact/       # Contact form API
│   │   ├── contacts/      # Contact messages API
│   │   ├── resume/        # Resume management API
│   │   └── upload/        # File upload API
│   ├── admin/             # Admin panel (protected)
│   ├── chatbot/           # Chatbot interface
│   ├── contact/           # Contact page
│   ├── login/             # Login page
│   ├── projects/          # Projects showcase
│   ├── skills/            # Skills page
│   └── page.tsx           # Homepage
├── lib/                   # Utility libraries
│   ├── database.ts        # MySQL database operations
│   ├── openai.ts          # OpenAI service
│   └── upload.ts          # File upload utilities
└── components/            # Reusable components
```

## 🎯 Usage

### Adding Projects
1. Visit `/login` and authenticate
2. Go to `/admin` to access the project management panel
3. Fill out the project form:
   - **Name**: Project title
   - **Description**: Detailed project description
   - **Technologies**: Comma-separated tech stack
   - **GitHub**: Repository link
   - **Video Demo**: Upload file or enter URL
   - **Tags**: Comma-separated categories
4. Click "Add Project" to save

### Using the Chatbot
1. Visit `/chatbot`
2. Ask questions about Fatin's:
   - Skills and experience
   - Projects and work
   - Goals and interests
   - Contact information
3. Use suggested questions for quick interactions
4. Clear chat history with the "Clear Chat" button

### Managing Resume
1. Login to admin panel
2. Go to "Resume Management" section
3. Upload a new PDF resume (max 10MB)
4. Resume will be available for download on contact page

### Contact Management
1. Contact form submissions are stored in database
2. View messages in admin panel under "Contact Messages"
3. Messages include name, email, and timestamp

### Customization
- **Profile info**: Edit `src/lib/openai.ts` for chatbot context
- **Skills**: Update `src/app/skills/page.tsx` with your skills
- **Contact info**: Modify `src/app/contact/page.tsx`
- **Styling**: Customize Tailwind classes in components

## 🔒 Security Notes

### Production Deployment
1. **Change default admin password** immediately
2. **Set secure environment variables**
3. **Use HTTPS** for production
4. **Configure proper CORS** if needed
5. **Set up database backups**
6. **Use strong MySQL passwords**

### Environment Variables
```bash
# Required for OpenAI integration
OPENAI_API_KEY=your_openai_api_key_here

# Required for MySQL database
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=portfolio
DB_PORT=3306

# Optional security enhancements
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Management
- Database tables are automatically created on first run
- Use MySQL client for manual inspection
- Backup before major changes
- Connection pooling for better performance

## 🚀 Deployment

### Railway (Recommended)
1. Connect your GitHub repository
2. Add MySQL service in Railway dashboard
3. Set environment variables in Railway
4. Deploy automatically on push

### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Use external MySQL service (PlanetScale, Railway, etc.)
4. Deploy automatically on push

### Other Platforms
- **Netlify**: Configure build settings with external MySQL
- **DigitalOcean**: Use App Platform with MySQL database
- **Heroku**: Add MySQL add-on

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with details

---

**Built using Next.js, TypeScript, and Tailwind CSS**
