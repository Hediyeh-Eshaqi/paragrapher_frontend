import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthScreen } from "./App.jsx";

describe("sign-in view", () => {
  it("submits the entered credentials to the API handler", async () => {
    const onSignIn = vi.fn();
    render(<AuthScreen onSignIn={onSignIn} />);

    fireEvent.change(screen.getByLabelText("نام کاربری"), { target: { value: "nima_reader" } });
    fireEvent.change(screen.getByLabelText("گذرواژه"), { target: { value: "ParagrapherDemo123!" } });
    fireEvent.click(screen.getByRole("button", { name: /ورود به پاراگراف/ }));

    await waitFor(() => expect(onSignIn).toHaveBeenCalledWith({
      username: "nima_reader",
      email: "",
      display_name: "",
      password: "ParagrapherDemo123!",
    }, false));
  });

  it("shows validation feedback returned from the API", () => {
    render(<AuthScreen onSignIn={vi.fn()} error="گذرواژه نادرست است." />);
    expect(screen.getByRole("alert")).toHaveTextContent("گذرواژه نادرست است.");
  });
});
