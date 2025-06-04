# Car Spotting App

**Car Spotting App** is a website that allows users to upload and share images of cars they have spotted. The application leverages AI for car make and model recognition and provides additional vehicle details from the Statens Vegvesen registry for Norwegian registration numbers.

**You can find the site here:** [https://spots.vest.li](https://spots.vest.li)

## Features

- **AI Recognition (ChatGPT 4.0 lite & OpenAI API):** Identifies car makes and models from uploaded images.
- **Vehicle Details from Statens Vegvesen:** Gets technical details and specs of Norwegian-registered cars via the [Statens Vegvesen reg API](https://www.vegvesen.no/om-oss/om-organisasjonen/apne-data/et-utvalg-apne-data/api-for-tekniske-kjoretoyopplysninger/).
- **Frontend Stack:** Built with Next.js, TypeScript, and Tailwind CSS.
- **Backend:** Uses Express for API endpoints and Redis for fast data storage.
- **CDN Integration:** Save images to a custom CDN and store the image URLs in the database.

## Technologies Used

- **Frontend:** [Next.js](https://nextjs.org/) with TypeScript and Tailwind
- **Backend:** [Express.js](https://expressjs.com/) and [Redis](https://redis.io/)
- **AI Integration:** [OpenAI API](https://platform.openai.com/api-keys) (for ChatGPT 4.0 lite)
- **Data Source:** [Statens Vegvesen reg API](https://www.vegvesen.no/om-oss/om-organisasjonen/apne-data/et-utvalg-apne-data/api-for-tekniske-kjoretoyopplysninger/)

## Running it locally

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Redis Insight](https://redis.com/redis-enterprise/redis-insight/) (optional, for easier database inspection)
- [Node.js and npm](https://nodejs.org/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VetleViking/CarSpottingApp.git
   cd CarSpottingApp
   ```

2. **Set up environment variables:**
   - Copy the `.env.example` files in both `frontend` and `backend` directories and rename them to `.env`.
   - Update the `.env` files with your own API keys, Redis connection info, and CDN URLs.

3. **Install dependencies in the frontend and backend:**
   ```bash
   # from both the frontend and the backend directory
   npm install
   ```

4. **Final install and run both:**
   ```bash
   # from the root directory
   npm install
   npm run dev
   ```

### CDN Configuration

If you do not have a CDN set up, you’ll need to modify the `/addspot` endpoint in the backend. Either:

- Set up your own CDN and adjust the code accordingly.
- Replace the CDN image links with placeholder URLs (e.g., [Cataas](https://cataas.com/cat)) to ensure the app still functions without image hosting.
