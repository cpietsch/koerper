const Transform = require('stream').Transform;
const fs = require('fs');
const text = require('pdf-stream').text;
const PDFStringifyTransform = require('pdf-stream').PDFStringifyTransform;
const PDFReadable = require('pdf-stream').PDFReadable;

// // Load file contents to ArrayBuffer synchronously 
let file = process.argv[2];
let output = fs.createWriteStream(process.argv[3]);
let pdf = new Uint8Array(fs.readFileSync(file));

// Transform class for replacing strings
class ReplaceTransform extends Transform {
constructor(options) {
  super({
    writableObjectMode: true,
    readableObjectMode: true
  });
  this.from = options.from;
  this.to = options.to;
}

// For every object
_transform(obj, encoding, cb) {
  // Get text content items
  if (typeof obj.textContent !== 'undefined'
    && Array.isArray(obj.textContent.items)) {
    obj.textContent.items.forEach((item, i) => {
      // Working with the PDF.js `textContent` object
      // Replace substring to another
      obj.textContent.items[i].str = item.str.replace(this.from, this.to);
    });
  }

  this.push(obj);
  cb();
}

}

// Stream PDF text to stdout 
new PDFReadable(pdf)
	.pipe(new ReplaceTransform({
	 from: /\ +/gi,
	 to: ' '
	}))
	.pipe(new ReplaceTransform({
	 from: /-/gi,
	 to: ''
	}))
	.pipe(new PDFStringifyTransform())
	.pipe(output);
	// .pipe(process.stdout);
