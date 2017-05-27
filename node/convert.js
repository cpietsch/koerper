// converts a word2vector txt file into an js object
// christopher pietsch

const fs = require('fs');

let file = process.argv[2];

var lineReader = require('readline').createInterface({
  input: fs.createReadStream(file)
});

var writeStream = fs.createWriteStream("wordvecs.js", {
  flags: 'a'
})
let out = "var wordVecs={"

lineReader
  .on('line', function (line) {
    writeStream.write(out);

    const split = line.split(" ")

    if(split.length == 2) {
      out = ''
    } else {
      out = '"' + split[0] + '": ['
      for (var i = 1; i < split.length-1; i++) {
        out += split[i] + ','
      }
      out = out.slice(0, -1)
      out += '],\n'
    }
  })
  .on('close', function () {
    writeStream.write(out.slice(0, -2))
    writeStream.write('\n}\n')
    writeStream.end()
  })