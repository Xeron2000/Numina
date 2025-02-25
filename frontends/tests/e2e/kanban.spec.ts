import { test, expect } from '@playwright/test';

test('看板交互测试', async ({ page }) => {
  // 登录
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // 创建新看板卡片
  const cardContent = `Test Card ${Date.now()}`;
  await page.click('button:has-text("新建卡片")');
  await page.fill('textarea[name="content"]', cardContent);
  await page.click('button:has-text("保存")');
  
  // 验证卡片存在
  await expect(page.locator(`text=${cardContent}`)).toBeVisible();
  
  // 拖拽卡片测试
  const card = page.locator(`text=${cardContent}`).first();
  const column = page.locator('.kanban-column').nth(1);
  await card.dragTo(column);
  
  // 验证状态更新
  await expect(column.locator(`text=${cardContent}`)).toBeVisible();
});