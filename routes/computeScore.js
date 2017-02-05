var status = require('./status');

module.exports = (transactions, username) => {
  var relevantTransactions = extractRelevantTransactions(transactions, username);
  var p = relevantTransactions.paid,
      o = relevantTransactions.overdue;
  var result = 0;
  p.forEach(function(t) {
    result += (t.deadline - t.datePaid) / 
              (t.deadline - t.createdAt) / 
              (p.length + o.length);
  });
  o.forEach(function(t) {
    result += 2 * (t.deadline - now()) / 
              (t.deadline - t.createdAt) / 
              (p.length + o.length);
  });

  // sigmoid transformation
  result = 1 / (1 + Math.exp(-result));
  return result;
}

// helper functions

function extractRelevantTransactions(transactions, username) {
  var paid = [];
  var overdue = [];
  transactions.forEach(transaction => {
    if(transaction.debtor == username)
      if(transaction.status == status.PAID) 
        paid.push(transaction)
      else if(transaction.status == status.UNPAID && now() > transaction.deadline)
        overdue.push(transaction)
  })
  return { paid: paid, overdue: overdue };
}

function now() {
  return 1000*60*60*24*(7+5);
  return Date.now();
}