recipe_selectors = [
	'.recipe-callout',
	'.tasty-recipes',
	'.easyrecipe',
	'.innerrecipe',
	'.recipe-summary.wide', // thepioneerwoman.com
	'.wprm-recipe-container',
	'.recipe-content',
	'.simple-recipe-pro',
	'.mv-recipe-card',
	'div[itemtype="http://schema.org/Recipe"]',
	'div[itemtype="https://schema.org/Recipe"]',
]

carbon_data = {
	"Apples": 0.43,
	"Bananas": 0.86,
	"Barley": 1.18,
	"Beef": 99.48,
	"Beet Sugar": 1.81,
	"Berries": 1.53,
	"Grapes": 1.53,
	"Brassicas": 0.51,
	"Cane Sugar": 3.2,
	"Cassava": 1.32,
	"Cheese": 23.88,
	"Chicken": 9.87,
	"Citrus Fruit": 0.39,
	"Coffee": 28.53, 
	"Dark Chocolate": 46.65,
	"Eggs":4.67, 
	"Fish": 13.63, 
	"Groundnuts": 3.23, 
	"Lamb": 39.72,
	"Mutton": 39.72, 
	"Leeks": 0.5, 
	"Maize":1.7, 
	"Milk": 3.15, 
	"Nuts": 0.43, 
	"Oatmeal": 2.48, 
	"Onions": 0.5, 
	"Other Fruit": 1.05,
	"Other Pulses": 1.79,
	"Other Vegetables": 0.53,
	"Peas": 0.98,
	"Pork": 12.31, 
	"Potatoes": 0.46,
	"Poultry Meat": 9.87,
	"Shrimp": 26.87,
	"Rice": 4.45,
	"Root Vegetables": 0.43,
	"Soy milk": 0.98,
	"Tofu": 3.16,
	"Tomatoes": 2.09,
	"Wheat": 1.57,
	"Rye": 1.57,
	"Wine": 1.79
}

const closeButton = document.createElement('button');
closeButton.id = '_rf_closebtn';
closeButton.classList.add('_rfbtn');
closeButton.textContent = 'close recipe';

const disableButton = document.createElement('button');
disableButton.id = '_rf_disablebtn';
disableButton.classList.add('_rfbtn');
disableButton.textContent = 'disable on this site';

const myText = document.createElement('span');
myText.classList.add('_list');
myText.textContent = 'Hello';

const controls = document.createElement('div');
controls.id  = '_rf_header';
controls.appendChild(closeButton);
controls.appendChild(document.createTextNode('Recipe Filter'));
controls.appendChild(disableButton);
controls.appendChild(myText);

function hidePopup(){
	let highlight = document.getElementById('_rf_highlight');
	highlight.style.transition = 'opacity 400ms';
	highlight.style.opacity = 0;

	setTimeout(function() {
		highlight.parentNode.removeChild(highlight);
	}, 400);
}

function showPopup(){
	recipe_selectors.every(function(s){
		let original = document.querySelector(s);
		if (original){
			// clone the matched element
			let clone = original.cloneNode(true);
			clone.id = '_rf_highlight';
			// add some control buttons
			clone.prepend(controls);
			clone.style.transition = 'opacity 500ms';
			clone.style.display = 'block';
			clone.style.opacity = 0;
			let ingredients = clone.querySelector('.wprm-recipe-ingredients');
			if (ingredients) {
			  let ingredientList = document.createElement('ul');
			  ingredientList.classList.add('ingredient-list');
	  
			  let ingredientItems = ingredients.querySelectorAll('.wprm-recipe-ingredient');
			  console.log(ingredientItems)
			  for (let i = 0; i < ingredientItems.length; i++) {
				let ingredientName = ingredientItems[i].querySelector('.wprm-recipe-ingredient-name');
				console.log(ingredientName)
				if (ingredientName) {
				  let li = document.createElement('li');
				  li.textContent = ingredientName.textContent;
				  ingredientList.appendChild(li);
				}
			  }
			}

			document.body.insertBefore(clone, document.body.firstChild);

			// handle the two new buttons we attached to the popup
			closeButton.addEventListener('click', hidePopup);
			disableButton.addEventListener('click', function(b){
				chrome.storage.sync.set({[document.location.hostname]: true}, hidePopup);
			});

			// add an event listener for clicking outside the recipe to close it
			let mouseUpHide = function(e) {
				if (e.target !== clone && !clone.contains(e.target) && event.target.type !== 'submit')
				{
						hidePopup();
						document.removeEventListener('mouseup', mouseUpHide);
				}
			};
			document.addEventListener('mouseup', mouseUpHide);

			window.setTimeout(() => {
				// fade in
				clone.style.opacity = 1;

				// scroll to top in case they hit refresh while lower in page
				document.scrollingElement.scrollTop = 0;
			}, 10);

			// it worked, stop iterating through recipe_selectors
			return false;
		}
		return true;
	});
}

// check the blacklist to see if we should run on this site
chrome.storage.sync.get(document.location.hostname, function(items) {
	if (!(document.location.hostname in items)) {
		showPopup();
	}
});
