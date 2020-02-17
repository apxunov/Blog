//jshint esversion: 6

// Прописываем используемые фреймворки
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');


const app = express(); //используем express
app.set('view engine', 'ejs'); //используем ejs
app.use(bodyParser.urlencoded({extended: true})); //используем body-parser
app.use(express.static("public")); //статичные файлы (стили) располагаем в папке public, чтобы сервер мог прочитать их не только на локальном (нашем) устройстве

//Подключаемся к БД
mongoose.connect('mongodb://localhost:27017/blogDB', {useNewUrlParser: true, useUnifiedTopology: true});

//Статичный стартовый контент страниц
const homeContent = "Posts'd be stored there";
const aboutContent = "About me";
const contactContent = "Contact me";

//Шаблон, по которому строится пост
const postSchema = new mongoose.Schema ({
    title: {
        type: String,
        required: [true, "this field needs to be filled"],
    },
    post: {
        type: String,
        required: [true, "this field needs to be filled"],
    }
});
const Post = mongoose.model("Post", postSchema);


const postsListSchema = new mongoose.Schema({
    name: String,
    posts: [postSchema]
})
const postsList = mongoose.model("postsList", postsListSchema);



app.get("/", function(req, res){

    Post.find({}, function(err, foundPosts) {
        res.render("home", {
            homeContent: homeContent,
            posts: foundPosts
        });
    });
});




app.get("/about", function(req, res){
    res.render("about", {aboutContent: aboutContent});
})
app.get("/contact", function(req, res){
    res.render("contact", {contactContent: contactContent});
})
app.get("/compose", function(req, res){
    res.render("compose");
})


app.post("/compose", function (req, res) {
    
    const post = new Post({
        title: req.body.title,
        post: req.body.post
    });
    console.log(post);
    post.save();
    // res.redirect("/", {newTitle: input.title, newPost: input.post});
    res.redirect("/")
})

// параметры маршрутов.  postName - создаем страницу, url которой будет содержать title поста
app.get("/posts/:postName", function (req, res) {
    let postName = _.lowerCase(req.params.postName);
    posts.forEach(post => {
        const storedTitle = _.lowerCase(post["title"]);
        
        if (storedTitle === postName) {
            res.render("post", {
                postTitle: post["title"],
                postContent: post["post"]
            }
            )}
    });
    res.send(postName);
  })


// Проверка 
app.listen(3000, () => console.log('Example app listening on port 3000!'));