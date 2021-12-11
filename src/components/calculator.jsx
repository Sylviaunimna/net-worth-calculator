import React from "react";
import { PieChart } from "react-minimal-pie-chart";

class Calculator extends React.Component {
  state = {
    apiKey: "4b2ea96ceadc94e3995c",
    currency: "CAD",
    prev_currency: "CAD",
    defaultLabelStyle: {
      fontSize: "3px",
      fontFamily: "sans-serif",
      fill: "white"
    },
    cur_codes: {
      CAD: <span>&#36;</span>,
      USD: <span>&#36;</span>,
      NGN: <span>&#8358;</span>,
      EUR: <span>&euro;</span>,
      INR: <span>&#8377;</span>,
      GBP: <span>&pound;</span>,
      KRW: <span>&#8360;</span>,
      PHP: <span>&#8369;</span>,
      AED: <span>&#x62f;&#x2e;&#x625;</span>,
      JPY: <span>&#165;</span>
    },
    values: {
      chequing: "2,000.0",
      savings_for_taxes: "4,000.0",
      rainy_day_fund: "506.0",
      savings_for_fun: "5,000.0",
      savings_for_travel: "400.0",
      savings_for_personal_development: "200.0",
      investment_1: "5,000.0",
      investment_2: "60,000.0",
      investment_3: "24,000.0",
      primary_home: "455,000.0",
      second_home: "1,564,321.0",
      credit_card_1: "4,342.0",
      credit_card_2: "322.0",
      mortgage_1: "250,999.0",
      mortgage_2: "632,634.0",
      line_of_credit: "10,000.0",
      investment_loan: "10,000.0"
    },
    total_assets: "2,120,427.0",
    total_liabilities: "908,297.0",
    net_worth: "1,212,130.0"
  };

  convertCurrency = (fromCurrency, toCurrency) => {
    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    var query = fromCurrency + "_" + toCurrency;
    var url =
      "https://free.currconv.com/api/v7/convert?q=" +
      query +
      "&compact=ultra&apiKey=" +
      this.state.apiKey;

    fetch(url)
      .then(res => res.json())
      .then(result => {
        result = result[query];
        if (result) {
          let updated_values = {};
          for (const [key, value] of Object.entries(this.state.values)) {
            var total = parseFloat(value.replace(/[^\d.-]/g, "")) * result;
            total = Math.round((total + Number.EPSILON) * 100) / 100;
            total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            updated_values[key] = total;
          }
          this.setState({ values: updated_values, prev_currency: toCurrency });
          this.getTotalAssets();
          this.getTotalLiabilities();
          this.getNetWorth();
        } else {
          console.log("error");
        }
      });
  };

  getCurrency = e => {
    this.setState({ currency: e.target.value });
    this.convertCurrency(this.state.prev_currency, e.target.value);
  };

