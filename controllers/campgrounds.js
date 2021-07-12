const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
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
};


module.exports.renderEditForm = async (req, res) => {
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
};


module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to view that page");
        res.redirect(`/campgrounds/${campground._id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash("success", "Successfully updated campground info");
    res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
};
