# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seating-planner.spec.js >> Rotation controls >> reset rotation button works
- Location: e2e/seating-planner.spec.js:155:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.context-menu-panel button[title="Reset rotation"]')
    - locator resolved to <button title="Reset rotation" class="font-mono text-[9px] text-[#3A3A38]/35 hover:text-[#FF8C69] transition-colors">Reset</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <footer class="absolute bottom-0 left-0 right-0 h-7 border-t border-[#3A3A38]/10 px-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-[#3A3A38]/40 shrink-0 bg-[#F5F4F0] z-10">…</footer> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <footer class="absolute bottom-0 left-0 right-0 h-7 border-t border-[#3A3A38]/10 px-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-[#3A3A38]/40 shrink-0 bg-[#F5F4F0] z-10">…</footer> intercepts pointer events
    - retrying click action
      - waiting 100ms
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <footer class="absolute bottom-0 left-0 right-0 h-7 border-t border-[#3A3A38]/10 px-4 flex items-center justify-between font-mono text-[9px] tracking-wider text-[#3A3A38]/40 shrink-0 bg-[#F5F4F0] z-10">…</footer> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - img [ref=e8]
        - textbox "Untitled Floor Plan" [ref=e13]
      - generic [ref=e14]:
        - button "Round" [ref=e15] [cursor=pointer]:
          - img [ref=e16]
        - button "Rect" [ref=e26] [cursor=pointer]:
          - img [ref=e27]
        - button "Square" [ref=e35] [cursor=pointer]:
          - img [ref=e36]
        - button "Oval" [ref=e44] [cursor=pointer]:
          - img [ref=e45]
        - button "U-Shape" [ref=e53] [cursor=pointer]:
          - img [ref=e54]
        - button "L-Shape" [ref=e65] [cursor=pointer]:
          - img [ref=e66]
        - button "Banquet" [ref=e72] [cursor=pointer]:
          - img [ref=e73]
      - button "+ Add Table" [ref=e83]
    - generic [ref=e84]:
      - generic [ref=e85]:
        - button "−" [ref=e86]
        - generic [ref=e87]: 100%
        - button "+" [ref=e88]
      - button "Auto Seat" [ref=e89]
      - button "Export" [ref=e90]:
        - img [ref=e91]
        - text: Export
      - button "Reset" [ref=e94]
  - generic [ref=e95]:
    - complementary [ref=e97]:
      - generic [ref=e98]:
        - generic [ref=e99]:
          - heading "Live Project Status" [level=2] [ref=e100]
          - generic [ref=e101]:
            - generic [ref=e102]:
              - generic [ref=e103]: TOTAL_CAPACITY
              - generic [ref=e104]: 8 UNITS
            - generic [ref=e105]:
              - generic [ref=e106]: ALLOCATED
              - generic [ref=e107]: 0 UNITS
            - generic [ref=e108]:
              - generic [ref=e109]: TABLES
              - generic [ref=e110]: "1"
        - generic [ref=e111]:
          - heading "Registry Entry" [level=2] [ref=e112]
          - generic [ref=e113]:
            - generic [ref=e114]:
              - textbox "GUEST FULL NAME..." [ref=e115]
              - button [disabled] [ref=e116]:
                - img [ref=e117]
            - button "Friends" [ref=e119]:
              - text: Friends
              - img [ref=e121]
        - generic [ref=e123]:
          - heading "Guest Index" [level=2] [ref=e124]
          - generic [ref=e126]:
            - generic [ref=e127]: 👋
            - paragraph [ref=e128]:
              - text: ADD GUESTS ABOVE
              - text: DRAG TO SEATS
    - main [ref=e129]:
      - generic [ref=e132]:
        - generic [ref=e134]:
          - generic [ref=e135]:
            - generic [ref=e136]: TABLE-1
            - generic [ref=e137]: Round // 1.9M
          - img [ref=e141] [cursor=pointer]
          - img [ref=e146] [cursor=pointer]
          - img [ref=e151] [cursor=pointer]
          - img [ref=e156] [cursor=pointer]
          - img [ref=e161] [cursor=pointer]
          - img [ref=e166] [cursor=pointer]
          - img [ref=e171] [cursor=pointer]
          - img [ref=e176] [cursor=pointer]
        - button "×" [ref=e178]
        - button "Duplicate table" [ref=e179]:
          - img [ref=e180]
        - img [ref=e189]
        - generic [ref=e193]: 45°
        - generic [ref=e195]:
          - button "Table 1" [ref=e197]:
            - img [ref=e198]
            - generic [ref=e201]: Table 1
          - generic [ref=e202]:
            - generic [ref=e203]: Shape
            - generic [ref=e204]:
              - button "Round" [ref=e205]:
                - img [ref=e206]
              - button "Rect" [ref=e216]:
                - img [ref=e217]
              - button "Square" [ref=e225]:
                - img [ref=e226]
              - button "Oval" [ref=e234]:
                - img [ref=e235]
              - button "U-Shape" [ref=e243]:
                - img [ref=e244]
              - button "L-Shape" [ref=e255]:
                - img [ref=e256]
              - button "Banquet" [ref=e262]:
                - img [ref=e263]
          - generic [ref=e273]:
            - generic [ref=e274]: Rotation
            - generic [ref=e275]:
              - button "Rotate -45°" [ref=e276]:
                - img [ref=e277]
              - generic [ref=e280]: 45°
              - button "Rotate +45°" [active] [ref=e281]:
                - img [ref=e282]
              - button "Reset" [ref=e285]
          - generic [ref=e286]:
            - generic [ref=e287]: Seats
            - generic [ref=e289]:
              - generic [ref=e290]: Seats
              - generic [ref=e291]:
                - button [ref=e292]:
                  - img [ref=e293]
                - generic [ref=e294]: "8"
                - button [ref=e295]:
                  - img [ref=e296]
          - generic [ref=e297]:
            - generic [ref=e298]: Total
            - generic [ref=e299]: 8 seats
      - generic [ref=e300]:
        - generic [ref=e301]:
          - generic [ref=e304]: "ENGINE_STATUS: STABLE"
          - generic [ref=e305]: "TABLES: 1"
          - generic [ref=e306]: "VIEW: ORTHOGRAPHIC"
        - generic [ref=e308]: ⌘+SCROLL ZOOM · ALT+DRAG PAN · DEL REMOVE · DRAG CORNERS TO RESIZE
