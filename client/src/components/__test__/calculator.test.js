import React from "react";
import ReactDOM from "react-dom";
import Calculator from "../calculator";
import { convert } from "../utils/currency";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Calculator></Calculator>, div);
});

// This test will only pass if youvalidate the values with the API first
// it("convert correctly", async () => {
//   const rates = await convert(
//     "USD",
//     "CAD",
//     "pr_d9d162758f53422fb6ee767d24c4dd00"
//   );

//   expect(rates).toEqual(1.28165); // May change intermitently
// });

it("convert correctly", async () => {
  fetch.mockResponseOnce(JSON.stringify({ USD_CAD: 1.281851 }));
  const rates = await convert("USD", "CAD");
  expect(rates).toEqual(1.281851);
  expect(fetch).toHaveBeenCalledWith(
    "https://prepaid.currconv.com/api/v7/convert?q=USD_CAD&compact=ultra&apiKey=pr_d9d162758f53422fb6ee767d24c4dd00"
  );
});
