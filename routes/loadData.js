var express = require('express');
var router = express.Router();
const request = require("request");
const Article = require("../packages/article");

function addArticlesToDb(itemData) {
  if (itemData !== null) {
    Article.find({id : itemData.id}, function (err, article) {
      if (err) return handleError(err);
      if (article.length >= 1) {
        console.log("article " + itemData.id + " already there");
      }
      else {
        var newArticle = new Article({id : String(itemData.id), size : itemData.size , type : itemData.type,
        price : itemData.price, imageUrls : itemData.imageUrls, text : itemData.text});
        newArticle.save(function(err) {
          if (err) return handleError(err);
          console.log("Item " + itemData.id + " saved !");
        });
      }
    });
  }
}

function getMedias(itemData, availableMedias, allMedias) {
  var imageUrls = [];
  for (var i in availableMedias) {
    var curKey = availableMedias[i];
    for (var y in allMedias) {
      var curObj = allMedias[y];
      if (curObj.media_key == curKey)
        imageUrls.push(curObj.url);
    }
  }
  itemData.imageUrls = imageUrls;
  return itemData;
}

function getCategories(itemData, text) {
  if (text.match(/\[.*\]/ig)) {
    var textData = text.match(/\[.*\]/ig);
    text = text.replace(textData, "")
    textData = String(textData[0]).replace("[", "").replace("]", "");
    var categories = textData.split("-");
    itemData.size = String(categories[0]).trim();
    itemData.type = String(categories[1]).trim();
    itemData.price = String(categories[2]).trim().replace("€", "").trim();
    itemData.text = String(String(text).trim().replace(/\\+/, "").replace(/https.*/ig, ""));
    return (itemData);
  }
  else {

    return (null);
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var options = {
    'method': 'GET',
    'url': 'https://api.twitter.com/2/users/1390077902637654019/tweets?max_results=100&media.fields=preview_image_url,media_key,url&exclude=replies,retweets&expansions=attachments.media_keys',
    'headers': {
      'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAH3%2FPgEAAAAAOq%2BGFdy5F8DDYOMB5VM3rAw6WzU%3DSU8m3rFICz4HeS07fuuOdAzWHfowy0rAbENvHW3pDXcDvzK367',
      'Cookie': 'personalization_id="v1_K6CaHaCuXpY2SlJcB0lLgA=="; guest_id=v1%3A162128938927957035'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    var bodyData = JSON.parse(response.body);
    var medias = bodyData.includes.media;
    var itemData = {};
    bodyData.data.forEach(element => {
      if (element.attachments) {
        console.log(element);
        itemData = {'id' : element.id};
        itemData = getMedias(itemData, element.attachments.media_keys, medias);
        itemData = getCategories(itemData, element.text);
        addArticlesToDb(itemData);
      }
    });
    res.json({succes : "Adding items into the database"});
  });
});

module.exports = router;
