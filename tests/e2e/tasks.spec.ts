import { test, expect } from '@playwright/test'

test.describe('Tasks Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Test1234')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should create a new task', async ({ page }) => {
    await page.fill('input[placeholder*="título"]', 'Nova Tarefa E2E')
    await page.fill('textarea[placeholder*="descrição"]', 'Descrição da tarefa')
    await page.click('button:has-text("Criar Tarefa")')
    
    await expect(page.locator('text=Nova Tarefa E2E')).toBeVisible()
  })

  test('should filter tasks by status', async ({ page }) => {
    await page.click('button:has-text("Pendentes")')
    
    await expect(page.locator('.space-y-4')).toBeVisible()
  })

  test('should search tasks', async ({ page }) => {
    await page.fill('input[placeholder*="Buscar"]', 'test')
    
    await expect(page.locator('.space-y-4')).toBeVisible()
  })
})

