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
          var net_worth = total_assets - total_liabilities;
          res.json({
            updated_values: new_values,
            newTotalAssets: total_assets,
            newTotalLiabilities: total_liabilities,
            newNetWorth: net_worth
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

function calculateTotalAssetsLiabilities(data) {
  var total_assets =
    Math.round(parseFloat(data.chequing)) +
    Math.round(parseFloat(data.savings_for_taxes)) +
    Math.round(parseFloat(data.rainy_day_fund)) +
    Math.round(parseFloat(data.savings_for_fun)) +
    Math.round(parseFloat(data.savings_for_travel)) +
    Math.round(parseFloat(data.savings_for_personal_development)) +
    Math.round(parseFloat(data.investment_1)) +
    Math.round(parseFloat(data.investment_2)) +
    Math.round(parseFloat(data.investment_3)) +
    Math.round(parseFloat(data.primary_home)) +
    Math.round(parseFloat(data.second_home)) +
    Math.round(parseFloat(data.other));
  var total_liabilities =
    Math.round(parseFloat(data.credit_card_1)) +
    Math.round(parseFloat(data.credit_card_2)) +
    Math.round(parseFloat(data.mortgage_1)) +
    Math.round(parseFloat(data.mortgage_2)) +
    Math.round(parseFloat(data.line_of_credit)) +
    Math.round(parseFloat(data.investment_loan));
  return { total_assets, total_liabilities };
}

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
