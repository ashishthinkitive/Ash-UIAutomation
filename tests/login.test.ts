import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Test data
const credentials = {
  username: 'saurabh.kale+julie@medarch.com',
  password: 'Pass@123'
};

// Test configuration
test.use({
  viewport: { width: 1280, height: 720 },
  ignoreHTTPSErrors: true,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure'
});

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display all login form elements', async ({ page }) => {
    // Verify all form elements are visible
    await expect(page.locator('input[type="email"], input[type="text"], input[name="username"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"], input[type="submit"]').first()).toBeVisible();
    
    // Check if login form is visible
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Login with valid credentials
    await loginPage.login(credentials.username, credentials.password);
    
    // Wait for successful login
    const loginSuccess = await loginPage.waitForLoginSuccess();
    expect(loginSuccess).toBeTruthy();
    
    // Verify we're no longer on login page
    const url = page.url();
    expect(url).not.toContain('login');
    
    // Take screenshot of successful login
    await page.screenshot({ path: 'screenshots/login-success.png', fullPage: true });
  });

});

test.describe('Login Form Validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should clear form fields', async ({ page }) => {
    // Enter credentials
    await loginPage.enterCredentials(credentials.username, credentials.password);
    
    // Verify values are entered
    let usernameValue = await loginPage.getUsernameValue();
    let passwordValue = await loginPage.getPasswordValue();
    expect(usernameValue).toBe(credentials.username);
    expect(passwordValue).toBe(credentials.password);
    
    // Clear form
    await loginPage.clearLoginForm();
    
    // Verify fields are cleared
    usernameValue = await loginPage.getUsernameValue();
    passwordValue = await loginPage.getPasswordValue();
    expect(usernameValue).toBe('');
    expect(passwordValue).toBe('');
  });
});

test.describe('Login Page Navigation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('should navigate to login page', async ({ page }) => {
    await loginPage.navigate();
    
    // Verify we're on the login page
    const url = page.url();
    expect(url).toContain('qa_newphantompg.qa.provider.ecarehealth.com');
    
    // Verify login form is visible
    const isFormVisible = await loginPage.isLoginFormVisible();
    expect(isFormVisible).toBeTruthy();
  });

  test('should refresh login page', async ({ page }) => {
    await loginPage.navigate();
    
    // Enter some data
    await loginPage.enterUsername('test@example.com');
    
    // Refresh page
    await loginPage.refreshPage();
    
    // Verify field is cleared after refresh
    const usernameValue = await loginPage.getUsernameValue();
    expect(usernameValue).toBe('');
  });
});

// Parameterized test for multiple login scenarios
const loginScenarios = [
  { username: 'wrong@email.com', password: 'wrongpass', description: 'invalid credentials', shouldSucceed: false },
  { username: credentials.username, password: credentials.password, description: 'valid credentials', shouldSucceed: true }
];
