# Collaborative Task Manager 🚀

A production-ready, full-stack collaborative task management application built with modern web technologies. This application features real-time updates, JWT authentication, and a beautiful responsive UI.

## ✨ Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens and HttpOnly cookies
- **Task Management**: Create, read, update, and delete tasks with full CRUD operations
- **Real-time Updates**: Instant task synchronization across all connected clients using Socket.io
- **Task Assignment**: Assign tasks to team members and track ownership
- **Task Filtering**: View tasks by different categories (My Tasks, Created By Me, Overdue)
- **Priority Levels**: Organize tasks with LOW, MEDIUM, and HIGH priority
- **Status Tracking**: Track task progress with TODO, IN_PROGRESS, and COMPLETED statuses
- **Due Dates**: Set and track task deadlines

### Technical Features
- **100% Type Safety**: Full TypeScript implementation with strict mode
- **Optimistic UI Updates**: Instant feedback with TanStack Query
- **Input Validation**: Server-side validation using Zod schemas
- **Error Handling**: Comprehensive error handling and user-friendly messages
- **Responsive Design**: Beautiful UI that works on all devices
- **Clean Architecture**: Controller-Service-Repository pattern for maintainability

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs for password hashing
- **Real-time**: Socket.io for WebSocket connections
- **Validation**: Zod for schema validation
- **Testing**: Jest for unit testing

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Real-time**: Socket.io Client

## 📁 Project Structure

```
collaborative-task-manager/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   └── TaskModal.tsx
│   │   ├── context/           # React Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── SocketContext.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useTasks.ts
│   │   │   └── useUsers.ts
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── MyTasks.tsx
│   │   │   ├── CreatedByMe.tsx
│   │   │   └── Overdue.tsx
│   │   ├── services/          # API service layer
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   └── taskService.ts
│   │   ├── types/             # TypeScript type definitions
│   │   ├── App.tsx            # Main application component
│   │   └── main.tsx           # Application entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.ts
│   │   │   └── taskController.ts
│   │   ├── services/          # Business logic layer
│   │   │   ├── authService.ts
│   │   │   └── taskService.ts
│   │   ├── repositories/      # Data access layer
│   │   │   ├── userRepository.ts
│   │   │   └── taskRepository.ts
│   │   ├── middlewares/       # Express middlewares
│   │   │   ├── authMiddleware.ts
│   │   │   ├── errorMiddleware.ts
│   │   │   └── validateMiddleware.ts
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── taskRoutes.ts
│   │   ├── socket/            # Socket.io configuration
│   │   ├── utils/             # Utility functions
│   │   │   ├── errors.ts
│   │   │   ├── prisma.ts
│   │   │   └── validation.ts
│   │   ├── types/             # TypeScript type definitions
│   │   ├── __tests__/         # Jest unit tests
│   │   ├── app.ts             # Express app configuration
│   │   └── index.ts           # Server entry point
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
└── .gitignore
```

## 🚀 Getting Started

> **Deploying to Production?** See our [DEPLOYMENT.md](./DEPLOYMENT.md) guide for deploying to Netlify and Render.

### Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **npm**: v9 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-task-manager
   ```

2. **Set up the server**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/task_manager"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"
   
   # Server
   PORT=5000
   NODE_ENV="development"
   
   # Client
   CLIENT_URL="http://localhost:5173"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate
   
   # Run migrations
   npm run prisma:migrate
   
   # (Optional) Open Prisma Studio to view database
   npm run prisma:studio
   ```

5. **Set up the client**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server** (from the `server` directory)
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the client** (from the `client` directory, in a new terminal)
   ```bash
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## 🧪 Testing

### Backend Tests

Run Jest unit tests for the backend:

```bash
cd server
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
```

## 🏗️ Building for Production

### Backend

```bash
cd server
npm run build        # Compile TypeScript to JavaScript
npm start           # Run the compiled application
```

### Frontend

```bash
cd client
npm run build       # Build optimized production bundle
npm run preview     # Preview the production build locally
```

## 🌐 Deployment

This application can be deployed to production using modern hosting platforms.

### Quick Deploy

- **Frontend (Netlify)**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)
- **Backend (Render)**: [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Deployment Guide

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**, which includes:

- Step-by-step backend deployment to Render
- Frontend deployment to Netlify
- Environment variable configuration
- Database setup
- Troubleshooting common issues
- Post-deployment testing

### Live Demo

Once deployed, you can access:

- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-app.onrender.com/api`

> **Note**: Update these URLs after your deployment is complete.

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### WebSocket Events

- `task:created` - Emitted when a new task is created
- `task:updated` - Emitted when a task is updated
- `task:deleted` - Emitted when a task is deleted

## 🎨 UI Pages

- **Login/Register**: User authentication pages
- **Dashboard**: Overview of all tasks
- **My Tasks**: Tasks assigned to the current user
- **Created By Me**: Tasks created by the current user
- **Overdue**: Tasks that are past their due date

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- HttpOnly cookies for token storage
- CORS configuration
- Input validation with Zod
- SQL injection protection via Prisma ORM
- XSS protection

## 🎯 Architecture Patterns

### Backend Architecture

The server follows a **Controller-Service-Repository** pattern:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access and database operations

This separation provides:
- Clear separation of concerns
- Easy testing with mocks
- Maintainable and scalable codebase

### Frontend Architecture

The client follows a **Component-Based** architecture:

- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Services**: API communication layer
- **Hooks**: Custom React hooks for shared logic
- **Context**: Global state management

## 🔧 Development Tools

- **TypeScript**: Type safety across the entire application
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended to add)
- **Prisma Studio**: Database GUI
- **React DevTools**: Frontend debugging
- **Vite HMR**: Fast refresh during development

## 📝 Database Schema

### User Model
- `id`: UUID (Primary Key)
- `email`: Unique email address
- `password`: Hashed password
- `name`: User's name
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Task Model
- `id`: UUID (Primary Key)
- `title`: Task title
- `description`: Optional description
- `status`: TODO | IN_PROGRESS | COMPLETED
- `priority`: LOW | MEDIUM | HIGH
- `dueDate`: Optional due date
- `createdById`: Reference to User
- `assignedToId`: Optional reference to User
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## 🚧 Future Enhancements

- Task comments and discussions
- File attachments
- Task categories/labels
- Advanced search and filtering
- Task dependencies
- Email notifications
- Team/workspace management
- Activity timeline
- Analytics dashboard
- Mobile application

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- None currently reported

## 📞 Support

For support, please open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
