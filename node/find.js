fs = require('fs')

const sektoren = require("./sektoren.json")

fs.unlink(process.argv[3], () => {});
var writeStream = fs.createWriteStream(process.argv[3], {
  flags: 'a'
})

console.log(sektoren)

const leftPadding = rightPadding = 800;

fs.readFile(process.argv[2], 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}
	console.log("text length", data.length);

	sektoren.forEach(s => {
		s.forEach(w => {
			find(data, w)
		})

		writeStream.write("\n\n");
	})
	
});

function find(text, word){
	const searchWord = ' ' + word.toLowerCase() + ' ';
	const pos = allIndexOf(text, searchWord);
	console.log(word, pos.length)
	writeStream.write(word + " " + pos.length + "\n");

	pos.forEach(p => {
		console.log("---------------")
		const snipped = text.substring(p-leftPadding, word.length+p+rightPadding);
		getSentence(snipped, searchWord)
		// console.log(snipped)
	})
}

function getSentence(text, word){
	const sentences = text.match( /[^\.!\?]+[\.!\?]+/g );
	const sentence = sentences.filter(s => s.toLowerCase().indexOf(word) > -1)
	// console.log(sentence)
	writeStream.write(sentence.join("\n") + "\n");
	// if(sentence.length == 0){
	// 	console.log(sentences)
	// 	console.log("--------")
	// 	console.log(text)
	// }
}

function allIndexOf(str, toSearch) {
	str = str.toLowerCase()
	var indices = [];
	for(var pos = str.indexOf(toSearch); pos !== -1; pos = str.indexOf(toSearch, pos + 1)) {
			indices.push(pos);
	}
	return indices;
}