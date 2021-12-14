async function convert(fromCurrency, toCurrency) {
  fromCurrency = encodeURIComponent(fromCurrency);
  toCurrency = encodeURIComponent(toCurrency);
  var query = fromCurrency + "_" + toCurrency;
  var url =
    "https://prepaid.currconv.com/api/v7/convert?q=" +
    query +
    "&compact=ultra&apiKey=pr_d9d162758f53422fb6ee767d24c4dd00";
  const result = await fetch(url);
  try {
    const data = await result.json();
    const rate = data[query];
    return rate;
  } catch (e) {
    console.log(e);
    return e;
  }
}

export { convert };
