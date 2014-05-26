var DATA = [
  [ "Nurse", 22000, "http://www.prospects.ac.uk/adult_nurse_salary.htm" ],
  [ "Trader", 1e5, "http://www.prospects.ac.uk/financial_trader_salary.htm" ],
  [ "Air travel assistants", 22354, "http://www.thisismoney.co.uk/money/article-2269520/Best-paid-jobs-2012-Official-figures-national-average-UK-salaries-400-occupations.html" ],
  [ "Midwife", 30000, "http://www.prospects.ac.uk/midwife_salary.htm" ],
  [ "Civil engineers", 39236, "http://www.thisismoney.co.uk/money/article-2269520/Best-paid-jobs-2012-Official-figures-national-average-UK-salaries-400-occupations.html" ],
  [ "Physical scientists", 49333, "http://www.thisismoney.co.uk/money/article-2269520/Best-paid-jobs-2012-Official-figures-national-average-UK-salaries-400-occupations.html" ],
  [ "Vicky Pryce - ex Director General", 175000, "http://www.bbc.co.uk/news/10202596" ],
  [ "John Suffolk - HM CIO", 207000, "http://www.bbc.co.uk/news/10202596" ],
  [ "David Cameron", 142500, "TODO" ],
  [ "Prince Charles", 18e6, "http://www.dailymail.co.uk/news/article-2350699/First-Queen-Prince-Charles-enjoys-pay-rise-Welcome-boost-meet-growing-demands-William-Kate-Harry.html" ],
  [ "FTSE 100 CEO", 4.3e6, "http://highpaycentre.org/blog/fatcat-wednesday-for-ftse-100-ceos" ],
  [ "Wayne Rooney", 1.55e7, "http://www.independent.ie/sport/wayne-rooney-and-the-top-10-highest-earning-players-in-world-football-30033217.html" ],
  [ "George Soros", 4e9, "http://www.forbes.com/pictures/mdg45eejfh/1-george-soros/"],
  [ "Rich Ricci", 40e6, "http://www.theguardian.com/business/2011/mar/07/barclays-hands-five-bankers-110m" ],
  [ "Donald Trump", 25.2e6, "http://www.salary-money.com/donald-trump-salary-42000000.php" ],
  [ "Tony Blair", 13e6, "http://www.telegraph.co.uk/news/politics/tony-blair/10551183/Tony-Blairs-fortune-boosted-13m-by-bumper-year.html" ],
  [ "Jimmy Carr", 2.5e6, "http://www.accountancyage.com/aa/news/2322473/comic-jimmy-carr-to-pay-gbp500-000-tax-bill" ],
  [ "Paul McCartney", 12e6, "http://www.forbes.com/2008/02/14/mccartney-mills-beatles-face-cx_po_0213autofacescan08.html" ],
  [ "UK Minimum wage", 11105, "", "220 * 8 * 6.31 (UK 2013)" ],
].map(function(x) {
  return {
    title: x[0],
    value: x[1],
    source: x[2],
  }
});
