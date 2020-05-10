// const request = require('request');
const fetch = require('node-fetch');
const fs = require('fs');

var url = "https://api.scryfall.com/cards/search";
var query = "?q=";
//search for land cards
query += "t:land";
url += query;

// var data = requestPage(url).then((data)=>console.log(data.total_cards));
processCards(url);

async function processCards(url) {
  do {
    var page = await requestPage(url);
    // printCards(page);
    console.log(`first card of page: ${page.data[0].name}`);
    url = page.next_page;
    console.log(`Next page: ${url}`);

  } while(page.has_more);
}

async function requestPage(url) {
  // fetch data from the scryfall api
  //fetch returns a Promise<Response>
  var response = await fetch(url);
  //convert it to JSON
  return page = await response.json();
}

// function requestPage_old(url) {
//   request(url, (err, res, body) =>{
//     if(!err && res.statusCode == 200) {
//       var cards = JSON.parse(body);
//       var numCards = cards.total_cards;
//       // scryfall limits each api call to 175 entries per page
//       var numPages = Math.ceil(numCards / 175);
//       console.log( `Number of pages: ${numPages}`);
//       console.log(`Total land cards: ${cards.total_cards}`);
//     }
//   });
// }

function printCards(cards) {
  // Spit out the full image uri for each card
  cards.data.forEach((card, index)=>{
    if(card.image_uris && card.image_uris.art_crop) {
      console.log(`${index}: ${card.image_uris.art_crop}`);
    }
  });
}
