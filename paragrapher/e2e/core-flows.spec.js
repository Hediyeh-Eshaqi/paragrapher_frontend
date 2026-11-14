import { expect, test } from "@playwright/test";

const demoPassword = "ParagrapherDemo123!";

async function signIn(page, username = "nima_reader") {
  page.on("pageerror", (error) => console.error("Browser page error:", error));
  await page.goto("/");
  await page.getByLabel("نام کاربری").fill(username);
  await page.getByLabel("گذرواژه").fill(demoPassword);
  await page.getByRole("button", { name: /ورود به پاراگراف/ }).click();
  await expect(page.getByRole("heading", { name: "نقل‌قول امروز" })).toBeVisible();
}

async function createSellerListing(browser) {
  const context = await browser.newContext();
  const sellerPage = await context.newPage();
  const title = "کتاب نمایشی " + Date.now();
  await signIn(sellerPage, "sara_books");
  await sellerPage.getByRole("button", { name: "بازار کتاب", exact: true }).first().click();
  await sellerPage.locator(".compact-form select").selectOption("poetry-corner");
  await sellerPage.getByLabel("نام کتاب").fill(title);
  await sellerPage.getByLabel("نویسنده").fill("سارا");
  await sellerPage.getByLabel("قیمت به سکه").fill("35");
  await sellerPage.getByRole("button", { name: "ثبت آگهی" }).click();
  await expect(sellerPage.locator(".book-card").filter({ hasText: title })).toBeVisible();
  await context.close();
  return title;
}

test("reader can discover, join, quote, reply, purchase, chat, and read notifications", async ({ browser, page }) => {
  test.setTimeout(90_000);
  await signIn(page);
  await page.screenshot({ path: "public/screenshots/desktop.png" });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "نقل‌قول امروز" })).toBeVisible();
  await page.screenshot({ path: "public/screenshots/mobile.png" });
  await page.setViewportSize({ width: 1280, height: 720 });
  const newBookTitle = await createSellerListing(browser);

  await page.getByRole("button", { name: "جامعه‌ها", exact: true }).first().click();
  const poetryCard = page.locator(".community-card").filter({ hasText: "گوشه‌ی شعر" });
  await poetryCard.getByRole("button", { name: "عضو هستید" }).click();
  await expect(poetryCard.getByRole("button", { name: "پیوستن" })).toBeVisible();
  await poetryCard.getByRole("button", { name: "پیوستن" }).click();
  await expect(poetryCard.getByRole("button", { name: "عضو هستید" })).toBeVisible();

  await page.getByRole("button", { name: "نقل‌قول‌ها", exact: true }).first().click();
  const uniqueQuote = `جمله‌ی آزمایشی ${Date.now()}`;
  await page.locator(".quote-form select").selectOption("fantasy-shelf");
  await page.getByLabel("متن نقل‌قول").fill(uniqueQuote);
  await page.getByLabel("کتاب یا منبع").fill("دفتر آزمون");
  await page.getByRole("button", { name: "ثبت نقل‌قول" }).click();
  const quote = page.locator(".quote-card").filter({ hasText: uniqueQuote }).first();
  await expect(quote).toBeVisible();
  await quote.getByRole("button", { name: /پسندیدن نقل‌قول/ }).click();
  await quote.getByRole("button", { name: /پاسخ/ }).click();
  await quote.getByLabel("متن پاسخ").fill("این جمله را برای بعد نگه می‌دارم.");
  await quote.getByRole("button", { name: "ارسال پاسخ" }).click();
  await expect(quote.getByText("این جمله را برای بعد نگه می‌دارم.")).toBeVisible();

  await page.getByRole("button", { name: "بازار کتاب", exact: true }).first().click();
  await page.getByRole("button", { name: "افزودن سکه" }).click();
  const book = page.locator(".book-card").filter({ hasText: newBookTitle }).first();
  await book.getByRole("button", { name: "رزرو ۳۰ دقیقه‌ای" }).click();
  await book.getByRole("button", { name: "خرید کتاب" }).click();
  await expect(page.locator(".book-card").filter({ hasText: newBookTitle })).toHaveCount(0);

  await page.getByRole("button", { name: "گروه‌ها", exact: true }).first().click();
  await page.getByRole("button", { name: "گفت‌وگو", exact: true }).first().click();
  await expect(page.getByText("این هفته کدام کتاب را با هم شروع کنیم؟")).toBeVisible();
  await page.getByLabel("پیام گروه").fill("من این هفته آماده‌ام!");
  await page.getByRole("button", { name: "ارسال پیام" }).click();
  await expect(page.getByText("من این هفته آماده‌ام!")).toBeVisible();

  await page.getByRole("button", { name: "پیام‌ها", exact: true }).first().click();
  await page.getByLabel("پیام خصوصی").fill("پیام آزمایشی مستقیم");
  await page.getByRole("button", { name: "ارسال پیام" }).click();
  await expect(page.getByText("پیام آزمایشی مستقیم")).toBeVisible();

  await page.getByRole("button", { name: /اعلان‌ها/ }).first().click();
  await expect(page.getByText("کتاب هفته")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "خانه", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "نقل‌قول امروز" })).toBeVisible();
});

test("reader can search and post to a new community", async ({ page }) => {
  await signIn(page);
  await page.getByRole("button", { name: "جست‌وجو", exact: true }).first().click();
  await page.getByLabel("جست‌وجوی کتاب و نقل‌قول").fill("فانوس");
  await page.locator(".search-form").getByRole("button", { name: "جست‌وجو" }).click();
  await expect(page.getByText("نقشه‌ی فانوس‌ها").first()).toBeVisible();

  await page.getByRole("button", { name: "جامعه‌ها", exact: true }).first().click();
  await page.getByRole("button", { name: "ایجاد جامعه" }).click();
  const name = `جامعه‌ی خودکار ${Date.now()}`;
  await page.getByLabel("نام جامعه").fill(name);
  await page.getByLabel("موضوع جامعه").fill("کتاب‌های معمایی");
  await page.getByLabel("درباره‌ی جامعه").fill("برای خواندن و گفت‌وگو درباره‌ی داستان‌های معمایی.");
  await page.getByRole("button", { name: "ساخت جامعه" }).click();
  await expect(page.locator(".community-card").filter({ hasText: name })).toBeVisible();
});
