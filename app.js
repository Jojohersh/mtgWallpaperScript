// const request = require('request');
const fetch = require('node-fetch');
const fs = require('fs');

var url = "https://api.scryfall.com/cards/search";
var query = "?q=";
//search for land cards
query += "t:land";
url += query;

processCards(url);

async function processCards(url) {
  // do {
    var page = await requestPage(url);
    var cards = page.data;
    writeCardsToFile(cards, "card_image_uris.txt");
    // console.log(cards);
    // diagnostics *********************************************
    // printCards(page);
    console.log(`first card of page: ${page.data[0].name}`);
    console.log(`Next page: ${page.next_page}`);
    //**********************************************************
    url = page.next_page;

  // } while(page.has_more);
}

// takes api scryfall api url as input
// returns a Promise<JSON> of the api response
async function requestPage(url) {
  // fetch data from the scryfall api
  //fetch returns a Promise<Response>
  var response = await fetch(url);
  //convert it to JSON
  return page = await response.json();
}

//input should be an array of cards, derived from page.data
//prints the image uri of every card
function printCards(cards) {
  // Spit out the full image uri for each card
  cards.forEach((card, index)=>{
    if(card.image_uris && card.image_uris.art_crop) {
      console.log(`${index}: ${card.image_uris.art_crop}`);
    }
  });
}

//takes 'cards', an array of cards derived from page.data
//      'fileName', the file to be written to
// appends a new line consisting of the card's image
function writeCardsToFile(cards, fileName) {
  cards.forEach((card)=>{
    if(card.image_uris && card.image_uris.art_crop) {
      var cardImgUri = `${card.image_uris.art_crop}\n`;
      fs.appendFile(fileName,cardImgUri,(err)=>{
        if (err) console.error(`yikes, something went wrong processing ${card.name}`);
        console.log(`${card.name} written`);
      })
    }
  });
}
