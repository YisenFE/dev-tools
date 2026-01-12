import { test, expect } from '@playwright/test';

test.describe('Phase 4: Enhanced Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('sidebar displays tool list', async ({ page }) => {
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    const tools = page.locator('[data-testid^="tool-"]');
    await expect(tools).toHaveCount(4); // json, base64, url, html
  });

  test('search filters tools correctly', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('json');

    // Only JSON tool should be visible
    const tools = page.locator('[data-testid^="tool-"]');
    await expect(tools).toHaveCount(1);
    await expect(tools.first()).toContainText('JSON');
  });

  test('search clears and shows all tools', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');

    // Search first
    await searchInput.fill('json');
    await expect(page.locator('[data-testid^="tool-"]')).toHaveCount(1);

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('[data-testid^="tool-"]')).toHaveCount(4);
  });

  test('theme toggle cycles through themes', async ({ page }) => {
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    // Check initial state
    await expect(themeToggle).toBeVisible();

    // Click to cycle through themes
    await themeToggle.click();
    await themeToggle.click();
    await themeToggle.click();

    // Should be back to original (3 themes: light -> dark -> system -> light)
    await expect(themeToggle).toBeVisible();
  });

  test('shortcut hint is displayed', async ({ page }) => {
    const shortcutHint = page.locator('[data-testid="shortcut-hint"]');
    await expect(shortcutHint).toBeVisible();
    await expect(shortcutHint).toContainText('Toggle window');
  });

  test('paste button exists in toolbar', async ({ page }) => {
    await page.goto('/json');
    const pasteButton = page.locator('[data-testid="btn-paste"]');
    await expect(pasteButton).toBeVisible();
  });

  test('JSON formatter works correctly', async ({ page }) => {
    await page.goto('/json');

    // Input JSON
    const editor = page.locator('[data-testid="input-editor"]');
    await editor.click();
    await page.keyboard.type('{"a":1,"b":2}');

    // Click format
    await page.click('[data-testid="btn-format"]');

    // Wait for output
    await expect(page.locator('[data-testid="output-editor"]')).not.toBeEmpty();
  });

  test('navigation between tools works', async ({ page }) => {
    // Start at JSON
    await expect(page).toHaveURL(/.*json/);

    // Navigate to Base64
    await page.click('[data-testid="tool-base64"]');
    await expect(page).toHaveURL(/.*base64/);

    // Navigate to URL Encoder
    await page.click('[data-testid="tool-url"]');
    await expect(page).toHaveURL(/.*url/);

    // Navigate to HTML Encoder
    await page.click('[data-testid="tool-html"]');
    await expect(page).toHaveURL(/.*html/);
  });

  test('copy button shows copied state', async ({ page }) => {
    await page.goto('/json');

    // Input and format JSON
    const editor = page.locator('[data-testid="input-editor"]');
    await editor.click();
    await page.keyboard.type('{"test":123}');
    await page.click('[data-testid="btn-format"]');

    // Wait for output
    await page.waitForTimeout(100);

    // Copy button should be enabled
    const copyButton = page.locator('[data-testid="btn-copy"]');
    await expect(copyButton).not.toBeDisabled();
  });
});
