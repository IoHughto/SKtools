const cheerio = require('cheerio');
const fs = require('fs');

const args = process.argv.slice(2);

if(typeof args[0] === 'undefined') {
    console.log('Syntax Error: node pointParser.js <.wer file>');
    process.exit();
}

const cmdXML = fs.readFileSync(args[0],'utf-8');
let $ = cheerio.load(cmdXML, {
    xmlMode: true
});

const event = $('event');
const people = [];
$('person').each(function(i, err) {
    people[$(this).attr('id')] = {
        dci: $(this).attr('id'),
        first: $(this).attr('first'),
        last: $(this).attr('last'),
        points: 0
    };
});
$('match').each(function(i, err) {
    if($(this).attr('outcome') === '1') {
        people[$(this).attr('person')].points += 3;
    }
    if($(this).attr('outcome') === '2') {
        people[$(this).attr('person')].points += 1;
        people[$(this).attr('opponent')].points += 1;
    }
});
for( let key in people) {
    console.log("\""+$(event).attr('title')+"\",\""+$(event).attr('sanctionnumber')+"\",\""+people[key].first+"\",\""+people[key].last+"\","+people[key].dci+","+people[key].points);
}

