# Image to Video Generation with Wan2.1

This React application accompanies Wan2.1 Image to Video Generation served on Koyeb. [View the Image to Video Generation code](https://github.com/jenperson/wan2.1-fastapi) Please see the [tutorial](https://github.com/jenperson/wan2.1-fastapi-tutorial/blob/main/tutorial.md) for complete instructions.

[![Deploy to Koyeb](https://www.koyeb.com/static/images/deploy/button.svg)](https://app.koyeb.com/deploy?name=wan2-1-fastapi-frontend&repository=jenperson%2Fwan2.1-fastapi-frontend&branch=main&run_command=npm+run+serve&instance_type=medium&regions=was)


## Running the app locally

1. Create a .env file at the root of the project.

2. Add your Koyeb web URL to the .env file:

```
VITE_API_BASE_URL=https://YOUR-PROJECT-ID.koyeb.app
```

3. Install required dependencies:

```
npm install
```

4. Start the app:

```
npm run dev
```

The app is now running locally at `http://localhost:5173/`