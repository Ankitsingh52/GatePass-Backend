
# Gate Pass Management System

A comprehensive digital gate pass approval system for educational institutions, streamlining the process for students, faculty, and administrators.

## Overview

The Gate Pass Management System is a web application designed to digitize and streamline the process of requesting, approving, and managing gate passes for students in educational institutions. The system facilitates communication between students and various approval authorities like coordinators, vice-HODs, and HODs.

## Features

### For Students
- **Dashboard**: View statistics of all gate passes (approved, pending, rejected)
- **Apply for Gate Pass**: Submit new gate pass requests with reason and duration
- **Track Gate Passes**: Monitor the status of submitted gate passes
- **View Details**: Access detailed information about each gate pass application
- **Download Gate Pass**: Generate and download approved gate passes as PDF

### For HODs/Vice-HODs/Coordinators
- **Dashboard**: Overview of all gate pass requests requiring attention
- **Pending Approvals**: Review and take action on pending gate pass requests
- **Approve/Reject Passes**: Provide decision with comments on student gate pass requests
- **View History**: Access history of approved and rejected gate passes

### For Administrators
- **User Management**: Add, edit, and manage user accounts and user roles.

## Backend Tech Stack
- Node.js
- Express.js
- JWT
- MongoDB
- RabbitMQ
- Redis

## API Routes

The system implements the following API routes:

```
POST /api/v1/login - User authentication
POST /api/v1/logout - User logout
PUT /api/v1/changepassword - Change user password
POST /api/v1/gatepass - Create new gate pass (student role)
GET /api/v1/gatepass - Get all gate passes for current user (student role)
GET /api/v1/gatepass/pending - Get pending gate passes for current user (student role)
GET /api/v1/gatepass/approved - Get approved gate passes for current user (student role)
GET /api/v1/approvals/pending - Get pending approvals for the approver (approver roles)
PUT /api/v1/approvals/approve/:gatePassId - Approve/reject a gate pass (approver roles)
GET /api/v1/approvals/approved - Get approved passes by the approver (approver roles)
```

## User Roles

- **Student**: Can apply for gate passes and view their own gate pass history
- **Coordinator**: First level of approval for student gate passes
- **Vice-HOD**: Second level of approval for student gate passes
- **HOD**: Final level of approval for student gate passes
- **Admin**: System administrator with access to all features

## Getting Started

### Prerequisites
- Node.js (version 14 or above)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/Ankitsingh52/GatePass-Backend.git
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

