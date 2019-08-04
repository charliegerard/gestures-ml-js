const lineReader = require('line-reader');
var fs = require('fs');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');

function readNewFile(file) {
    let trimmedContent = [];
  
    return new Promise((resolve, reject) => {
        fs.readFile(`data/newHP/${file}`, "utf8", (err, data) => {
            if (err){
                reject(err);
            } else{ 
                lineReader.eachLine(`./data/newHP/${file}`, function(line) {  
                    let truncatedLine = line.substr(line.indexOf('START ') + 6, line.indexOf('END')-7);
                    let arrayFromLine = truncatedLine.split(" ");
                    let formattedLine = arrayFromLine.map(arrayItem => parseFloat(arrayItem));
                    trimmedContent.push(formattedLine);
  
                    let concatArray = trimmedContent.reduce((acc, val) => acc.concat(val), []);
  
                    if(concatArray.length === 300){
                        resolve(concatArray)
                    }
                });
            } 
        });
    });
  }
  
  const readNewDir = () => 
    new Promise((resolve, reject) => fs.readdir(`./data/newHP/`, "utf8", (err, data) => err ? reject(err) : resolve(data)));
  
  const getNewData = async() => {
    const filenames = await readNewDir();
  
    return new Promise((resolve, reject) => {
        filenames.map(async file => { // 75 times
            let formattedNewData = await readNewFile(file); 
 
            resolve(formattedNewData);
        })
    })
  }

module.exports = async() => {
    return await getNewData();
}