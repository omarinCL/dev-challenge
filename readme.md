docker build --build-arg PORT=3000 -t schedules-app .
docker run -p 3000:3000 -e PORT=3000 schedules-app

LOCAL
npm run clean && npm run build && npm start 

TEST
npm run test

SWAGGER
http://localhost:3000/api-ripley/#/default/post_api_schedule_coverage