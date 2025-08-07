# 🌾 Smart Crop Advisor - AI-Powered Crop Prediction System

A comprehensive web application that helps farmers make informed decisions about crop selection based on soil conditions, weather data, and agricultural best practices.

## 🚀 Features

- **Intelligent Crop Prediction**: AI-powered recommendations based on soil and weather analysis
- **Detailed Care Instructions**: Comprehensive growing guides for each recommended crop
- **Multi-factor Analysis**: Considers pH, nutrients, temperature, humidity, rainfall, and soil type
- **User-friendly Interface**: Clean, responsive design built with React and Material-UI
- **Real-time Results**: Instant crop recommendations with confidence scores

## 🛠️ Technology Stack

### Backend
- **Django 4.2.7**: Web framework
- **Django REST Framework**: API development
- **SQLite**: Database
- **Python Libraries**: NumPy, Pandas, Scikit-learn for data processing

### Frontend
- **React 18**: User interface
- **Material-UI**: Component library
- **Axios**: HTTP client
- **React Router**: Navigation

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## 🔧 Installation & Setup

### Quick Setup (Windows)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diya
   ```

2. **Setup Backend**
   ```bash
   setup_backend.bat
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   setup_frontend.bat
   ```

### Manual Setup

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py populate_crops
python manage.py runserver
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 🌐 Usage

1. **Start the Backend Server**
   ```bash
   cd backend
   python manage.py runserver
   ```
   Backend will run on `http://localhost:8000`

2. **Start the Frontend Server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on `http://localhost:3000`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📊 How It Works

### Input Parameters
- **Location**: Farm location
- **Soil Data**: pH level, Nitrogen, Phosphorus, Potassium, Organic matter, Soil type
- **Weather Data**: Temperature, Humidity, Rainfall

### Prediction Algorithm
The system analyzes multiple factors:
- Temperature compatibility (25% weight)
- pH level suitability (25% weight)
- Humidity requirements (20% weight)
- Rainfall needs (20% weight)
- Soil type matching (10% weight)

### Output
- **Crop Recommendations**: Top 5 suitable crops
- **Suitability Scores**: Percentage match for each crop
- **Care Instructions**: Detailed growing guidelines
- **Optimal Conditions**: Required environmental parameters

## 🌱 Supported Crops

The system includes data for 8 major crops:
- Rice (Kharif season)
- Wheat (Rabi season)
- Maize (Kharif/Rabi)
- Cotton (Kharif)
- Sugarcane (Annual)
- Tomato (Rabi/Summer)
- Potato (Rabi)
- Onion (Rabi)

## 🔗 API Endpoints

- `GET /api/crops/` - List all crops
- `GET /api/crops/{id}/` - Get crop details
- `POST /api/predict/` - Get crop predictions
- `GET /api/crops/{id}/care/` - Get care instructions
- `GET /api/predictions/` - Get prediction history

## 📱 Screenshots

### Main Interface
- Clean, intuitive form for entering farm data
- Real-time validation and user feedback

### Results Display
- Visual suitability scores with progress bars
- Detailed crop information cards
- Modal dialogs for comprehensive care instructions

## 🎯 Project Highlights for Presentation

1. **Real-world Application**: Addresses actual farming challenges
2. **Full-stack Development**: Complete web application with API
3. **AI Integration**: Smart prediction algorithms
4. **Modern UI/UX**: Professional, responsive design
5. **Scalable Architecture**: Clean separation of concerns
6. **Data-driven Decisions**: Evidence-based recommendations

## 🚀 Future Enhancements

- Weather API integration for real-time data
- Machine learning model training with historical data
- Mobile app development
- Multi-language support
- Crop disease prediction
- Market price integration

## 👥 Team

Developed for academic presentation - demonstrating full-stack web development skills with practical agricultural applications.

## 📄 License

This project is developed for educational purposes.

---

**Note**: This system provides recommendations based on general agricultural principles. Always consult with local agricultural experts for specific farming decisions.