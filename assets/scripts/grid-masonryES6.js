const addColour = function() {
	// Get all item class objects in one list
	var allItems = document.getElementsByClassName("masonry-item");

	var colourClasses = [
		"masonry-item--purple",
		"masonry-item--yellow",
		"masonry-item--blue",
		"masonry-item--green",
		"masonry-item--white",
		"masonry-item--light-purple",
		"masonry-item--blue",
		"masonry-item--green",
		"masonry-item--yellow",
	];

	for (var i = 0; i < allItems.length; i++) {
		if (i >= colourClasses.length) {
			allItems[i].classList.add(colourClasses[i - colourClasses.length]);
		} else {
			allItems[i].classList.add(colourClasses[i]);
		}
	}
};

//get the masonry grid element
var grid = document.getElementsByClassName("masonry")[0]
//create a masonry instance using the grid and masonry item class
var masnry = new Masonry(grid, {
  //options
  itemSelector: '.masonry-item',
  percentPosition: true
  // fitWidth: true
});

//Refreshes the layout of the masonry grid
const reLayout = function() {
  masnry.layout();
}

/* Resize all the grid items on the orientationchange, load and resize events */
var previousOrientation = window.orientation;
const checkOrientation = function() {
	if (window.orientation !== previousOrientation) {
		previousOrientation = window.orientation;
		setTimeout(reLayout, 1000);
	}
};
window.addEventListener("orientationchange", checkOrientation);

//relayout items on these events
var masonryEvents = ["load", "resize"];
masonryEvents.forEach(function (event) {
	window.addEventListener(event, reLayout);
});

//if grid is the testimonial grid, then add colours
if (
	!document
		.getElementsByClassName("masonry")[0]
		.classList.contains("masonry-col--2")
) {
	addColour();
}
