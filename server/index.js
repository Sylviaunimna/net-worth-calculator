const express = require("express"),
  app = express();
const bodyParser = require("body-parser");
const https = require("https");
const router = express.Router();
const apiKey = "pr_d9d162758f53422fb6ee767d24c4dd00";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001;
app.use("/", router);
router.get("/hello", function(req, res) {
  res.json({ hello: ["Sylvia"] });
});

router.post("/calculator", (req, res) => {
  let body = req.body;
  var data = body.values;
  var { total_assets, total_liabilities } = calculateTotalAssetsLiabilities(
    data
  );
  total_assets = Math.round((total_assets + Number.EPSILON) * 100) / 100;
  total_liabilities =
    Math.round((total_liabilities + Number.EPSILON) * 100) / 100;
  var net_worth = total_assets - total_liabilities;
  net_worth = net_worth.toFixed(2);
  res.json({
    total_assets: total_assets,
    total_liabilities: total_liabilities,
    net_worth: net_worth
  });
});

router.post("/convert-currency", (req, res) => {
  var body = req.body;
  var fromCurrency = body.fromCurrency;
  var toCurrency = body.toCurrency;
  var values = body.values;
  var query = fromCurrency + "_" + toCurrency;
  var new_values = {};
  var url =
    "https://prepaid.currconv.com/api/v7/convert?q=" +
    query +
    "&compact=ultra&apiKey=" +
    apiKey;
  https.get(url, function(response) {
    var body = "";
    response.on("data", function(chunk) {
      body += chunk;
    });
    response.on("end", function() {
      try {
        var jsonObj = JSON.parse(body);
        var rate = jsonObj[query];
        if (rate) {
          for (const [key, value] of Object.entries(values)) {
            var total = value * rate;
            new_values[key] = total;
          }
          var {
            total_assets,
            total_liabilities
          } = calculateTotalAssetsLiabilities(new_values);
          total_assets = Math.round(total_assets);

          total_liabilities = Math.round(total_liabilities);
          var net_worth = total_assets - total_liabilities;
          var newTotalAssets = total_assets;
          var newTotalLiabilities = total_liabilities;
          var newNetWorth = net_worth;
          res.json({
            updated_values: new_values,
            newTotalAssets: newTotalAssets,
            newTotalLiabilities: newTotalLiabilities,
            newNetWorth: newNetWorth
          });
        } else {
          console.log("error");
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
});

router.post("/convert-cur", (req, res) => {
  var body = req.body;
  var fromCurrency = body.fromCurrency;
  var toCurrency = body.toCurrency;
  var cashInvestments = body.cashInvestments;
  var longTermAssets = body.longTermAssets;
  var shortTerm = body.shortTerm;
  var longTermDebt = body.longTermDebt;
  var totalAssets = body.totalAssets;
  var totalLiabilities = body.totalLiabilities;
  var networth = body.networth;
  var query = fromCurrency + "_" + toCurrency;
  var url =
    "https://prepaid.currconv.com/api/v7/convert?q=" +
    query +
    "&compact=ultra&apiKey=" +
    apiKey;
  https.get(url, function(response) {
    var body = "";
    response.on("data", function(chunk) {
      body += chunk;
    });
    response.on("end", function() {
      try {
        var jsonObj = JSON.parse(body);
        var rate = jsonObj[query];
        if (rate) {
          cash_investments = calculateConversion(cashInvestments, rate);
          long_term_assets = calculateConversion(longTermAssets, rate);
          short_term = calculateConversion(shortTerm, rate);
          long_term_debt = calculateConversion(longTermDebt, rate);
          var total_assets = calculateConversionTotals(totalAssets, rate);
          var total_liabilities = calculateConversionTotals(
            totalLiabilities,
            rate
          );
          var net_worth = calculateConversionTotals(networth, rate);
          res.json({
            cash_investments: cash_investments,
            long_term_assets: long_term_assets,
            short_term: short_term,
            long_term_debt: long_term_debt,
            total_assets: total_assets,
            total_liabilities: total_liabilities,
            net_worth: net_worth
          });
        } else {
          console.log("error");
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
});

function calculateConversion(dict, rate) {
  for (const [key, value] of Object.entries(dict)) {
    total = value.value * rate;
    value.value = total;
  }
  return dict;
}

function calculateConversionTotals(total, rate) {
  new_total = (total.value * rate).toFixed(2);
  total.value = new_total;
  return total;
}

function calculateTotalAssetsLiabilities(data) {
  var total_assets =
    parseFloat(data.chequing) +
    parseFloat(data.savings_for_taxes) +
    parseFloat(data.rainy_day_fund) +
    parseFloat(data.savings_for_fun) +
    parseFloat(data.savings_for_travel) +
    parseFloat(data.savings_for_personal_development) +
    parseFloat(data.investment_1) +
    parseFloat(data.investment_2) +
    parseFloat(data.investment_3) +
    parseFloat(data.primary_home) +
    parseFloat(data.second_home) +
    parseFloat(data.other);
  var total_liabilities =
    parseFloat(data.credit_card_1) +
    parseFloat(data.credit_card_2) +
    parseFloat(data.mortgage_1) +
    parseFloat(data.mortgage_2) +
    parseFloat(data.line_of_credit) +
    parseFloat(data.investment_loan);
  return { total_assets, total_liabilities };
}

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
