# AskGio - AI Assistant

AskGio is a smart AI chatbot built with Next.js, React, and OpenAI's API. It provides a friendly interface for users to interact with an AI assistant.

## Features

- **AI-Powered Chat**: Communicate with an AI assistant for information, advice, or casual conversation.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes using the `ThemeToggle` component.
- **Persistent Chat History**: Chat history is saved locally in the browser.
- **Typing Indicator**: Displays a typing indicator when the AI is processing a response.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: OpenAI API
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GIOVESS/AskGio.git
   cd AskGio
   ```
2. Install dependencies:
   ```bash
   pnpm install
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```env
   DEEPINFRA_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open the app in your browser:
   ```
   http://localhost:3000
   ```

## Deployment

AskGio can be deployed to platforms like Vercel or Netlify. Ensure the environment variables are configured in the deployment settings.

## Codebase Overview

### Directory Structure

- **`app/`**: Contains the main application files, including `layout.tsx`, `page.tsx`, and global styles.
- **`components/`**: Includes reusable components such as `ThemeToggle`, `TypingIndicator`, and UI elements.
- **`hooks/`**: Custom React hooks for managing state and logic.
- **`lib/`**: Utility functions and helpers.
- **`public/`**: Static assets like images and fonts.
- **`styles/`**: Additional CSS files for styling.

### Key Components

- **`ThemeToggle`**: Allows users to switch between light and dark themes.
- **`TypingIndicator`**: Displays a typing animation while the AI processes a response.
- **`ScrollArea`**: Custom scrollable area for chat history.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.