```

# Test source

```ts
  59  |   })
  60  | })
  61  | 
  62  | test.describe('Shape switching', () => {
  63  |   test('switches shape via toolbar segmented control', async ({ page }) => {
  64  |     const shapeButtons = page.locator('.segmented-btn')
  65  |     await shapeButtons.nth(1).click() // Rectangle
  66  |     await page.getByRole('button', { name: /add table/i }).click()
  67  |     await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  68  |   })
  69  | 
  70  |   test('changes table shape via context menu', async ({ page }) => {
  71  |     await page.getByRole('button', { name: /add table/i }).click()
  72  |     await page.locator('[data-table-wrapper]').first().click()
  73  |     await page.locator('.context-menu-panel button[title="Rect"]').click()
  74  |     await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  75  |   })
  76  | })
  77  | 
  78  | test.describe('Guest management', () => {
  79  |   test('adds a guest from sidebar', async ({ page }) => {
  80  |     const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
  81  |     await input.fill('Alice')
  82  |     await input.press('Enter')
  83  |     await expect(page.locator('aside').getByText('Alice')).toBeVisible()
  84  |   })
  85  | 
  86  |   test('adds multiple guests', async ({ page }) => {
  87  |     const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
  88  |     await input.fill('Alice')
  89  |     await input.press('Enter')
  90  |     await input.fill('Bob')
  91  |     await input.press('Enter')
  92  |     await input.fill('Charlie')
  93  |     await input.press('Enter')
  94  |     await expect(page.locator('aside').getByText('Alice')).toBeVisible()
  95  |     await expect(page.locator('aside').getByText('Bob')).toBeVisible()
  96  |     await expect(page.locator('aside').getByText('Charlie')).toBeVisible()
  97  |   })
  98  | })
  99  | 
  100 | test.describe('Auto-seat', () => {
  101 |   test('auto-seats guests into available tables', async ({ page }) => {
  102 |     await page.getByRole('button', { name: /add table/i }).click()
  103 |     const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
  104 |     await input.fill('Alice')
  105 |     await input.press('Enter')
  106 |     await input.fill('Bob')
  107 |     await input.press('Enter')
  108 |     await page.getByRole('button', { name: /auto seat/i }).click()
  109 |     await page.waitForTimeout(300)
  110 |     // Seated guests show on seats — check that seat elements have text
  111 |     const seatTexts = await page.locator('[data-table-wrapper] [data-seat-id]').allTextContents()
  112 |     const nonEmpty = seatTexts.filter(t => t.trim().length > 0)
  113 |     expect(nonEmpty.length).toBeGreaterThanOrEqual(2)
  114 |   })
  115 | })
  116 | 
  117 | test.describe('Zoom controls', () => {
  118 |   test('zoom in and out buttons work', async ({ page }) => {
  119 |     const zoomDisplay = page.locator('header').getByText('%')
  120 |     const initialZoom = await zoomDisplay.textContent()
  121 |     await page.getByRole('button', { name: '+', exact: true }).click()
  122 |     const newZoom = await zoomDisplay.textContent()
  123 |     expect(newZoom).not.toBe(initialZoom)
  124 |   })
  125 | })
  126 | 
  127 | test.describe('Event name', () => {
  128 |   test('sets event name', async ({ page }) => {
  129 |     const input = page.locator('header input[placeholder*="Floor Plan"]')
  130 |     await input.fill('Wedding Reception')
  131 |     await expect(input).toHaveValue('Wedding Reception')
  132 |   })
  133 | })
  134 | 
  135 | test.describe('Reset', () => {
  136 |   test('reset clears all data', async ({ page }) => {
  137 |     await page.getByRole('button', { name: /add table/i }).click()
  138 |     const input = page.locator('aside input[placeholder="GUEST FULL NAME..."]')
  139 |     await input.fill('Alice')
  140 |     await input.press('Enter')
  141 |     await page.getByRole('button', { name: /reset/i }).click()
  142 |     await expect(page.locator('[data-table-wrapper]')).toHaveCount(0)
  143 |   })
  144 | })
  145 | 
  146 | test.describe('Rotation controls', () => {
  147 |   test('rotation buttons in context menu work', async ({ page }) => {
  148 |     await page.getByRole('button', { name: /add table/i }).click()
  149 |     await page.locator('[data-table-wrapper]').first().click()
  150 |     // The context menu rotation button may be behind the footer, use force
  151 |     await page.locator('.context-menu-panel button[title="Rotate +45°"]').click({ force: true })
  152 |     await expect(page.locator('.context-menu-panel').getByText('45°')).toBeVisible()
  153 |   })
  154 | 
  155 |   test('reset rotation button works', async ({ page }) => {
  156 |     await page.getByRole('button', { name: /add table/i }).click()
  157 |     await page.locator('[data-table-wrapper]').first().click()
  158 |     await page.locator('.context-menu-panel button[title="Rotate +45°"]').click()
> 159 |     await page.locator('.context-menu-panel button[title="Reset rotation"]').click()
      |                                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  160 |     await expect(page.locator('.context-menu-panel').getByText('0°')).toBeVisible()
  161 |   })
  162 | })
  163 | 
  164 | test.describe('Context menu', () => {
  165 |   test('shows shape, rotation, and seat controls', async ({ page }) => {
  166 |     await page.getByRole('button', { name: /add table/i }).click()
  167 |     await page.locator('[data-table-wrapper]').first().click()
  168 |     await expect(page.locator('.context-menu-panel').getByText('Shape')).toBeVisible()
  169 |     await expect(page.locator('.context-menu-panel').getByText('Rotation')).toBeVisible()
  170 |     await expect(page.locator('.context-menu-panel').getByText('Seats', { exact: true }).first()).toBeVisible()
  171 |     await expect(page.locator('.context-menu-panel').getByText('Total')).toBeVisible()
  172 |   })
  173 | })
  174 | 
  175 | test.describe('Export button', () => {
  176 |   test('export button exists and is clickable', async ({ page }) => {
  177 |     await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  178 |   })
  179 | })
  180 | 
  181 | test.describe('Persistence', () => {
  182 |   test('data persists across page reloads', async ({ page }) => {
  183 |     await page.getByRole('button', { name: /add table/i }).click()
  184 |     await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  185 |     await page.reload()
  186 |     await page.waitForSelector('header')
  187 |     await expect(page.locator('[data-table-wrapper]')).toHaveCount(1)
  188 |   })
  189 | })
  190 | 
```