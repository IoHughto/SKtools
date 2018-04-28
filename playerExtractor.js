const cheerio = require('cheerio');
const fs = require('fs');

const args = process.argv.slice(2);

if(typeof args[0] === 'undefined' || typeof args[1] === 'undefined') {
    console.log('Syntax Error: node playerExtractor.js < directory > < output.csv >');
    process.exit(-1);
}

// List all files in a directory in Node.js recursively in a synchronous fashion
const walkSync = function(dir, filelist) {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else {
            if(file.endsWith("wer")) {
                filelist.push(dir + '/' + file);
            }
        }
    });
    return filelist;
};

const werFiles = [];
const players = [];
walkSync(args[0],werFiles);

for (let file in werFiles) {
    const xml = fs.readFileSync(werFiles[file], 'utf-8');
    let $ = cheerio.load(xml, {
        xmlMode: true
    });

    $('person').each(function (i, err) {
        players[$(this).attr('id')] = {
            dci: $(this).attr('id'),
            first: $(this).attr('first'),
            last: $(this).attr('last'),
            middle: $(this).attr('middle'),
            country: $(this).attr('country')
        };
    });
}


const stream = fs.createWriteStream(args[1]);

stream.once('open', function() {
    stream.write("DCI,First,Middle,Last,Country\n");
    for( let key in players ) {
        stream.write(players[key].dci+','+players[key].first+','+players[key].middle+','+players[key].last+','+players[key].country+"\n");
    }
    stream.end();
});