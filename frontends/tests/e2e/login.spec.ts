import { test, expect } from '@playwright/test';

test('用户登录流程', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  
  // 输入凭证并提交
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 验证跳转至仪表盘
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(page.locator('h1')).toContainText('分析看板');
});