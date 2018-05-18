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
            if(file.endsWith("wer") || file.endsWith("json")) {
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
    const fileData = fs.readFileSync(werFiles[file], 'utf-8');
    if(werFiles[file].endsWith("wer")) {
        let $ = cheerio.load(fileData, {
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
    } else {
        const event = JSON.parse(fileData);
        if(event.hasOwnProperty('data') && event.data.hasOwnProperty('Persons')) {
            const persons =  event.data.Persons;
            for(let i = 0; i < persons.length; i++) {
                const person = {
                    'dci' : persons[i].hasOwnProperty('DCI') ? persons[i].DCI : 0,
                    'first' : persons[i].hasOwnProperty('FirstName') ? persons[i].FirstName : "",
                    'last' : persons[i].hasOwnProperty('LastName') ? persons[i].LastName : "",
                    'middle' : persons[i].hasOwnProperty('MiddleName') ? persons[i].MiddleName : "",
                    'country' : persons[i].hasOwnProperty('Country') ? persons[i].Country : "",
                };
                players[person.dci] = person;
            }
        }
    }
}


const stream = fs.createWriteStream(args[1]);

stream.once('open', function() {
    stream.write("DCI,First,Middle,Last,Country\n");
    for( let key in players ) {
        stream.write(players[key].dci+','+players[key].first+','+players[key].middle+','+players[key].last+','+players[key].country+"\n");
    }
    stream.end();
});