const mongoose = require('mongoose'); 

var articleSchema = new mongoose.Schema({
    id : String,
    text: String,
    size: String,
    type: String,
    price: String,
    imageUrls : Array
});
const Articles = mongoose.model('Articles', articleSchema);

module.exports = Articles;