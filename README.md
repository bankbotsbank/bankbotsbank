# BankBotsBank

BankBotsBank is an open effort to provide free and comprehensive programmatic access to personal accounts data on any bank of the world. It's an *enabler* of new fintech applications.

Hopefully some day all banks will provide an API, like [Mondo](https://medium.com/@jamesallison/mondo-hackathon-e504883a4a05#.9s5i1f3je), but in the meantime the only way to get programmatic access to bank accounts is through screen scraping. Developing this kind of software without the collaboration of banks requires to have accounts in all of them, with all the products (savings accounts, credit cards...) We think the most effective approach is an open-source, distributed effort where each developer uses their own bank account to implement a bot for that bank.

The first bot that has been implemented returns a JavaScript object (or JSON in the web interface) with the most recent transactions of the user's main account in the Spanish bank BBVA. You can easily try it through this [web form](http://bankbotsbank-env.us-west-2.elasticbeanstalk.com/bbva/).

It uses [Nightmare](https://github.com/segmentio/nightmare), a browser automation library that uses Electron (based on Chromium) under the covers. The [code of the BBVA bot](https://github.com/bankbotsbank/bankbotsbank/blob/master/src/bots/bbva/index.js) can be used as an example to develop bots for other banks.

This repo also contains the Dockerfile used to deploy the project to AWS Elastic Beanstalk (this is where the [BBVA test form](http://bankbotsbank-env.us-west-2.elasticbeanstalk.com/bbva/) and bot are hosted). It shows how to use `xvfb-run` to run Nightmare on a computer without a graphical display.

## [Discuss on Hacker News](https://news.ycombinator.com/item?id=11241713)

## License

MIT
