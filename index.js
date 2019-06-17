const TelegramBot = require('node-telegram-bot-api');
const request = require('request');


const token = '608783806:AAEIm9YHSELLgbNGz8Q6Ib4cmmwS48ly4Tk';

// Create a bot that uses 'polling' to fetch new updates  -- , {polling: true}
const bot = new TelegramBot(token);


let button = {
  reply_markup: {
    inline_keyboard:
    [
      [
      {text: 'EUR ~ €', callback_data: 'EUR'},
      {text: 'USD ~ $', callback_data: 'USD'},
      /*{text: 'RUB ~ ₽', callback_data: 'RUB'},*/
      {text: 'BTC ~ ฿', callback_data: 'BTC'}
      ]
    ]
  }
}

bot.onText(/\/curse/, (msg, match) => {  

  const chatId = msg.chat.id;   

  bot.sendMessage(chatId, 'Выберете валюту', button);
});

bot.on('callback_query', query => {
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=3', function (error, response, body){
     const data = JSON.parse(body);
     const result = data.filter(item => item.ccy === query.data)[0];

     let answer = `${result.ccy} => ${result.base_ccy}\nBuy: ${result.buy}\nSale: ${result.sale}`;
     bot.sendMessage(id, answer);
  })
});

module.exports = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        if (body) {
            bot.processUpdate(JSON.parse(body));
            //res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(body);            
        }
      else {
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('OK');
      }
    });
};
