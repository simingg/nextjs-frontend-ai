# Document Analyzer

A lightweight Document Analzyer built with Next.js and Mantine UI.

## Demo

https://main.d3jt7cirid5w8f.amplifyapp.com/


## Introduction


## Getting Started

Follow these steps to set up and run the application online

### Step 1: Configure the Project

1. Create a .env.local file, and add `API_BASE_URL`=http://fastapi-docker-ai-env.eba-e9tnf5p2.ap-southeast-1.elasticbeanstalk.com.

### Step 2: Run the Project

1. Install the project dependencies:

    ```bash
    npm install
    ```

2. Run the development server:

    ```bash
    npm run dev
    ```

3. Open your browser and go to `http://localhost:3000` to see your ap in action.

## Project Structure

Here's a brief overview of the project structure:
- **components**: Contains the main React components (`chatbot.tsx`, `errormodal.tsx`, `input.tsx`, `markdown.tsx`, `loader.tsx`, `navbar.tsx`).
- **styles**: Contains the CSS modules for styling components.
- **app**: Contains API proxy to call backend server APIs and main page
- **.env.local**: File for storing environment variables.

## Features

- **Interface**: Upload Text/Docx file OR article text. A summary and list of countries, nationalities will be displayed in top half of screen. Refresh button to reupload.
- **Responsive Design**: Built with Mantine UI for a responsive and accessible design.

### Deployment Process
#### Automatic Deployment
- **Trigger:** Push to `main` branch
- **Process:** Amplify automatically detects changes and deploys
- **Duration:** ~2-5 minutes
- **URL:** https://main.d3jt7cirid5w8f.amplifyapp.com/

#### Manual Deployment
1. Go to AWS Amplify Console
2. Select your app
3. Click "Run build" for manual deployment

### Backend Integration
- API proxy configured at `/api/analyze`
- Backend: FastAPI on AWS Elastic Beanstalk
- Mixed Content (HTTP vs HTTPS) issue handled via Next.js API routes