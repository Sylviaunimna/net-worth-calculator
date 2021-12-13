import React from "react";
import { PieChart } from "react-minimal-pie-chart";

class Calculator extends React.Component {
  state = {
    apiKey: "pr_d9d162758f53422fb6ee767d24c4dd00",
    currency: "CAD",
    prev_currency: "CAD",
    defaultLabelStyle: {
      fontSize: "3px",
      fontFamily: "sans-serif",
      fill: "white"
    },
    isEditing: false,
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
      chequing: 2000,
      savings_for_taxes: 4000.0,
      rainy_day_fund: 506.0,
      savings_for_fun: 5000.0,
      savings_for_travel: 400.0,
      savings_for_personal_development: 200.0,
      investment_1: 5000.0,
      investment_2: 60000.0,
      investment_3: 24000.0,
      primary_home: 455000.0,
      second_home: 1564321.0,
      other: 2000.0,
      credit_card_1: 4342.0,
      credit_card_2: 322.0,
      mortgage_1: 250999.0,
      mortgage_2: 632634.0,
      line_of_credit: 10000.0,
      investment_loan: 10000.0
    },
    total_assets: 2122427.0,
    total_liabilities: 908297.0,
    net_worth: 1214130.0
  };

  convertCurrency = async e => {
    //calls an external API to get the exchange rate and updates all the amounts
    var fromCurrency = encodeURIComponent(this.state.prev_currency);
    var toCurrency = encodeURIComponent(e.target.value);
    var query = fromCurrency + "_" + toCurrency;
    var url =
      "https://prepaid.currconv.com/api/v7/convert?q=" +
      query +
      "&compact=ultra&apiKey=" +
      this.state.apiKey;
    await fetch(url)
      .then(res => res.json())
      .then(result => {
        result = result[query];
        if (result) {
          let updated_values = {};
          for (const [key, value] of Object.entries(this.state.values)) {
            var total = parseFloat(value) * result;
            total = Math.round((total + Number.EPSILON) * 100) / 100;
            updated_values[key] = total;
          }
          var total_assets = parseFloat(this.state.total_assets) * result;
          total_assets =
            Math.round((total_assets + Number.EPSILON) * 100) / 100;
          var total_liabilities =
            parseFloat(this.state.total_liabilities) * result;
          total_liabilities =
            Math.round((total_liabilities + Number.EPSILON) * 100) / 100;
          var net_worth = parseFloat(this.state.net_worth) * result;
          net_worth = Math.round((net_worth + Number.EPSILON) * 100) / 100;
          this.setState({
            values: updated_values,
            currency: toCurrency,
            prev_currency: toCurrency,
            total_assets: total_assets,
            total_liabilities: total_liabilities,
            net_worth: net_worth
          });
        } else {
          console.log("error");
        }
      });
  };

  updateInputValue = async e => {
    //gets called when an amount is edited and calls the server to get the updated totals
    let values = this.state.values;
    values[e.target.name] = e.target.value === "" ? 0 : e.target.value;
    await this.setState({ values: values });
    fetch("/calculator/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(data => {
        this.setState({
          total_assets: data.total_assets,
          total_liabilities: data.total_liabilities,
          net_worth: data.net_worth
        });
      });
  };

  toggleEditing() {
    // used for formatting the input elements for the amount
    this.setState({ isEditing: !this.state.isEditing });
  }

  formatToCurrency(number) {
    // changes the format of the amount to currency format
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    return (
      <div className="App">
        <div className="left">
          <h1 id="title">
            <span id="net" className="display-1">
              Net
            </span>
            <br></br>
            <span id="worth" className="display-1">
              Worth
            </span>
            <br></br>
            <span id="calc" className="display-1">
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
                  {this.formatToCurrency(this.state.total_assets)}
                </td>
              </tr>
              <tr>
                <td className="orange">&nbsp;</td>
                <td>Total Liabilities:</td>
                <td>
                  <span>{this.state.cur_codes[this.state.currency]}</span>
                  {this.formatToCurrency(this.state.total_liabilities)}
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Net Worth:</td>
                <td>
                  <span>{this.state.cur_codes[this.state.currency]}</span>
                  {this.formatToCurrency(this.state.net_worth)}
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
                value: this.state.total_assets,
                color: "#0066CC"
              },
              {
                title: "Liabilities",
                value: this.state.total_liabilities,
                color: "#FFA500"
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
          }
        </div>
        <div className="right">
          <div id="currency-select">
            <label htmlFor="currencies">Currency: </label>
            <select
              id="currencies"
              name="currencies"
              className="form-select form-select-sm"
              aria-label=".form-select-sm example"
              onChange={this.convertCurrency}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="chequing"
                        value={this.state.values["chequing"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="chequing"
                        value={this.formatToCurrency(
                          this.state.values["chequing"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="savings_for_taxes"
                        value={this.state.values["savings_for_taxes"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="savings_for_taxes"
                        value={this.formatToCurrency(
                          this.state.values["savings_for_taxes"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="rainy_day_fund"
                        value={this.state.values["rainy_day_fund"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="rainy_day_fund"
                        value={this.formatToCurrency(
                          this.state.values["rainy_day_fund"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="savings_for_fun"
                        value={this.state.values["savings_for_fun"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="savings_for_fun"
                        value={this.formatToCurrency(
                          this.state.values["savings_for_fun"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="savings_for_travel"
                        value={this.state.values["savings_for_travel"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="savings_for_travel"
                        value={this.formatToCurrency(
                          this.state.values["savings_for_travel"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="savings_for_personal_development"
                        value={
                          this.state.values["savings_for_personal_development"]
                        }
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="savings_for_personal_development"
                        value={this.formatToCurrency(
                          this.state.values["savings_for_personal_development"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="investment_1"
                        value={this.state.values["investment_1"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="investment_1"
                        value={this.formatToCurrency(
                          this.state.values["investment_1"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="investment_2"
                        value={this.state.values["investment_2"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="investment_2"
                        value={this.formatToCurrency(
                          this.state.values["investment_2"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="investment_3"
                        value={this.state.values["investment_3"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="investment_3"
                        value={this.formatToCurrency(
                          this.state.values["investment_3"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="primary_home"
                        value={this.state.values["primary_home"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="primary_home"
                        value={this.formatToCurrency(
                          this.state.values["primary_home"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="second_home"
                        value={this.state.values["second_home"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="second_home"
                        value={this.formatToCurrency(
                          this.state.values["second_home"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="other"
                        value={this.state.values["other"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="other"
                        value={this.formatToCurrency(
                          this.state.values["other"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="credit_card_1"
                        value={this.state.values["credit_card_1"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="credit_card_1"
                        value={this.formatToCurrency(
                          this.state.values["credit_card_1"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="credit_card_2"
                        value={this.state.values["credit_card_2"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="credit_card_2"
                        value={this.formatToCurrency(
                          this.state.values["credit_card_2"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="mortgage_1"
                        value={this.state.values["mortgage_1"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="mortgage_1"
                        value={this.formatToCurrency(
                          this.state.values["mortgage_1"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="mortgage_2"
                        value={this.state.values["mortgage_2"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="mortgage_2"
                        value={this.formatToCurrency(
                          this.state.values["mortgage_2"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="line_of_credit"
                        value={this.state.values["line_of_credit"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="line_of_credit"
                        value={this.formatToCurrency(
                          this.state.values["line_of_credit"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
                    {this.state.isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="investment_loan"
                        value={this.state.values["investment_loan"]}
                        onChange={this.updateInputValue}
                        onBlur={this.toggleEditing.bind(this)}
                      ></input>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        name="investment_loan"
                        value={this.formatToCurrency(
                          this.state.values["investment_loan"]
                        )}
                        onFocus={this.toggleEditing.bind(this)}
                        readOnly
                      ></input>
                    )}
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
