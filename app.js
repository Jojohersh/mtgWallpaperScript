const request = require('request');
const fs = require('fs');

var url = "https://api.scryfall.com/cards/search";
var query = "?q=";
//search for land cards
query += "t:land";
url += query;

requestPage(url);

function requestPage(url) {
  request(url, (err, res, body) =>{
    if(!err && res.statusCode == 200) {
      var cards = JSON.parse(body);
      var numCards = cards.total_cards;
      // scryfall limits each api call to 175 entries per page
      var numPages = Math.ceil(numCards / 175);
      console.log( `Number of pages: ${numPages}`);
      console.log(`Total land cards: ${cards.total_cards}`);
      // console.log("\nCard images");
      console .log("=================================================================");
      // Spit out the full image uri for each card
      // cards.data.forEach((card, index)=>{
      //   if(card.image_uris && card.image_uris.art_crop) {
      //     console.log(`${index}: ${card.image_uris.art_crop}`);
      //   }
      // });
    }
  });
}
