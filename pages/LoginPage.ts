import { Page, Locator } from 'playwright';

export class LoginPage {
  private page: Page;
  
  // Define all locators as private properties
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly pageTitle: Locator;
  private readonly loginForm: Locator;
  
  // Define URL
  private readonly url: string = 'https://qa_newphantompg.qa.provider.ecarehealth.com/';

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all locators
    this.usernameInput = page.locator('input[name="username"], input[type="email"], input[id="username"], input[id="email"], input[placeholder*="email" i], input[placeholder*="username" i]').first();
    this.passwordInput = page.locator('input[name="password"], input[type="password"], input[id="password"], input[placeholder*="password" i]').first();
    this.loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign in"), button:has-text("Submit"), button:has-text("Log in")').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, .error, [class*="error"], [role="alert"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password"), a:has-text("Forgot password"), a:has-text("Reset password")').first();
    this.rememberMeCheckbox = page.locator('input[type="checkbox"][name="remember"], input[type="checkbox"][id="remember"], label:has-text("Remember me") input[type="checkbox"]').first();
    this.pageTitle = page.locator('h1, h2, .login-title, .page-title').first();
    this.loginForm = page.locator('form, .login-form, #login-form, [class*="login-form"]').first();
  }

  // Navigation methods
  async navigate(): Promise<void> {
    await this.page.goto(this.url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await this.waitForLoginForm();
  }

  async navigateToCustomUrl(customUrl: string): Promise<void> {
    await this.page.goto(customUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await this.waitForLoginForm();
  }

  // Wait methods
  private async waitForLoginForm(): Promise<void> {
    await this.loginForm.waitFor({ 
      state: 'visible', 
      timeout: 10000 
    }).catch(async () => {
      // Fallback: wait for username or password field
      await Promise.race([
        this.usernameInput.waitFor({ state: 'visible', timeout: 10000 }),
        this.passwordInput.waitFor({ state: 'visible', timeout: 10000 })
      ]);
    });
  }

  // Input methods
  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async enterCredentials(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
  }

  // Action methods
  async clickLoginButton(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  async checkRememberMe(): Promise<void> {
    const isVisible = await this.rememberMeCheckbox.isVisible();
    if (isVisible) {
      await this.rememberMeCheckbox.check();
    }
  }

  async uncheckRememberMe(): Promise<void> {
    const isVisible = await this.rememberMeCheckbox.isVisible();
    if (isVisible) {
      await this.rememberMeCheckbox.uncheck();
    }
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  // Combined login method
  async login(username: string, password: string, rememberMe: boolean = false): Promise<void> {
    await this.enterCredentials(username, password);
    
    if (rememberMe) {
      await this.checkRememberMe();
    }
    
    await this.clickLoginButton();
  }

  // Validation methods
  async isLoginFormVisible(): Promise<boolean> {
    try {
      await this.loginForm.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    if (await this.isErrorMessageDisplayed()) {
      return await this.errorMessage.textContent() || '';
    }
    return '';
  }

  async getPageTitle(): Promise<string> {
    return await this.pageTitle.textContent() || '';
  }

  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.usernameInput.isVisible();
  }

  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  async waitForLoginSuccess(timeout: number = 30000): Promise<boolean> {
    try {
      // Wait for URL change or specific elements that indicate successful login
      await Promise.race([
        this.page.waitForURL('**/dashboard/**', { timeout }),
        this.page.waitForURL('**/home/**', { timeout }),
        this.page.waitForURL('**/welcome/**', { timeout }),
        this.page.waitForSelector('.dashboard, .home, .user-menu, .logout-button', { timeout }),
        this.page.waitForFunction(() => {
          const url = window.location.href;
          return !url.includes('login') && !url.includes('signin');
        }, { timeout })
      ]);
      return true;
    } catch {
      return false;
    }
  }

  async waitForLoginFailure(timeout: number = 10000): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // Utility methods
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ 
      path: filename, 
      fullPage: true 
    });
  }

  async getPageUrl(): Promise<string> {
    return this.page.url();
  }

  async refreshPage(): Promise<void> {
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  async clearLoginForm(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  // Get input values
  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async isRememberMeChecked(): Promise<boolean> {
    const isVisible = await this.rememberMeCheckbox.isVisible();
    if (isVisible) {
      return await this.rememberMeCheckbox.isChecked();
    }
    return false;
  }
}