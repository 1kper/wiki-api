const express = require("express");
// const bodyParser = require("body-parser");


// const app = express();
// const {toDoItem,wtoDoItem} = require("./models");
const mongoose = require("mongoose");

const _ = require("lodash");


// const url = 'mongodb://localhost:27017/testdb';
//
// MongoClient.connect(url, (err, client) =>
//
//     const db = client.db('testdb');
//
//     db.listCollections().toArray((err, collections) => {
//
//        console.log(collections);
//
//        client.close();
//     });
//
//
//
// ////////////////////////////////////////////mongoose connection start and check////////////////////////////////////////


let dbc = mongoose.connect('mongodb://localhost:27017/WikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// const { db } = mongoose.connection;
// const result =   db.collection('toDoItemDb').find().toArray();

const db1 = mongoose.connection;



db1.on("error", console.error.bind(console, "connection error: "));
db1.once("open", function() {
  console.log("Connected successfully");
});

// const db = mongoose.connection.db;
// ////////////////////////////////////////////schema for the collection and model refering to the connection///////////////////////////////////////
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  }
});


const Article = new mongoose.model("Article", ArticleSchema);

const models = {};
const getModel = (collectionName) => {
  if (!(collectionName in models)) {
    models[collectionName] = connection.model(
      collectionName, ArticleSchema, collectionName
    );
  }
  return models[collectionName];
};

let Dataset;


const app = express();

///////////////////////PART 1 OF complaint with the REST ARTICHECTURE server route for the collectio/all article/articles path///////////////////////

app.route("/articles")

//////////////////////////get route - to read/ all article//////////////////////////////
  .get((req, res) => {

  Article.find({}, function(err, docs) {
    if (err) {
      res.send(err);
      console.log(err);
    } else {if(docs.length===0){Article.insertMany([{

    "title" : "API",
    "content" : "API stands for Application Programming Interface. It is a set of subroutine definitions, communication protocols, and tools for building software. In general terms, it is a set of clearly defined methods of communication among various components. A good API makes it easier to develop a computer program by providing all the building blocks, which are then put together by the programmer."
}
,

{

    "title" : "Bootstrap",
    "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
}
,

{

    "title" : "DOM",
    "content" : "The Document Object Model is like an API for interacting with our HTML"
}])
res.send(docs);
}

else{res.send(docs);
console.log("Second function call : ", docs.length);}


    }
  });
})

//////////////////////////post route - to create///////////////////////////////
  .post((req, res) => {


    const newArticle = new Article(req.body);
    newArticle.save((err)=>{if(err){res.send(err)}else {
      res.send("successfully saved the article")
    }});


})

//////////////////////////delete route - to delete all article ///////////////////////////////
 .delete((req, res) => {

  console.log(req.body);
  Article.deleteMany({}, function(err) {
    if (err) {
      res.send(err);
      console.log(err);
    } else {


      res.send("successfully deleted all article");
    }
  });
});


//////////////////////PART 2 OF complaint with the REST ARTICHECTURE server route for the single document akd article path///////////////////////


app.route("/articles/:reqArticle")

//////////////////////////get route - to read a single article//////////////////////////////
      .get((req,res)=>{
       articleTitle = req.params.reqArticle;


         Article.find({},(err,articles)=>{
           if(err){res.send(err)}
           else { let foundArticle=false;
              articles.forEach((item)=>{
                if (_.lowerCase((articleTitle)) === _.lowerCase(item.title)) {
                     res.send(item);
                     foundArticle=true;

               }
               else{}


              })

              if(!foundArticle){res.send("article is not found")}
              else{}



           }

       });


     })
