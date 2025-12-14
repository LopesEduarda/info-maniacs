import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should register a new user', async ({ page }) => {
    await page.goto('/register')
    
    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'Test1234')
    await page.fill('input[name="confirmPassword"]', 'Test1234')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
  })

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Test1234')
    
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/dashboard')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'invalid@example.com')
    await page.fill('input[name="password"]', 'WrongPassword')
    
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Credenciais inválidas')).toBeVisible()
  })
})

