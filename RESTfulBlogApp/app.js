var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type: Date, default: Date.now}
	
});

var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
	
});

//INDEX route
app.get("/blogs", function(req, res){
	//get all blogs from DB
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("The was an error");
		}
		else{
			res.render("index", {blogs:blogs});
		}
	});
	
	
});

//NEW route

app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE RESTful route
app.post("/blogs", function(req, res){

	//create a new blog and save to db
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		}
		else{
			//redirect back to blog page
			res.redirect("/blogs");
		}
	});
	
});

app.listen(3000, function(){
	console.log("The blog server has started");
});