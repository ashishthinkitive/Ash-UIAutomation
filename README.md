# Simple Playwright TypeScript Framework

This is a simple Playwright framework using TypeScript and Page Object Model pattern.

## Project Structure
```
playwright-simple-framework/
├── pages/              # Page Object files
│   └── LoginPage.ts    # Login page object
├── tests/              # Test files
│   └── login.test.ts   # Login tests
├── package.json        # Project dependencies
└── playwright.config.ts # Playwright configuration
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
# Run tests in headless mode
npm test

# Run tests in headed mode (see browser)
npm run test:headed
```

## Page Object Model Explanation

- **Page Object**: A class that represents a web page
- **Benefits**: 
  - Reusable code
  - Easy to maintain
  - Clear separation between test logic and page elements

## Test Example

The login test demonstrates:
1. Creating a page object instance
2. Navigating to the page
3. Performing actions (filling forms, clicking buttons)
4. Verifying results with assertions

## Test Site

Tests run against: https://the-internet.herokuapp.com/login

**Valid credentials:**
- Username: tomsmith
- Password: SuperSecretPassword!
