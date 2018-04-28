const cheerio = require('cheerio');
const fs = require('fs');

const args = process.argv.slice(2);

if(typeof args[0] === 'undefined') {
    console.log('Syntax Error: node playerExtractor.js <.wer file>');
    process.exit();
}

const xml = fs.readFileSync(args[0],'utf-8');
let $ = cheerio.load(xml, {
    xmlMode: true
});

const players = [];
$('person').each(function(i,err) {
    players[$(this).attr('id')] = {
        dci: $(this).attr('id'),
        first: $(this).attr('first'),
        last: $(this).attr('last'),
        middle: $(this).attr('middle'),
        country: $(this).attr('country')
    };
});

for( let key in players ) {
    console.log(players[key].dci+',"'+players[key].first+'","'+players[key].middle+'","'+players[key].last+'","'+players[key].country+'"');
}