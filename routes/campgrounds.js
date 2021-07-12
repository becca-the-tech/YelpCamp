const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

/* Campground Routes */
router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {

    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await (await Campground.findById(id).populate(
        {
            path: "reviews",
            populate: {
                path: "author"
            }
        }
    ).populate("author"));
    if (!foundCampground) {
        req.flash("error", "No campground found by that ID");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground: foundCampground });
}));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findById(id);
    if (!foundCampground) {
        req.flash("error", "No campground found by that ID");
        return res.redirect("/campgrounds");
    }
    if (!foundCampground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to view that page");
        return res.redirect(`/campgrounds/${foundCampground._id}`);
    }
    res.render("campgrounds/edit", { campground: foundCampground });
}));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to view that page");
        res.redirect(`/campgrounds/${campground._id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated campground info");
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
}));


module.exports = router;
