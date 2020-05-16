var methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	express = require("express"),
	app = express();
	
	app.use(methodOverride("_method"));
	
	mongoose.set('useFindAndModify', false);
	mongoose.set("useUnifiedTopology", true);
	mongoose.set('useNewUrlParser', true);
	mongoose.connect("mongodb://mongo-db/rest_note_app");
	
	app.set("view engine","ejs");
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(express.static("public"));

var noteSchema= new mongoose.Schema({
	title:String,
	body: String,
	date:{type:Date , default:Date.now}
	});

	
var Note = mongoose.model("note", noteSchema);
	
	// Note.create({
	// 	title: "first note",
	// 	img:"https://images.unsplash.com/photo-1586971934493-d6829d89393c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	// 	body:"the image is from unsplash.com for free photos !"
	// });

	app.get("/", function(req, res){
		res.redirect("/note");
	})
	
	app.get("/note", function(req, res){
		Note.find({}, function(err, notes){
			res.render("index", {notes:notes});
		})
	})

	app.get("/note/new", function(req, res){
		res.render("new");
	})
	
	app.post("/note", function(req, res){
		Note.create(req.body.note, function(err, createdNote){
			if(err){
				res.render("new");
			}else{
				res.redirect("/note");
			}
		})
	})
	
	app.get("/note/:id", function(req, res){
		Note.findById(req.params.id, function(err, requestedNote){
			if(err){
				res.redirect("/note");
			}else{
				res.render("show", {note: requestedNote});
			}
		})
	})

	app.get("/note/:id/edit", function(req, res){
		Note.findById(req.params.id,function(err, reqNote){
			if(err){
				res.redirect("/note");
			}else {
				res.render("edit", {note: reqNote});
			}
		})
	})

	app.put("/note/:id", function(req, res){
		Note.findByIdAndUpdate(req.params.id, req.body.note, function(err, updatedNote){
			if(err){
				res.redirect("/note");
			}else{
				res.redirect("/note/"+req.params.id);
			}
		})
	})
	
	app.delete("/note/:id", function(req, res){
		Note.findByIdAndRemove(req.params.id, function(err){
			if(err){
				res.redirect("/note");
			}else{
				res.redirect("/note");
			}
			
		})
		
		
	})


	app.listen(3000, function(){
		console.log("the server is on !!");
	});