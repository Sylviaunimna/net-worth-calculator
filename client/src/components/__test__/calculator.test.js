import React from "react";
import ReactDOM from "react-dom";
import Calculator from "../calculator";
import renderer from "react-test-renderer";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Calculator></Calculator>, div);
});

// test("State testing", () => {
//   let component = renderer.create(<Calculator></Calculator>).getInstance();
//   component.getNetWorth();
//   expect(component.state.net_worth).toBe("1,212,130");
// });

test("State testing 2", () => {
  const calc = new Calculator();
  calc.convertCurrency("CAD", "USD");
  // let component = renderer.create(<Calculator></Calculator>).getInstance();
  // component.convertCurrency("CAD", "NGN");
  // expect(calc.state.values["chequing"]).toBe("1571.03");
});
