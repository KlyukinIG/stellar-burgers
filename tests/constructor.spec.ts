import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false // Используем существующий HAR-файл
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        json: {
          success: true,
          user: {
            email: 'test@test.com',
            name: 'Test User'
          }
        }
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          json: {
            success: true,
            order: {
              number: 12345
            }
          }
        });
      } else {
        await route.continue();
      }
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('http://localhost:4000/');
    await page.waitForLoadState('networkidle');
  });

  test('должен добавить булку и начинку в конструктор', async ({ page }) => {
    await page.waitForSelector('li', { hasText: 'Краторная булка N-200i' });

    const bunElement = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const addBunButton = bunElement.locator('button', { hasText: 'Добавить' });
    await addBunButton.click();

    const constructorBunTop = page
      .locator(
        'div.constructor-element_pos_top, div[class*="constructor-element"]'
      )
      .filter({ hasText: 'Краторная булка N-200i (верх)' })
      .first();
    await expect(constructorBunTop).toBeVisible();

    const mainElement = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const addMainButton = mainElement.locator('button', {
      hasText: 'Добавить'
    });
    await addMainButton.click();

    const constructorMain = page
      .locator('li', { hasText: 'Биокотлета из марсианской Магнолии' })
      .first();
    await expect(constructorMain).toBeVisible();

    const constructorBunBottom = page
      .locator('div', { hasText: 'Краторная булка N-200i (низ)' })
      .first();
    await expect(constructorBunBottom).toBeVisible();
  });

  test('должен открыть модальное окно ингредиента', async ({ page }) => {
    await page.waitForSelector('li', { hasText: 'Краторная булка N-200i' });

    const bunElement = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const link = bunElement.locator('a');
    await link.click();

    const modal = page
      .locator('#modals > div')
      .filter({
        has: page.locator('h3', { hasText: 'Детали ингредиента' })
      })
      .first();
    await expect(modal).toBeVisible();
  });

  test('должен закрыть модальное окно по клику на крестик', async ({
    page
  }) => {
    await page.waitForSelector('li', { hasText: 'Краторная булка N-200i' });

    const bunElement = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const link = bunElement.locator('a');
    await link.click();

    const modal = page
      .locator('#modals > div')
      .filter({
        has: page.locator('h3', { hasText: 'Детали ингредиента' })
      })
      .first();
    await expect(modal).toBeVisible();

    const closeButton = modal
      .locator('button')
      .filter({ has: page.locator('svg') });
    await closeButton.click();

    await expect(modal).not.toBeVisible();
  });

  test('должен закрыть модальное окно по клику на оверлей', async ({
    page
  }) => {
    await page.waitForSelector('li', { hasText: 'Краторная булка N-200i' });

    const bunElement = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const link = bunElement.locator('a');
    await link.click();

    const modal = page
      .locator('#modals > div')
      .filter({
        has: page.locator('h3', { hasText: 'Детали ингредиента' })
      })
      .first();
    await expect(modal).toBeVisible();

    const outerElement = page.viewportSize();
    if (outerElement) {
      await page.mouse.click(outerElement.width - 50, 50);
    }

    await expect(modal).not.toBeVisible();
  });

  test('должен создать заказ и отобразить номер', async ({ page }) => {
    await page.waitForSelector('li', { hasText: 'Краторная булка N-200i' });

    const bunElement = page.locator('li', {
      hasText: 'Краторная булка N-200i'
    });
    const addBunButton = bunElement.locator('button', { hasText: 'Добавить' });
    await addBunButton.click();

    const mainElement = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии'
    });
    const addMainButton = mainElement.locator('button', {
      hasText: 'Добавить'
    });
    await addMainButton.click();

    const sauceElement = page.locator('li', {
      hasText: 'Соус традиционный галактический'
    });
    const addSauceButton = sauceElement.locator('button', {
      hasText: 'Добавить'
    });
    await addSauceButton.click();

    const constructorBunTop = page
      .locator(
        'div.constructor-element_pos_top, div[class*="constructor-element"]'
      )
      .filter({ hasText: 'Краторная булка N-200i (верх)' })
      .first();
    await expect(constructorBunTop).toBeVisible();

    const orderButton = page.locator('button', { hasText: 'Оформить заказ' });
    await orderButton.click();

    const orderModal = page
      .locator('#modals > div')
      .filter({
        has: page.locator('h2.text_type_digits-large')
      })
      .first();
    await expect(orderModal).toBeVisible();

    const orderNumber = page.locator('h2.text_type_digits-large');
    await expect(orderNumber).toHaveText('12345');

    await expect(constructorBunTop).not.toBeVisible();

    const closeButton = orderModal
      .locator('button')
      .filter({ has: page.locator('svg') });
    await closeButton.click();

    await expect(orderModal).not.toBeVisible();
  });
});
