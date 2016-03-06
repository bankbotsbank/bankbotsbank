import Nightmare from 'nightmare';


Nightmare.action('fetchTransactionsJson', function (done) {
  this.evaluate_now(
    function () {
      var bodyDataset = document.getElementsByTagName('body')[0].dataset;
      var url = 'https://www.bbva.es/BBVANet/subhome-cuentas-tarjetas/buscadormovimientos/0?numeroMovimientosPorPagina=20';
      var xhr = new XMLHttpRequest();
      if (!xhr) {
        bodyDataset.transactions =
          JSON.stringify({ errors: [{ code: 'cannot_create_xmlhttprequest' }] });
      } else {
        xhr.ontimeout = function () {
          bodyDataset.transactions =
            JSON.stringify({ errors: [{ code: 'request_timeout', meta: { url: url } }] });
        };
        xhr.onload = function() {
          if (xhr.readyState === 4) { 
            if (xhr.status === 200) {
              var transactions =
                JSON.parse(xhr.responseText).listaMovimientos.map(function(t) {
                  return {
                    transactionDate: new Date(t.fechaMovimiento).toISOString(),
                    valueDate: new Date(t.fechaValor).toISOString(),

                    description: t.concepto,

                    category: t.humanSubcategoryDescription,

                    currency: t.importe.codigoDivisa,
                    amount: t.importe.importe,

                    // Sometimes in BBVA...
                    // disponible: {importe: 1239.7600000000002
                    balance: t.disponible.importe
                  };
                });
              bodyDataset.transactions = JSON.stringify(transactions);
            } else {
              bodyDataset.transactions = JSON.stringify({
                errors: [{
                  code: 'request_error',
                  meta: { url: url, statusText: xhr.statusText }
                }] 
              });
            }
          }
        };
        xhr.open('GET', url, true);
        xhr.timeout = 5000;
        xhr.send();
      }
    },
    done
  );
});


function fetchTransactions(nightmare) {
  return new Promise((resolve, reject) => {
    nightmare
      // `wait` required for fetchTransactionsJson() to work (doesn't work with only
      // 2 seconds, sometimes doesn't work with 3 either)
      .wait(4000)
      .fetchTransactionsJson()
      .wait('body[data-transactions]')
      .evaluate(function () {
        // this is set by fetchTransactionsJson()
        return document.getElementsByTagName('body')[0].dataset.transactions;
      })
      .run(function (err, transactionsJson) {
        let result;
        if (err) {
          result = {
            error: { code: 'run_error', meta: { data: err.toString() } },
            data: { session: nightmare }
          };
        } else {
          const transactions = JSON.parse(transactionsJson);
          result = transactions.errors ?
            { error: transactions.errors[0], data: { session: nightmare } } :
            { error: null, data: { transactions , session: nightmare } };
        }
        resolve(result);
      });
  });
}

function login(username, password) {
  return new Promise((resolve, reject) => {
    const nightmare = new Nightmare({ waitTimeout: 10000 });
    nightmare
      .goto('https://www.bbva.es/particulares/index.jsp')
      .click('.c-menu-accesoUsuario .c-botones-generico')
      .type('input[name="eai_user"]', username)
      .type('input[name="eai_password"]', password)
      .click('#acceder')
      .wait(function () {
        return document.title === 'Error' || document.title === 'BBVA';
      })
      .evaluate(function () {
        return document.title !== 'Error';
      })
      .run(function (err, wasLoginSuccessful) {
        let error;
        if (err) {
          error = { code: 'run_error', meta: { data: err.toString() } };
        } else if (wasLoginSuccessful) {
          error = null;
        } else {
          error = { code: 'login_error' };
        }
        resolve({ error, data: nightmare });
      });
  });
}

async function fetch({ username, password }) {
  let error;
  let transactions;
  let session;
  ({ error, data: session } = await login(username, password));
  if (!error) {
    ({ error, data: { transactions, session } } = await fetchTransactions(session));    
  }
  session
    .end()
    // Without then(), for some reason, the Electron process is not closed
    .then();
  return { error, data: transactions };
}

export default { login, fetch };
