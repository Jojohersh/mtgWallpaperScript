// const request = require('request');
const fetch = require('node-fetch');
const fs = require('fs');

//define the search query
var url = "https://api.scryfall.com/cards/search";
var query = "?q=";
//search query for land cards
query += "t:land";
url += query;

// do the main storage actions for query results
processCards(url);

//************************************************
// FUNCTION DECLARATIONS

// takes a scryfall api url
// extracts all image uris for the cards and stores into a text file
async function processCards(url) {
  // start requesting as many pages as needed
  // note: scryfall limits 175 results per page

  // index value of currently viewed card. is an object for pass through reference.
  var cardIndex = {value:0};
  do {
    console.log("processing...");
    var page = await requestPage(url);
    var cards = page.data;
    //save all uris to a txt file
    writeCardsToFile(cards, "card_image_uris.txt");
    //save all the images
    saveCardImages(cards,cardIndex);
    // update url to the next page of values
    url = page.next_page;
  } while(page.has_more);
  console.log("Finished.");
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
        // console.log(`${card.name} written`);
      })
    }
  });
}

// takes an array of cards derived from page.data
//       an index value for which total card it is on
function saveCardImages(cards,cardIndex) {
  cards.forEach((card)=>{
    if(card.image_uris && card.image_uris.art_crop){
      uri = card.image_uris.art_crop;
      saveCardImage(uri, `./images/${cardIndex.value}.jpg`);
      cardIndex.value++;
    }
  });
}

//takes an image uri as an input
//      a filename to be saved to
// downloads the image
async function saveCardImage(uri, fileName) {
  var response = await fetch(uri);
  const dest = fs.createWriteStream(fileName);
  response.body.pipe(dest);
}
