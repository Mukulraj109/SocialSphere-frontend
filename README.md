# 🎬 SocialSphere - Modern Video Streaming Platform

A cutting-edge video streaming platform built with React, TypeScript, and Tailwind CSS, featuring stunning 3D authentication pages, comprehensive video management, and social media platform.



![SocialSphere Banner](https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🔐 Authentication & User Management
- **3D Animated Login/Signup Pages** with glassmorphism effects
- **JWT-based Authentication** with HTTP-only cookies
- **Profile Management** with avatar and cover image uploads
- **Password Change** functionality
- **Protected Routes** with automatic redirects

### 🎥 Video Management
- **Video Upload** with thumbnail support
- **Video Player** with custom controls
- **Video Statistics** and analytics
- **Publish/Unpublish** functionality
- **Video Editing** capabilities
- **Watch History** tracking

### 📚 Playlist System
- **Create/Edit/Delete** playlists
- **Add/Remove Videos** from playlists
- **Playlist Detail Pages** with video management
- **YouTube-like Interface** for playlist management
- **Add to Playlist Modal** during video playback

### 🌐 Social Features
- **Community Posts** with create, edit, delete functionality
- **Like System** for videos and posts
- **Comments System** with nested replies
- **User Profiles** with subscription counts
- **Real-time Interactions**

### 🎨 Modern UI/UX
- **3D Perspective Transforms** on authentication pages
- **Glassmorphism Design** with backdrop blur effects
- **Gradient Backgrounds** with animated particles
- **Responsive Design** optimized for all devices
- **Dark/Light Theme** support
- **Smooth Animations** and micro-interactions



## 🔗 Live Demo & Repository

- 🌐 **Live Website**: [Visit SocialSphere](https://gleaming-jalebi-5e3c20.netlify.app/)
- 💻 **Frontend Repository**: [GitHub - SocialSphere Frontend](https://github.com/Mukulraj109/SocialSphere-frontend.git)
- 🛠 **Backend Repository**: [GitHub - SocialSphere Backend](https://github.com/Mukulraj109/SocialSphere.git)

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and dev server

### Backend Integration
- **RESTful API** integration
- **JWT Authentication** with refresh tokens
- **File Upload** handling (FormData)
- **Error Handling** with proper user feedback
- **Loading States** for better UX

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API server running on `http://localhost:8000`

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd socialsphere-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables
The application connects to the backend API at `http://localhost:8000/api/v1`. Update the `API_BASE_URL` in `src/lib/api.ts` if your backend runs on a different port.

### API Integration
The frontend integrates with the following backend endpoints:

#### Authentication
- `POST /users/register` - User registration
- `POST /users/login` - User login
- `POST /users/logout` - User logout
- `POST /users/refresh-access-token` - Token refresh
- `GET /users/current-user` - Get current user

#### User Management
- `POST /users/change-password` - Change password
- `POST /users/update-user-detail` - Update profile
- `POST /users/update-avatar` - Update avatar
- `POST /users/update-cover-image` - Update cover image
- `GET /users/channel/:username` - Get user channel
- `GET /users/watch-history` - Get watch history

#### Video Management
- `POST /videos/publish-video` - Upload video
- `GET /videos` - Get videos with pagination
- `GET /videos/vid/:videoId` - Get video by ID
- `POST /videos/update-video/:videoId` - Update video
- `POST /videos/delete/:videoId` - Delete video
- `POST /videos/publish-status/:videoId` - Toggle publish status

#### Playlist Management
- `POST /playlists/` - Create playlist
- `POST /playlists/add-videos/:playlistId/:videoId` - Add video to playlist
- `GET /playlists/get-playlist/:playlistId` - Get playlist details
- `GET /playlists/get-user-playlist/:userId` - Get user playlists
- `POST /playlists/delete-playlist/:playlistId` - Delete playlist
- `POST /playlists/update-playlist/:playlistId` - Update playlist
- `POST /playlists/remove-video/:playlistId/:videoId` - Remove video from playlist

#### Social Features
- `POST /likes/vid-like/:videoId` - Toggle video like
- `POST /likes/comment-like/:commentId` - Toggle comment like
- `POST /likes/post-like/:postId` - Toggle post like
- `GET /likes/get-liked-vid` - Get liked videos
- `POST /comments/create/:channelId/:videoId` - Add comment
- `GET /comments/vid-comments/:videoId` - Get video comments
- `POST /communities/` - Create community post
- `GET /communities/all-post` - Get all community posts

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── ui/              # Basic UI components
│   └── video/           # Video-related components
├── contexts/            # React Context providers
├── lib/                 # Utility functions and API client
├── pages/               # Page components
│   └── dashboard/       # Dashboard pages
├── types/               # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo to Purple gradient (`from-indigo-600 to-purple-600`)
- **Secondary**: Purple to Pink gradient (`from-purple-600 to-pink-600`)
- **Accent**: Blue to Cyan gradient (`from-blue-600 to-cyan-600`)
- **Success**: Green (`green-600`)
- **Warning**: Yellow (`yellow-600`)
- **Error**: Red (`red-600`)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800, 900
- **Line Heights**: 150% for body text, 120% for headings

### Spacing System
- **Base Unit**: 8px
- **Consistent spacing** using Tailwind's spacing scale
- **8px grid system** for proper alignment

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Protected Routes** with automatic redirects
- **Token Refresh** mechanism
- **Input Validation** on all forms
- **File Upload Validation** (size and type)
- **XSS Protection** through proper data handling

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible layouts** that adapt to all screen sizes
- **Touch-friendly** interface elements
- **Optimized performance** on mobile devices

## 🚀 Performance Optimizations

- **Code Splitting** with React.lazy
- **Image Optimization** with proper loading states
- **Efficient Re-renders** with React.memo and useMemo
- **Optimized Bundle Size** with Vite
- **Fast Development** with Hot Module Replacement

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Consistent naming** conventions
- **Component-based** architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations
- Write descriptive commit messages
- Test on multiple screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons
- **Cloudinary** for image and video hosting



## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Live streaming capabilities
- [ ] Advanced video analytics
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Video transcription
- [ ] Social media integration
- [ ] Monetization features

