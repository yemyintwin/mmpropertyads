import { expect, test } from "@playwright/test";

test("home page renders the public property search entry point", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Find a place that feels like you." }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Search by listing type" })).toBeVisible();
  await expect(page.getByLabel("Property type")).toBeVisible();
  await expect(page.getByRole("link", { name: "Post an ad" })).toBeVisible();
});

test("search page preserves filters in the URL and reports unavailable API", async ({
  page,
}) => {
  await page.goto("/search?area=Bahan&beds=2");

  await expect(page.getByRole("heading", { name: "Find a home" })).toBeVisible();
  await expect(page.getByLabel("Location")).toHaveValue("Bahan");
  await expect(page.getByText("Listings are unavailable")).toBeVisible();
});

test("private auth form is rendered without indexing", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByLabel("Email address")).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("registration remains blocked until bot protection is integrated", async ({
  page,
}) => {
  await page.goto("/register");

  await expect(
    page.getByRole("heading", { name: "Create your account" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeDisabled();
  await expect(
    page.getByText("Registration is disabled until the required CAPTCHA verification is integrated."),
  ).toBeVisible();
});
