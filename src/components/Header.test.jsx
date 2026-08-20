import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { Header } from "./Header";

describe("Header", () => {
  it("renders the mobile menu trigger as a single button", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(markup).not.toMatch(/data-slot="sheet-trigger"[^>]*><button/);
  });
});
