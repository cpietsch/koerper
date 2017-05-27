const Transform = require('stream').Transform;
const fs = require('fs');
const text = require('pdf-stream').text;
const PDFStringifyTransform = require('pdf-stream').PDFStringifyTransform;
const PDFReadable = require('pdf-stream').PDFReadable;
const stream = require('stream')
const sektoren = require('./sektoren.json');

// // Load file contents to ArrayBuffer synchronously 
// let file = '../pdf/freud_werke_bd8.pdf';
let file = process.argv[2];
let output = fs.createWriteStream('pdf.txt',  {flags: 'a'});
let pdf = new Uint8Array(fs.readFileSync(file));

// Transform class for replacing strings
class ReplaceTransform extends Transform {
  constructor(options) {
    super({
      writableObjectMode: true,
      readableObjectMode: true
    });
  }

  // For every object
  _transform(obj, encoding, cb) {
    // Get text content items
    if (typeof obj.textContent !== 'undefined'
      && Array.isArray(obj.textContent.items)) {
      obj.textContent.items.forEach((item, i) => {
        // Working with the PDF.js `textContent` object
        // Replace substring to another
        let str = item.str
        str = str.replace(/\ +/gi, ' ')
        str = str.replace(/-/gi, '')
        str = str.replace(/ö/gi, 'oe')
        str = str.replace(/ä/gi, 'ae')
        str = str.replace(/ü/gi, 'ue')
        str = str.replace(/Ö/gi, 'Oe')
        str = str.replace(/Ä/gi, 'Ae')
        str = str.replace(/Ü/gi, 'Ue')
        str = str.replace(/ß/gi, 'ss')
        str = str.replace(/[^a-zA-Z]/g, ' ')
        str = str.replace(/\ +/gi, ' ')
        if(str.replace(/ /g,'').match(/^.{1,}$/gi) == null){
          str = ' '
        }
        str = str.toLowerCase()
        // str = str.replace(/./gi, '')
        // str = str.replace(/,/gi, '')
        // str = str.replace(/ü/gi, 'ue')
        // str = str.replace(/ä/gi, 'ae')

        obj.textContent.items[i].str = str;
      });
    }
    // console.log(obj.textContent)
    this.push(obj);
    cb();
  }
}


class StreamReducer extends stream.Writable {
  constructor(chunkReducer, initialvalue, cb) {
    super();
    this.reducer = chunkReducer;
    this.accumulator = initialvalue;
    this.cb = cb;
  }
  _write(chunk, enc, next) {
    this.accumulator = this.reducer(this.accumulator, chunk);
    next();
  }
  end() {
    this.cb(null, this.accumulator)
  }
}

new PDFReadable(pdf)
	.pipe(new ReplaceTransform())
	.pipe(new PDFStringifyTransform())
  // .pipe(new StreamReducer(
  //   function (acc, v) {
  //     acc.push(v);
  //     return acc;
  //   },
  //   [],
  //   function(err, chunks) {
  //     const text = Buffer.concat(chunks).toString('utf8'); 
  //   })
  // )
	.pipe(output);
	// .pipe(process.stdout);