  getTotalAssets = () => {
    var total =
      parseFloat(this.state.values["chequing"].replace(/[^\d.-]/g, "")) +
      parseFloat(
        this.state.values["savings_for_taxes"].replace(/[^\d.-]/g, "")
      ) +
      parseFloat(this.state.values["rainy_day_fund"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["savings_for_fun"].replace(/[^\d.-]/g, "")) +
      parseFloat(
        this.state.values["savings_for_travel"].replace(/[^\d.-]/g, "")
      ) +
      parseFloat(
        this.state.values["savings_for_personal_development"].replace(
          /[^\d.-]/g,
          ""
        )
      ) +
      parseFloat(this.state.values["investment_1"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["investment_2"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["investment_3"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["primary_home"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["second_home"].replace(/[^\d.-]/g, ""));
    total = Math.round((total + Number.EPSILON) * 100) / 100;
    this.setState({ total_assetss: total });
    total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.setState({ total_assets: total });
  };

  getTotalLiabilities = () => {
    var total =
      parseFloat(this.state.values["credit_card_1"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["credit_card_2"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["mortgage_1"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["mortgage_2"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["line_of_credit"].replace(/[^\d.-]/g, "")) +
      parseFloat(this.state.values["investment_loan"].replace(/[^\d.-]/g, ""));
    total = Math.round((total + Number.EPSILON) * 100) / 100;
    this.setState({ total_liabilitiess: total });
    total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.setState({ total_liabilities: total });
  };

  getNetWorth = () => {
    var total =
      parseFloat(this.state.total_assets.replace(/[^\d.-]/g, "")) -
      parseFloat(this.state.total_liabilities.replace(/[^\d.-]/g, ""));
    total = Math.round((total + Number.EPSILON) * 100) / 100;
    this.setState({ net_worths: total });
    total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.setState({ net_worth: total });
  };

  render() {
    return (
      <div className="App">
        <div className="left">
          <h1 id="title">
            <span id="net" className="display-1">
              Net
            </span>
            <br></br>
            <span id="worth" className="display-2">
              Worth
            </span>
            <br></br>
            <span id="calc" className="display-3">
              Calculator
            </span>
          </h1>
          <br></br>
          <br></br>
          <table className="table">
            <tbody>
              <tr>
                <td className="blue">&nbsp;</td>
                <td>Total Assets:</td>
                <td>
                  <span>{this.state.cur_codes[this.state.currency]}</span>
                  {this.state.total_assets}
                </td>
              </tr>
              <tr>
                <td className="orange">&nbsp;</td>
                <td>Total Liabilities:</td>
                <td>
                  <span>{this.state.cur_codes[this.state.currency]}</span>
                  {this.state.total_liabilities}
                </td>
              </tr>
              <tr>
                <td className="green">&nbsp;</td>
                <td>Net Worth:</td>
                <td>
                  <span>{this.state.cur_codes[this.state.currency]}</span>
                  {this.state.net_worth}
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <PieChart
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)} %`}
            animation
            animationDuration={500}
            animationEasing="ease-out"
            center={[50, 50]}
            data={[
              {
                title: "Assets",
                value: parseFloat(
                  this.state.total_assets.replace(/[^\d.-]/g, "")
                ),
                color: "#0066CC"
              },
              {
                title: "Liabilities",
                value: parseFloat(
                  this.state.total_liabilities.replace(/[^\d.-]/g, "")
                ),
                color: "#FFA500"
              },
              {
                title: "Net Worth",
                value: parseFloat(this.state.net_worth.replace(/[^\d.-]/g, "")),
                color: "#008000"
              }
            ]}
            labelPosition={90}
            labelStyle={this.state.defaultLabelStyle}
            lengthAngle={360}
            lineWidth={25}
            paddingAngle={0}
            radius={50}
            startAngle={0}
            viewBoxSize={[120, 120]}
          />
          ;
        </div>
        <div className="right">
          <div id="currency-select">
            <label htmlFor="currencies">Currency: </label>
            <select
              id="currencies"
              name="currencies"
              className="form-select form-select-sm"
              aria-label=".form-select-sm example"
              onChange={this.getCurrency}
            >
              {Object.entries(this.state.cur_codes).map(([key, value]) => (
                <option value={key} key={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <br></br>
          <br></br>
          <h4>Assets</h4>
          <table className="table">
            <tbody>
              <tr>
                <th>Cash and Investments</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td>Chequing</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["chequing"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Savings for Taxes</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["savings_for_taxes"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Rainy Day Fund</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["rainy_day_fund"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Savings for Fun</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["savings_for_fun"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Savings for Travel</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["savings_for_travel"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Savings for Personal Development</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={
                        this.state.values["savings_for_personal_development"]
                      }
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Investment 1</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["investment_1"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Investment 2</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["investment_2"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Investment 3</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["investment_3"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Long Term Assets</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td>Primary Home</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["primary_home"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Second Home</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["second_home"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Other</td>
                <td></td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                    ></input>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <h4>Liabilities</h4>
          <table className="table">
            <tbody>
              <tr>
                <th>Short Term Liabilities</th>
                <th>Monthly Payment</th>
                <th></th>
              </tr>
              <tr>
                <td>Credit Card 1</td>
                <td>$ 200.00</td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["credit_card_1"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Credit Card 2</td>
                <td>$ 150.00</td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["credit_card_2"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <th>Long Term Debt</th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <td>Mortgage 1</td>
                <td>$ 2,000.00</td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["mortgage_1"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Mortage 2</td>
                <td>$ 3,500.00</td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["mortgage_2"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Line of Credit</td>
                <td>$ 500.00</td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["line_of_credit"]}
                    ></input>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Investment Loan</td>
                <td>$ 700.00</td>
                <td>
                  <div className="input-group input-group-sm">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      {this.state.cur_codes[this.state.currency]}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={this.state.values["investment_loan"]}
                    ></input>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Calculator;
