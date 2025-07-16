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
- **SQLite database** for persistent storage

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
   cp .env.local.example .env.local
   
   # Edit .env.local and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### OpenAI API Setup (Optional)
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-api-key-here
   ```
3. The chatbot will use fallback responses if no API key is provided

### Admin Access
- **Login URL**: `/login`
- **Admin panel**: `/admin`
- **Set up admin credentials** by editing the database or using the default user created on first run

### Database
- **SQLite database** automatically created in `data/portfolio.db`
- **Tables**: `projects`, `admin_users`
- **Automatic initialization** on first run

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chatbot/       # AI chatbot API
│   │   ├── projects/      # Project management API
│   │   └── upload/        # File upload API
│   ├── admin/             # Admin panel (protected)
│   ├── chatbot/           # Chatbot interface
│   ├── contact/           # Contact page
│   ├── login/             # Login page
│   ├── projects/          # Projects showcase
│   ├── skills/            # Skills page
│   └── page.tsx           # Homepage
├── lib/                   # Utility libraries
│   ├── database.ts        # Database operations
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

### Environment Variables
```bash
# Required for OpenAI integration
OPENAI_API_KEY=your_openai_api_key_here

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
- Database is automatically created on first run
- Located at `data/portfolio.db`
- Use SQLite browser for manual inspection
- Backup before major changes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Configure build settings
- **Railway**: Add environment variables
- **DigitalOcean**: Use App Platform

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

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
