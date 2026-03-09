import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("app rendert zonder crash en toont de paginatitel", () => {
  render(<App />);
  expect(screen.getByText(/Verstuur Whatsapp bericht/i)).toBeInTheDocument();
});
