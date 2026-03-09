import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Table from "./Table";

const testData = [
  ["Naam", "Stad"],
  ["Zebra", "Zwolle"],
  ["Appel", "Amsterdam"],
  ["Mango", "Maastricht"],
];

describe("Table", () => {
  it("toont headers", () => {
    render(<Table data={testData} />);
    expect(screen.getByText("Naam")).toBeInTheDocument();
    expect(screen.getByText("Stad")).toBeInTheDocument();
  });

  it("toont alle datarijen", () => {
    render(<Table data={testData} />);
    expect(screen.getByText("Zebra")).toBeInTheDocument();
    expect(screen.getByText("Appel")).toBeInTheDocument();
    expect(screen.getByText("Mango")).toBeInTheDocument();
  });

  it("toont bericht bij lege data", () => {
    render(<Table data={[]} />);
    expect(screen.getByText("Geen data beschikbaar.")).toBeInTheDocument();
  });

  it("sorteert oplopend bij eerste klik op header", async () => {
    render(<Table data={testData} />);
    await userEvent.click(screen.getByText(/Naam/));
    const cells = screen.getAllByRole("cell");
    // Eerste datacel moet 'Appel' zijn (alfabetisch eerste)
    expect(cells[0].textContent).toBe("Appel");
  });

  it("sorteert aflopend bij tweede klik op dezelfde header", async () => {
    render(<Table data={testData} />);
    await userEvent.click(screen.getByText(/Naam/));
    await userEvent.click(screen.getByText(/Naam/));
    const cells = screen.getAllByRole("cell");
    // Eerste datacel moet 'Zebra' zijn (alfabetisch laatste)
    expect(cells[0].textContent).toBe("Zebra");
  });

  it("toont sorteerpijl bij gesorteerde kolom", async () => {
    render(<Table data={testData} />);
    await userEvent.click(screen.getByText(/Naam/));
    expect(screen.getByText(/▲/)).toBeInTheDocument();
    await userEvent.click(screen.getByText(/Naam/));
    expect(screen.getByText(/▼/)).toBeInTheDocument();
  });
});
