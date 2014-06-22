var conversions = {
  "£": 1,
  "$": 0.59
};
var usdToGbp = 0.59;
var listOfSalaries;
var DATA = listOfSalaries = [
  [ "Nurse", c('£',22000), "http://www.prospects.ac.uk/adult_nurse_salary.htm" ],
  [ "Trader", c('£',1e5), "http://www.prospects.ac.uk/financial_trader_salary.htm" ],
  [ "Air travel assistants", c('£',22354), "http://www.thisismoney.co.uk/money/article-2269520/Best-paid-jobs-2012-Official-figures-national-average-UK-salaries-400-occupations.html" ],
  [ "Midwife", c('£',30000), "http://www.prospects.ac.uk/midwife_salary.htm" ],
  [ "Civil engineers", c('£',39236), "http://www.thisismoney.co.uk/money/article-2269520/Best-paid-jobs-2012-Official-figures-national-average-UK-salaries-400-occupations.html" ],
  [ "Physical scientists", c('£',49333), "http://www.thisismoney.co.uk/money/article-2269520/Best-paid-jobs-2012-Official-figures-national-average-UK-salaries-400-occupations.html" ],
  [ "Vicky Pryce - ex Director General", c('£',175000), "http://www.bbc.co.uk/news/10202596" ],
  [ "David Cameron", c('£',142500), "TODO" ],
  [ "Prince Charles", c('£',18e6), "http://www.dailymail.co.uk/news/article-2350699/First-Queen-Prince-Charles-enjoys-pay-rise-Welcome-boost-meet-growing-demands-William-Kate-Harry.html" ],
  [ "FTSE 100 CEO", c('£',4.3e6), "http://highpaycentre.org/blog/fatcat-wednesday-for-ftse-100-ceos" ],
  [ "All of FTSE 100 CEOs", c('£',4.3e8), "http://highpaycentre.org/blog/fatcat-wednesday-for-ftse-100-ceos" ],
  [ "Wayne Rooney", c('£',1.55e7), "http://www.independent.ie/sport/wayne-rooney-and-the-top-10-highest-earning-players-in-world-football-30033217.html" ],
  [ "George Soros", 4e9 * usdToGbp, "http://www.forbes.com/pictures/mdg45eejfh/1-george-soros/"],
  [ "Rich Ricci", c('£',40e6), "http://www.theguardian.com/business/2011/mar/07/barclays-hands-five-bankers-110m" ],
  [ "Donald Trump", c('$',42e6), "http://www.salary-money.com/donald-trump-salary-42000000.php" ],
  [ "Tony Blair", c('£',13e6), "http://www.telegraph.co.uk/news/politics/tony-blair/10551183/Tony-Blairs-fortune-boosted-13m-by-bumper-year.html" ],
  [ "Jimmy Carr", c('£',2.5e6), "http://www.accountancyage.com/aa/news/2322473/comic-jimmy-carr-to-pay-gbp500-000-tax-bill" ],
  [ "Paul McCartney", c('£',12e6), "http://www.forbes.com/2008/02/14/mccartney-mills-beatles-face-cx_po_0213autofacescan08.html" ],
  [ "UK Minimum wage", c('£',11105), "", "220 * 8 * 6.31 (UK 2013)" ],
  [ "Exxon Mobile profit", c('$',44880e6), "http://money.cnn.com/gallery/magazines/fortune/2013/07/08/global-500-most-profitable.fortune/index.html" ],
  [ "Apple - profit", c('$',41733e6), "http://money.cnn.com/gallery/magazines/fortune/2013/07/08/global-500-most-profitable.fortune/index.html" ],
  [ "Gazprom - profit",  c('$',38086e6), "http://money.cnn.com/gallery/magazines/fortune/2013/07/08/global-500-most-profitable.fortune/index.html" ],
  [ "Bank of China - profit",   c('$',37806e6), "http://money.cnn.com/gallery/magazines/fortune/2013/07/08/global-500-most-profitable.fortune/index.html" ],
  [ "United States total tax income",   c('$',3.6e12), "http://stats.oecd.org/Index.aspx?DataSetCode=REV#" ],
  [ "United Kingdom total tax income",   c('$',800e9), "http://stats.oecd.org/Index.aspx?DataSetCode=REV#" ],

].map(function(x) {
  return {
    title: x[0],
    value: x[1],
    source: x[2],
  }
});


function c(cur,amount) {
  return conversions[cur] * amount;
}
