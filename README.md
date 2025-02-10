## APi de logistica para delivery

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
docker build -t ripley_logistica_prueba .

# Run the container
docker run -p 3000:3000 ripley_logistica_prueba

# Access the API documentation
Open http://localhost:3000/api-docs in your browser
```
## Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```
## Testing
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Author
Juan Diego Caceres