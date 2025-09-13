/**
 * Simple currency util.
 * For hackathon MVP we keep an in-memory rates object relative to BASE_CURRENCY.
 * You can replace fetchRates() to pull from an external API later.
 */

const fetch = require('node-fetch');

const BASE = process.env.BASE_CURRENCY || 'USD';

// Basic seeded rates (1 BASE to other)
let rates = {
  USD: 1,
  INR: 83.0,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67
};

async function updateRatesFromAPI() {
  // OPTIONAL: Attempt to fetch from free API exchangerate.host
  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${BASE}`);
    
    if (!res.ok) return;
    
    const data = await res.json();
    rates = { ...data.rates, [BASE]: 1 };
    
    console.log('Rates updated from exchangerate.host');
  } catch (err) {
    console.warn('Could not fetch live rates, using local rates');
  }
}

function getRates() {
  return rates;
}

function convert(amount, fromCurrency, toCurrency) {
  fromCurrency = fromCurrency.toUpperCase();
  toCurrency = toCurrency.toUpperCase();
  
  if (fromCurrency === toCurrency) return Number(amount);
  
  // Convert from 'fromCurrency' to base, then to 'toCurrency'
  const rateFrom = rates[fromCurrency];
  const rateTo = rates[toCurrency];
  
  if (!rateFrom || !rateTo) {
    throw new Error('Unsupported currency code');
  }
  
  // amount in base = amount / rateFrom
  const amountInBase = Number(amount) / rateFrom;
  const converted = amountInBase * rateTo;
  
  return Number(converted);
}

function toBase(amount, fromCurrency) {
  return convert(amount, fromCurrency, BASE);
}

function fromBase(amountBase, toCurrency) {
  return convert(amountBase, BASE, toCurrency);
}

module.exports = {
  BASE,
  rates,
  getRates,
  convert,
  toBase,
  fromBase,
  updateRatesFromAPI
};