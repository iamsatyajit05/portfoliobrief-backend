# PortfolioBrief Backend

## Getting Started

**Start the Development Server:**

   ```bash
   npm run dev
   ```

**Production Build:**

   ```bash
   npm run build
   ```

**Run Prodcution Server**

   ```bash
    npm run start
   ```

**Prettier:**

   ```bash
   npm run format
   ```

## Project Structure

The project structure is designed to provide a clear and organized way to build your application. Here's an overview of the structure:

```bash
portfoliobrief-backend/
├── src
│   ├── config
│   │   ├── dbConfig.ts
│   │   ├── index.ts
│   │   ├── redisConfig.ts
│   ├── controllers
│   │   └── userController.ts
│   ├── middlewares
│   │   ├── authMiddleware.ts
│   │   ├── authorizationMiddleware.ts
│   │   ├── rateLimit.ts
│   │   ├── validationMiddleware.ts
│   │   └── errorHandler.ts
│   ├── models
│   │   └── userModel.ts
│   ├── routes
│   │   ├── index.ts
│   │   ├── health.ts
│   │   └── userRoutes.ts
│   ├── services
│   │   ├── userService.ts
│   ├── utils
│   │   ├── authUtils.ts
│   │   ├── bcryptUtils.ts
│   │   ├── logger.ts
│   │   └── token.ts
│   |── validators
│   │   ├── userValidator.ts
│   |   └── serviceValidator.ts
│   └── app.ts
├── tests
├── .env
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── tsconfig.json
└── README.md

```

## Scripts

- `npm run dev`: Start the development server with Nodemon.
- `npm run build`: Compile TypeScript to JavaScript.
- `npm run start`: Start the production server.
- `npm run test`: Run tests using Jest.
- `npm run format`: Format code using Prettier.

## Testing

This project uses the Jest testing framework for writing unit and integration tests. You can find the test files in the `tests` directory. To run the tests, use the following command:

```bash
npm run test
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you find a bug or want to add a new feature.

## License

This project is open-source and available under the [ISC License](https://opensource.org/licenses/ISC).
