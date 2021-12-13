const express = require("express"),
  app = express();
const bodyParser = require("body-parser");
const router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3001;
app.use("/", router);
router.get("/", function(req, res) {
  res.json({ hello: ["Sylvia"] });
});

router.post("/calculator", (req, res) => {
  let body = req.body;
  var data = body.values;
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
  total_assets = Math.round((total_assets + Number.EPSILON) * 100) / 100;
  var total_liabilities =
    parseFloat(data.credit_card_1) +
    parseFloat(data.credit_card_2) +
    parseFloat(data.mortgage_1) +
    parseFloat(data.mortgage_2) +
    parseFloat(data.line_of_credit) +
    parseFloat(data.investment_loan);
  total_liabilities =
    Math.round((total_liabilities + Number.EPSILON) * 100) / 100;
  var net_worth = total_assets - total_liabilities;
  net_worth = Math.round((net_worth + Number.EPSILON) * 100) / 100;
  res.json({
    total_assets: total_assets,
    total_liabilities: total_liabilities,
    net_worth: net_worth
  });
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
