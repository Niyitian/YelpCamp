var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX route
router.get("/",function(req,res){
	Campground.find({},function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	})
});

// CREATE route
router.post("/", middleware.isLoggedIn,function(req,res){
	// get data from the form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampGround = {name:name, image:image, description:description, author: author, price: price};
	
	// save the new campground to the database
	Campground.create(newCampGround,function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			// redirect to campgrounds
			res.redirect("/campgrounds");
		}
	});
});

// Edit route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update Route
router.put("/:id", function(req,res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground,function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);	
		}
	});
});

// Destroy Route{
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else{
			res.redirect("/campgrounds");
		}
	});
});

// NEW
router.get("/new", middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

// SHOW
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

module.exports = router;