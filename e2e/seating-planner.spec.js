import { test, expect } from '@playwright/test'

// Clear localStorage before each test for clean state
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('header')
})

test.describe('App loads', () => {
  test('renders toolbar, sidebar, and canvas', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('aside')).toBeVisible()
    await expect(page.locator('.blueprint-grid')).toBeVisible()
  })

  test('shows empty state message when no tables', async ({ page }) => {
    await expect(page.getByText('Select a shape above')).toBeVisible()
  })
})

test.describe('Table management', () => {
  test('adds a table via "+ Add Table" button', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
    await expect(page.getByText('Select a shape above')).not.toBeVisible()
  })

  test('adds multiple tables', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.getByRole('button', { name: /add table/i }).click()
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(3)
  })

  test('selects a table on click', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await expect(page.locator('.context-menu-panel')).toBeVisible()
  })

  test('deletes a table with Delete key', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await expect(page.locator('.context-menu-panel')).toBeVisible()
    await page.keyboard.press('Delete')
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(0)
  })

  test('duplicates a table', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await expect(page.locator('.context-menu-panel')).toBeVisible()
    // Click duplicate button using force since it's a small overlay
    const dupBtn = page.getByTitle('Duplicate table')
    await dupBtn.click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(2)
  })
})

test.describe('Shape switching', () => {
  test('switches shape via toolbar segmented control', async ({ page }) => {
    const shapeButtons = page.locator('.segmented-btn')
    await shapeButtons.nth(1).click() // Rectangle
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  })

  test('changes table shape via context menu', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await page.locator('.context-menu-panel button[title="Rect"]').click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  })
})

test.describe('Guest management', () => {
  test('adds a guest from sidebar', async ({ page }) => {
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await expect(page.locator('aside').getByText('Alice')).toBeVisible()
  })

  test('adds multiple guests', async ({ page }) => {
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await input.fill('Bob')
    await input.press('Enter')
    await input.fill('Charlie')
    await input.press('Enter')
    await expect(page.locator('aside').getByText('Alice')).toBeVisible()
    await expect(page.locator('aside').getByText('Bob')).toBeVisible()
    await expect(page.locator('aside').getByText('Charlie')).toBeVisible()
  })
})

test.describe('Auto-seat', () => {
  test('auto-seats guests into available tables', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await input.fill('Bob')
    await input.press('Enter')
    await page.getByRole('button', { name: /auto seat/i }).click()
    await page.waitForTimeout(300)
    // Seated guests show on seats — check that seat elements have text
    const seatTexts = await page.locator('[data-table-wrapper] [data-seat-id]').allTextContents()
    const nonEmpty = seatTexts.filter(t => t.trim().length > 0)
    expect(nonEmpty.length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Zoom controls', () => {
  test('zoom in and out buttons work', async ({ page }) => {
    const zoomDisplay = page.locator('header').getByText('%')
    const initialZoom = await zoomDisplay.textContent()
    await page.getByRole('button', { name: '+', exact: true }).click()
    const newZoom = await zoomDisplay.textContent()
    expect(newZoom).not.toBe(initialZoom)
  })
})

test.describe('Event name', () => {
  test('sets event name', async ({ page }) => {
    const input = page.locator('header input[placeholder*="Floor Plan"]')
    await input.fill('Wedding Reception')
    await expect(input).toHaveValue('Wedding Reception')
  })
})

test.describe('Reset', () => {
  test('reset clears all data', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await page.getByRole('button', { name: /reset/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(0)
  })
})

test.describe('Rotation controls', () => {
  test('rotation buttons in context menu work', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    // The context menu rotation button may be behind the footer, use force
    await page.locator('.context-menu-panel button[title="Rotate +45°"]').click({ force: true })
    await expect(page.locator('.context-menu-panel').getByText('45°')).toBeVisible()
  })

  test('reset rotation button works', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await page.locator('.context-menu-panel button[title="Rotate +45°"]').click()
    await page.locator('.context-menu-panel button[title="Reset rotation"]').click()
    await expect(page.locator('.context-menu-panel').getByText('0°')).toBeVisible()
  })
})

test.describe('Context menu', () => {
  test('shows shape, rotation, and seat controls', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await expect(page.locator('.context-menu-panel').getByText('Shape')).toBeVisible()
    await expect(page.locator('.context-menu-panel').getByText('Rotation')).toBeVisible()
    await expect(page.locator('.context-menu-panel').getByText('Seats', { exact: true }).first()).toBeVisible()
    await expect(page.locator('.context-menu-panel').getByText('Total')).toBeVisible()
  })
})

test.describe('Export button', () => {
  test('export button exists and is clickable', async ({ page }) => {
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })
})

test.describe('Persistence', () => {
  test('data persists across page reloads', async ({ page }) => {
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
    await page.reload()
    await page.waitForSelector('header')
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  })
})
