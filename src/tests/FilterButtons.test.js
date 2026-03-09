import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterButtons } from "../components/FilterButtons";

describe("FilterButtons", () => {
  it("toont alle drie filteropties", () => {
    render(<FilterButtons filter="all" setFilter={() => {}} />);
    expect(screen.getByText("Alle")).toBeInTheDocument();
    expect(screen.getByText("Alleen sjablonen")).toBeInTheDocument();
    expect(screen.getByText("Alleen losse orders")).toBeInTheDocument();
  });

  it("roept setFilter aan met 'templates' bij klik op Alleen sjablonen", async () => {
    const setFilter = jest.fn();
    render(<FilterButtons filter="all" setFilter={setFilter} />);
    await userEvent.click(screen.getByText("Alleen sjablonen"));
    expect(setFilter).toHaveBeenCalledWith("templates");
  });

  it("roept setFilter aan met 'orders' bij klik op Alleen losse orders", async () => {
    const setFilter = jest.fn();
    render(<FilterButtons filter="all" setFilter={setFilter} />);
    await userEvent.click(screen.getByText("Alleen losse orders"));
    expect(setFilter).toHaveBeenCalledWith("orders");
  });

  it("roept setFilter aan met 'all' bij klik op Alle", async () => {
    const setFilter = jest.fn();
    render(<FilterButtons filter="templates" setFilter={setFilter} />);
    await userEvent.click(screen.getByText("Alle"));
    expect(setFilter).toHaveBeenCalledWith("all");
  });
});
