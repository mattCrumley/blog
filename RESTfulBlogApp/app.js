var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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

//INDEX route. Show all blogs
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

//NEW route. Show a new blog form
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//CREATE RESTful route. Create a new blog, then redirect back to INDEX
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

//SHOW RESTful route. Show a specific blog
app.get("/blogs/:id", function(req,res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show", {blog: foundBlog});
		}
	});
	
});

//EDIT route. Edit a specific blog
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		
		}
		else{
			res.render("edit", {blog: foundBlog});
		}
	});
	
});

//UPDATE route. Update blog, then redirect
app.put("/blogs/:id", function(req, res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
	
});

app.listen(3000, function(){
	console.log("The blog server has started");
});