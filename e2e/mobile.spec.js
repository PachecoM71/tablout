import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForSelector('header')
})

test.describe('Mobile layout', () => {
  test('shows bottom tab bar with Floor and Guests tabs', async ({ page }) => {
    await expect(page.locator('nav').getByText('Floor')).toBeVisible()
    await expect(page.locator('nav').getByText('Guests')).toBeVisible()
  })

  test('does not show desktop-width sidebar', async ({ page }) => {
    // On mobile, there should be no fixed 260px sidebar visible
    const aside = page.locator('aside')
    // The aside exists in the guests panel but should be full-width, not 260px
    const box = await aside.boundingBox()
    if (box) {
      // If visible, it should be full-width (mobile), not 260px (desktop)
      expect(box.width).toBeGreaterThan(300)
    }
  })

  test('shows compact mobile toolbar', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
    // Mobile toolbar has overflow menu button (three dots)
    await expect(header.locator('button').filter({ has: page.locator('svg') })).toBeTruthy()
  })

  test('shows floor canvas by default', async ({ page }) => {
    await expect(page.locator('.blueprint-grid')).toBeVisible()
  })

  test('switches to Guests panel when Guests tab tapped', async ({ page }) => {
    await page.locator('nav').getByText('Guests').click()
    await expect(page.locator('aside')).toBeVisible()
  })

  test('switches back to Floor when Floor tab tapped', async ({ page }) => {
    await page.locator('nav').getByText('Guests').click()
    await expect(page.locator('aside')).toBeVisible()
    await page.locator('nav').getByText('Floor').click()
    await expect(page.locator('.blueprint-grid')).toBeVisible()
  })

  test('hides desktop footer on mobile', async ({ page }) => {
    await expect(page.locator('footer')).not.toBeVisible()
  })
})

test.describe('Mobile toolbar', () => {
  test('shape picker dropdown works', async ({ page }) => {
    // The add-table button should have a shape icon + plus icon
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    // Shape picker dropdown should appear
    const dropdown = page.locator('header .absolute.right-0')
    await expect(dropdown).toBeVisible()
    await expect(dropdown.getByText('Add Table')).toBeVisible()
  })

  test('can add a table from mobile toolbar', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  })

  test('overflow menu shows auto-seat, export, reset', async ({ page }) => {
    // Click the three-dots menu (last button group in header)
    await page.locator('header button').filter({ hasText: '' }).last().click()
    await expect(page.getByText('Auto Seat')).toBeVisible()
    await expect(page.getByText('Export PNG')).toBeVisible()
    await expect(page.getByText('Reset All')).toBeVisible()
  })

  test('reset from overflow menu clears tables', async ({ page }) => {
    // Add a table first
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
    // Open overflow menu and reset
    await page.locator('header button').filter({ hasText: '' }).last().click()
    await page.getByText('Reset All').click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(0)
  })
})

test.describe('Mobile guest management', () => {
  test('can add guests from Guests panel', async ({ page }) => {
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await expect(page.locator('aside').getByText('Alice')).toBeVisible()
  })

  test('auto-seat from overflow menu works', async ({ page }) => {
    // Add a table
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    // Add guests
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await input.fill('Bob')
    await input.press('Enter')
    // Switch to floor and auto-seat
    await page.locator('nav').getByText('Floor').click()
    await page.locator('header button').filter({ hasText: '' }).last().click()
    await page.getByText('Auto Seat').click()
    await page.waitForTimeout(300)
    const seatTexts = await page.locator('[data-table-wrapper] [data-seat-id]').allTextContents()
    const nonEmpty = seatTexts.filter(t => t.trim().length > 0)
    expect(nonEmpty.length).toBeGreaterThanOrEqual(2)
  })
})

test.describe('Mobile tap-to-assign', () => {
  test('guest strip shows unassigned guests on floor view', async ({ page }) => {
    // Add a table
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    // Add a guest
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    // Go back to floor — guest strip should show Alice
    await page.locator('nav').getByText('Floor').click()
    await expect(page.locator('.blueprint-grid').locator('..').getByText('Alice')).toBeVisible()
  })

  test('tapping guest in strip highlights them', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await page.locator('nav').getByText('Floor').click()
    // Tap Alice in the guest strip
    const guestStrip = page.locator('main')
    await guestStrip.getByText('Alice').click()
    // Should show instruction banner
    await expect(page.getByText('Tap an empty seat to assign')).toBeVisible()
  })

  test('tapping empty seat after selecting guest assigns them', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await page.locator('nav').getByText('Floor').click()
    // Tap Alice in guest strip
    const mainArea = page.locator('main')
    await mainArea.getByText('Alice').click()
    // Tap first empty seat
    const emptySeat = page.locator('[data-seat-id]').first()
    await emptySeat.click({ force: true })
    await page.waitForTimeout(300)
    // Alice should now appear on a seat, not in the guest strip
    const seatTexts = await page.locator('[data-table-wrapper] [data-seat-id]').allTextContents()
    const hasAlice = seatTexts.some(t => t.includes('Alice'))
    expect(hasAlice).toBe(true)
  })

  test('guest strip disappears when all guests are seated', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    // Auto-seat
    await page.locator('nav').getByText('Floor').click()
    await page.locator('header button').filter({ hasText: '' }).last().click()
    await page.getByText('Auto Seat').click()
    await page.waitForTimeout(300)
    // Guest strip should be gone
    await expect(page.getByText('Tap an empty seat')).not.toBeVisible()
  })

  test('cancel button clears guest selection', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('nav').getByText('Guests').click()
    const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
    await input.fill('Alice')
    await input.press('Enter')
    await page.locator('nav').getByText('Floor').click()
    await page.locator('main').getByText('Alice').click()
    await expect(page.getByText('Tap an empty seat')).toBeVisible()
    // Click cancel
    await page.locator('main').getByText('✕').click()
    await expect(page.getByText('Tap an empty seat')).not.toBeVisible()
  })
})

test.describe('Mobile canvas interaction', () => {
  test('canvas supports single-finger pan without losing tables', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
    // Simulate a pan gesture on the canvas background
    const canvas = page.locator('.blueprint-grid')
    const box = await canvas.boundingBox()
    // Start from far corner (likely empty space)
    const startX = box.x + box.width - 20
    const startY = box.y + 20
    await page.mouse.move(startX, startY)
    await page.mouse.down()
    await page.mouse.move(startX - 100, startY + 50, { steps: 5 })
    await page.mouse.up()
    // Table should still exist
    await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  })

  test('selecting a table shows context menu on mobile', async ({ page }) => {
    const addBtn = page.locator('header .relative button').first()
    await addBtn.click()
    await page.getByRole('button', { name: /add table/i }).click()
    await page.locator('[data-table-wrapper]').first().click()
    await expect(page.locator('.context-menu-panel')).toBeVisible()
  })
})
