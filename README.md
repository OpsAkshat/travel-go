# Travel Go

Travel Go is a full-stack web application designed for booking domestic and international travel packages. Users can browse available packages, save them to a wishlist, leave reviews, and complete bookings through a secure checkout process. 

## Tech Stack

### Frontend
- **Framework**: React.js
- **Build Tool**: Vite
- **Routing**: React Router Dom
- **Icons**: Lucide-React
- **Styling**: Vanilla CSS

### Backend
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens) using Passlib and Python-JOSE
- **Payment Gateway**: Razorpay Integration
- **Database**: PostgreSQL

## Project Structure
- `/frontend`: Contains all React components, pages, and CSS assets.
- `/backend`: Contains the FastAPI application, database schemas, and API routes.

## Local Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your environment variables (Database URL, JWT Secret, Razorpay keys).
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Set your API URL variable environment.
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
