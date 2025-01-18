# Logistics API

## Overview
A robust RESTful API service for managing delivery schedules and coverage areas. This service provides efficient routing and scheduling capabilities while considering various business constraints such as product sizes, delivery windows, and geographical coverage.

## Features
- 🚚 Dynamic delivery schedule management
- 📦 Product size-based routing
- ⏰ Flexible cut-off time handling
- 🗺️ Geographical coverage validation
- 🔒 Rate limiting and security features
- 📊 Performance monitoring
- 🏥 Health checks
- 📝 Comprehensive logging

## Technical Stack
- Node.js (v23.6.0)
- TypeScript
- Express.js
- Jest for testing
- Docker support
- OpenAPI (Swagger) documentation

## Prerequisites
- Node.js (v23.6.0 or higher)
- npm (latest version)
- Docker (optional)

## Installation

### Local Setup
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Build the project
npm run build

# Start the server
npm run dev

# Access the API documentation
Open http://localhost:3000/api-docs in your browser

```


### Docker Setup
```bash
# Build the Docker image
docker build -t logistics-api .

# Run the container
docker run -p 3000:3000 logistics-api

# Access the API documentation
Open http://localhost:3000/api-docs in your browser
```


## Accessing the API

1. **API Documentation**
   - Open your browser
   - Navigate to: `http://localhost:3000/api-docs`
   - You'll see the Swagger UI interface where you can test all endpoints

2. **Available Endpoints**
   - `POST /api/schedule/coverage` - Get delivery schedule coverage
   - `GET /api/health` - Check API health status

3. **Testing the API**
   - Use the Swagger UI interface at `/api-docs`
   - Or use cURL/Postman with these example requests:

   ```bash
   # Check API Health
   curl http://localhost:3000/api/health

   # Get Schedule Coverage
   curl -X POST http://localhost:3000/api/schedule/coverage \
   -H "Content-Type: application/json" \
   -d '{
     "products": ["2000378936145"],
     "commune": "San Bernardo"
   }'
   ```

## Environment Variables
```env
NODE_ENV=development
PORT=3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
CORS_ORIGIN=*
```

## API Documentation
The API documentation is available through Swagger UI at `/api-docs` when the server is running.

### Key Endpoints

#### POST /api/schedule/coverage
Get delivery schedule coverage for products in a specific commune.

Request body:
```json
{
  "products": ["2000378936145"],
  "commune": "San Bernardo"
}
```

Response:
```json
{
  "products": [{
    "product": "2000378936145",
    "schedules": [{
      "id": "AZSR-1082-DP",
      "courier": "1082",
      "serviceType": "S",
      "deliveryMethod": "DP",
      "cutTime": ["Schedule is available 24/7 - No time restrictions"]
    }]
  }],
  "errors": []
}
```

#### GET /api/health
Health check endpoint providing system status and metrics.

## Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Jest for unit testing
- Winston for logging

## Security Features
- Helmet.js for HTTP headers security
- Rate limiting to prevent abuse
- CORS configuration
- Input validation
- Error handling middleware

## Performance Features
- Request timing metrics
- Memory usage monitoring
- CPU load monitoring
- Response time tracking

## Project Structure
```
.
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Type definitions
│   ├── routes/        # Route definitions
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── app.ts         # Application entry point
├── tests/             # Test files
├── Dockerfile         # Docker configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Project dependencies
```

## Error Handling
The API implements a robust error handling system with:
- Custom error classes
- Detailed error messages
- Error logging
- HTTP status code mapping

## Monitoring and Logging
- Request logging with Morgan
- Application logging with Winston
- Performance metrics tracking
- Health check endpoint with system metrics


## Author
Israel Vallejos

## Acknowledgments
- RipleyTech for the opportunity
- Express.js community
- Node.js community