//////////////////////////get route - to replace a single article//////////////////////////////

  .put(
    async (req,res)=>{
      const articleTitle = req.params.reqArticle;
      await  Article.replaceOne({title:articleTitle},
        {title:req.body.title,content:req.body.content}).then(
      (err)=>{
        if(err){res.send(err)}
        else{res.send("one article got updated")}
      
      }
    )


    }
  )

  //////////////////////////get route - to update part a single article//////////////////////////////
  ////////////////////////// without overwrit:true - moongse will prevent the replacing operation so, this will help us in the part ////////////////////////

  .patch(
    async (req,res)=>{
      const articleTitle = req.params.reqArticle;
      await  Article.updateOne({title:articleTitle},{$set: req.body}).then((err,result)=>{


        if(err){res.send(err)}
        else{res.send(articleTitle+"got updated as "+result)}
      }



    )


    }
  )

  //////////////////////////get route - to delete a single article//////////////////////////////
  .delete(
    async (req,res)=>{
     const articleTitle = req.params.reqArticle;

      await  Article.deleteOne({title:articleTitle},(err)=>{
            if(err){res.send(err)}
            else{res.send(articleTitle+"got deleted successfully")}
      }
    )


    }
  )

// app.get(, )
//
// app.post("/articles", )
//
// app.delete("/articles", )




// app.get("/home/:listNameP", async (req, res) => {
//
//
//
//   // console.log((db1.db.collections(name,function(err,collection{})));
//   //
//   let collectionExist = false
//   let collectionName = req.params.listNameP;
//   db1.db.listCollections({
//       name: req.params.listNameP
//     })
//     .next(async function(err, collinfo) {
//       if (collinfo) {
//
//         collectionExist = true;
//         console.log("collection exist");
//
//         // The collection exists const result = getModel("YourCollectionName").findOne({})
//       } else {}
//
//
//     });
//
//   if (collectionExist) {
//     const toDoItemArray = await mongoose.model(collectionName, ItemSchema, collectionName).find({});
//
//
//     res.render("list", {
//       listTitle: day,
//       newListItems: toDoItemArray,
//       paramValue: collectionName
//     });
//     res.end()
//   } else {
//     Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
//     const toDoItemArray = await Dataset.find({});
//     res.render("list", {
//       listTitle: day,
//       newListItems: toDoItemArray,
//       paramValue: collectionName
//     });
//     res.end()
//   }
//
//   // const result = await  db.collection('toDoItemDb').find().toArray();
//   // console.log(result);
//   //
//   // connection.once('open', function () {
//
//   //     connection.db.collection("YourCollectionName", function(err, collection){
//   //         collection.find({}).toArray(function(err, data){
//   //             console.log(data); // it will print your collection data
//   //         })
//   //     });
//   //
//   // });
//
//
//
//   //  const toDoItemArray = await toDoItem.find({});
//   //
//   //
//   // res.render("list", {listTitle: day, newListItems: toDoItemArray});
//
// });



//
// app.post("/home/:listNameP", async (req, res) => {
//
//   const listItems = req.body.newItem;
//   let collectionName = req.params.listNameP;
//   console.log("/" + collectionName);
//   // const item = new [collectionName]( {
//   //   listItem: listItems
//   //
//   // });
//   //
//   //
//   Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
//   item = new Dataset({
//     listItem: listItems
//
//   });
//   await item.save();
//
//
//   try {
//
//
//
//   } catch (error) {
//     res.status(500).send(error);
//     res.end()
//   }
//   Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
//   const toDoItemArray = await Dataset.find({});
//   res.render("list", {
//     listTitle: day,
//     newListItems: toDoItemArray,
//     paramValue: collectionName
//   });
//   // res.redirect("/"+collectionName);
//
// });

// app.post("/delete/:listNameP", async (req, res) => {
//   const listItems = req.body.item;
//   let collectionName = req.params.listNameP;
//   console.log(listItems);
//   //
//   Dataset = mongoose.model(collectionName, ItemSchema, collectionName);
//   await Dataset.deleteOne({
//     listItem: listItems
//   });
//   // await toDoItem.remove({});
//   res.redirect("/home/" + collectionName)
//
//
// })

// app.get("/work", async (req,res)=>{
//
//    const  wtoDoItemArray = await wtoDoItem.find({});
//
//   res.render("list", {listTitle: "Work List", newListItems: wtoDoItemArray});
// });
//
// app.get("/about", function(req, res){
//   res.render("about");
// });


module.exports = app;
