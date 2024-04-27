require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/***Get
 * homepage
 * 
 */
exports.homepage = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error should be removed ..*/
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(limitNumber);
    const indian = await Recipe.find({ 'category': 'Indian' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    const spanish = await Recipe.find({ 'category': 'Spanish' }).limit(limitNumber);



    const food = { latest, thai, american, mexican, indian, chinese, spanish };




    res.render('index', { titile: 'Solo-Chef:Your culinary companion', categories, food });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}
/***Get
 *  Categories
 * 
 */
exports.exploreCategories = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render('categories', { titile: 'Solo-Chef:Categories', categories });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}


/***Get
 *  Categories/:id
 * 
 */
exports.exploreCategoriesById = async (req, res) => {
  try {

    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);

    res.render('categories', { titile: 'Solo-Chef:Categories', categoryById });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}


/***Get/recipe:id
 *  recipe
 * 
 */
exports.exploreRecipe = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render('recipe', { titile: 'Solo-Chef:Recipe', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}
/***post/search
 *  Search
 * 
 */
exports.searchRecipe = async (req, res) => {
  //searchTerm
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { titile: 'Solo-Chef:Search', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }


}


/***Get/exploreLatest
 *  exploreLatest
 * 
 */
exports.exploreLatest = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);

    res.render('explore-latest', { titile: 'Solo-Chef:Explore Latest', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}



/***Get/exploreRandom
 *  exploreRandom
 * 
 */
exports.exploreRandom = async (req, res) => {

  /*res.render('index', {title: 'Solo-Chef:Homepage'}); this was causing error shoukd be removed ..*/
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { titile: 'Solo-Chef:Explore Random', recipe });

  }
  catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });


  }

}




/***Get/Create-recipe
 *  submitRecipe
 * 
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash('InfoErrors');
  const infoSubmitObj = req.flash('InfoSubmit');
  res.render('submit-recipe', { titile: 'Solo-Chef:Submit Recipe', infoErrorsObj, infoSubmitObj });

}



/***Get/Create-recipe/post
 *  submitRecipe
 * 
 */
exports.submitRecipeOnPost = async (req, res) => {

  try {

    let imageUploadfile;
    let uploadPath;
    let newImageName;
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log('No files where uploaded');
    }
     else {
      imageUploadfile = req.files.image;
      newImageName = Date.now() + imageUploadfile.name;
      uploadPath = require('path').resolve('./') + '/public/img/' + newImageName;
      imageUploadfile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      })
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      cookingtime: req.body.cookingtime,
      ingredients: req.body.ingredients,
      instruction: req.body.instruction,
      category: req.body.category,
      image: newImageName

    });
    await newRecipe.save();

// + <% recipe._id %>

    req.flash('InfoSubmit', 'Recipe has been added.');

    res.redirect('/submit-recipe');
  }

  catch (error) {
    //res.json(error);
    req.flash('InfoErrors', error);
    res.redirect('/submit-recipe');

  }

}
//this function is to update the recipes from here
// async function updateRecipe(){ //ctr+K+C for comment
//   try{
//     const res=await Recipe.updateOne({name:'Chicken Fried Rice'},{name:'Chicken Rice'});
//     res.n;//number of documents mathch
//     res.nModified;//number of documents modified
//   }catch(error){
//      console.log(error);
//   }
// }
// updateRecipe();

//this function is to delete a recipe  uncomment ctrl+K+U

// async function deleteRecipe(){ //ctr+K+C for comment  ... ctrl+K+U for uncomment
//   try{
//     const res=await Recipe.deleteOne({name:'tyuio'});
//   }catch(error){
//      console.log(error);
//   }
// }
// deleteRecipe();







































/***
 * async function insertDymmmyRecipeData() {
  try {
    await Recipe.insertMany([
      {
        "name": "Hamburger",
        "cookingtime": "30 mins",
        "ingredients": [
          "1 red onion",
          "2 teaspoons cider vinegar",
          "600 g mixed leftover roast veg",
          "potatoes, swede, parsnips",
          "carrots, sprouts",
          "280 g higher-welfare cooked ham",
          "2 tablespoons unsalted butter",
          "1 tablespoon olive oil",
          "4 English muffins or rolls",
          "1 handful of lettuce leaves, such as baby cos, frisée",
          "ketchup , optional"
        ],
        "instruction": `Peel and slice the onion, then place in a small bowl. Cover with the vinegar and set aside.
        Mash all the veg well with a potato masher, then shred add the ham and season generously. Mix together well, then shape into 4 burgers and chill in the fridge to firm up, until ready to use.
        Heat the butter and oil in a large frying pan over a medium heat and cook the burgers, in batches if needed, for 3 to 5 minutes each side or until crisping up and turning golden brown.
        To serve, slice the muffins or burger rolls in half and fill with the bubble and squeak hamburgers, pickled red onion, lettuce and ketchup, if desired.`,
        "category": "American",
        "image": "hamburger.jpg",
        "video": "https://www.youtube.com/watch?v=vvDpD0atnfo"
      },
      {
        "name": "BBQ chicken",
        "cookingtime": "45 mins",
        "ingredients": [
          "75 ml tomato ketchup",
          "2 tablespoons runny honey",
          "1 tablespoon Worcestershire sauce",
          "1 teaspoon smoked paprika",
          "6 chicken thighs , bone in, skin on",
          "1.2 kg potatoes",
          "olive oil",
          "750 g frozen corn on the cob",
          "250 g red cabbage",
          "150 g carrots",
          "1 onion",
          "100 g natural yoghurt"
        ],
        "instruction": `Preheat the oven to 190°C/375°F/gas 5. Place the ketchup, honey, Worcestershire sauce, most of the smoked paprika and 1 tablespoon of red wine vinegar in a snug-fitting roasting tray and mix together. Add the chicken and toss to coat. At this point, you can either leave the tray covered in the fridge to marinate, or season with a pinch of sea salt and black pepper and set aside while you prep the potatoes.
        Scrub and quarter the potatoes lengthways and place in another large roasting tray. Drizzle in 2 tablespoons of olive oil, season and sprinkle over a pinch of smoked paprika, tossing until coated. Arrange the potatoes skin-side down in one even layer. Place the potato tray on the middle shelf of the oven and the chicken tray on the top shelf to roast for 20 minutes.
        Once the time’s up, carefully spoon off any fat from the chicken and add to the potatoes, tossing to coat. Baste the chicken in the remaining juices, scraping up any sticky bits from the bottom of the tray. Return both trays to the oven to roast for a further 25 minutes or until the chicken pulls away easily from the bone, placing the frozen corn straight onto the bars of the bottom shelf to cook alongside.
        Meanwhile, trim the cabbage and carrots, and peel the onion. Coarsely grate it all on a box grater. Place in a bowl with ½ a tablespoon of red wine vinegar, 1 tablespoon of oil and the yoghurt. Mix together and season to perfection.
        Serve the chicken and potatoes alongside the slaw, rolling the corn in all the lovely chicken tray juices before plating up.`,
        "category": "American",
        "image": "bbq.jpg"
      },
      {
        "name": "Macaroni and Cheese",
        "cookingtime": "45 mins",
        "ingredients": [
          "500 g quality macaroni",
          "olive oil",
          "½ a bunch of fresh marjoram or oregano (15g) , leaves picked",
          "75 g Parmesan cheese , freshly grated, plus extra for grating",
          "75 g fontina or Taleggio cheese , roughly torn",
          "75 g mascarpone cheese",
          "1 whole nutmeg , for grating",
          "1 small ball buffalo mozzarella cheese"
        ],
        "instruction": `Preheat your oven to 200ºC/400ºF/gas 6.
        Cook the macaroni in a pan of salted boiling water 2 minutes short of the timing on the packet instructions, then drain in a colander and reserve a little of the cooking water.
        Heat the oil in a large heavy-based frying pan, add the marjoram or oregano and fry for a minute until it starts to crisp up, then turn off the heat.
        Add your cooked pasta to the marjoram or oregano butter, along with a couple of spoonfuls of the reserved cooking water and the Parmesan, fontina or Taleggio and mascarpone.
        Return to a medium heat and toss and stir around until most of the cheese has melted and you have a lovely gooey sauce – you may need to add a little more of the reserved cooking water.
        Season to taste with sea salt and black pepper, then tip it all into an earthenware dish. Grate over a quarter of the nutmeg, tear over the mozzarella and sprinkle over the extra Parmesan.
        Bake the macaroni cheese in the preheated oven for about 10 minutes, finishing up with a quick whack under the grill, until golden brown and crispy on top.`,
        "category": "American",
        "image": "macaroni_cheese.jpg"
      },
      {
        "name": "Butter Chicken",
        "cookingtime": "1 hr",
        "ingredients": [
          "1 kg chicken, cut into pieces",
          "1 cup plain yogurt",
          "2 tablespoons lemon juice",
          "1 tablespoon garam masala",
          "1 tablespoon ground turmeric",
          "2 teaspoons chili powder",
          "2 teaspoons ground cumin",
          "1 tablespoon grated fresh ginger",
          "4 cloves garlic, minced",
          "1/4 cup butter",
          "1 large onion, finely chopped",
          "1 cup tomato puree",
          "1 cup heavy cream",
          "Salt to taste",
          "Fresh cilantro leaves for garnish"
        ],
        "instruction": `1. Marinate the Chicken:
        - In a large bowl, combine plain yogurt, lemon juice, garam masala, ground turmeric, chili powder, ground cumin, grated fresh ginger, and minced garlic.
        - Add the chicken pieces to the marinade, ensuring they are well coated. Cover the bowl and refrigerate for at least 1 hour, or preferably overnight. This allows the flavors to infuse into the chicken.
     2. Prepare the Sauce:
        - In a large skillet or pan, melt butter over medium heat.
        - Add finely chopped onion to the skillet and cook until it turns soft and translucent.
     3. Cook the Chicken:
        - Once the onion is cooked, add the marinated chicken along with the marinade to the skillet.
        - Cook the chicken until it is browned on all sides, stirring occasionally. 
     4. Simmer with Tomato Puree:
        - Stir in tomato puree, ensuring it is well combined with the chicken.
        - Reduce the heat to low and let the mixture simmer for about 20 minutes, allowing the flavors to meld together and the chicken to cook through. Stir occasionally to prevent sticking. 
     5. Finish with Cream:
        - Pour in heavy cream, stirring well to incorporate it into the sauce.
        - Allow the mixture to simmer for an additional 5 minutes, ensuring it thickens slightly.  
     6. Season and Garnish:
        - Taste the sauce and season with salt, adjusting to your preference.
        - Garnish the dish with fresh cilantro leaves before serving, adding a burst of freshness and color.   
     7. Serve:
        - Indian Butter Chicken is traditionally served hot.
        - Accompany it with steamed rice, naan bread, or your favorite Indian side dishes for a complete and satisfying meal.   
     8. Enjoy:
        - Dive into the rich and creamy flavors of this classic Indian dish, savoring each bite filled with tender chicken and aromatic spices.`,
        "category": "Indian",
        "image": "butter_chicken.jpg"
      },
      {
        "name": "Chicken Biryani",
        "cookingtime": "45 mins",
        "ingredients": [
          "500 grams chicken, cut into pieces",
          "2 cups basmati rice, washed and soaked for 30 minutes",
          "1 large onion, thinly sliced",
          "1/2 cup plain yogurt",
          "2 tomatoes, chopped",
          "2 tablespoons ginger-garlic paste",
          "1/4 cup chopped fresh coriander leaves (cilantro)",
          "1/4 cup chopped fresh mint leaves",
          "2 green chilies, slit lengthwise",
          "1/4 cup cooking oil or ghee (clarified butter)",
          "1 cinnamon stick",
          "3-4 green cardamom pods",
          "3-4 cloves",
          "1 bay leaf",
          "1 teaspoon cumin seeds",
          "1 teaspoon turmeric powder",
          "1 teaspoon red chili powder",
          "1 teaspoon garam masala powder",
          "Salt to taste"
        ],
        "instruction": `
        1. Marinate the Chicken:
           - In a large bowl, mix together the chicken pieces, plain yogurt, ginger-garlic paste, chopped coriander leaves, chopped mint leaves, slit green chilies, turmeric powder, red chili powder, garam masala powder, and salt. Ensure the chicken is well-coated with the marinade. Cover and refrigerate for at least 1 hour.   
        2. Prepare the Rice:
           - In a large pot, bring water to a boil. Add the soaked basmati rice along with a pinch of salt. Cook until the rice is 70% cooked. Drain the rice and set aside.       
        3. Cook the Onions:
           - In a large skillet or pan, heat cooking oil or ghee over medium heat. Add the thinly sliced onions and fry until they turn golden brown. Remove half of the fried onions and set aside for later use.  
        4. Cook the Chicken:
           - In the same skillet with the remaining fried onions, add the marinated chicken along with chopped tomatoes. Cook until the chicken is partially cooked and the tomatoes are soft.     
        5. Layer the Biryani:
           - In the skillet, spread a layer of partially cooked rice over the chicken mixture. Sprinkle some of the fried onions, cinnamon stick, green cardamom pods, cloves, bay leaf, and cumin seeds over the rice.     
        6. Add Remaining Layers:
           - Continue layering the remaining rice and fried onions over the chicken mixture. Sprinkle turmeric powder, red chili powder, and garam masala powder evenly over the top layer.      
        7. Cook the Biryani:
           - Cover the skillet with a tight-fitting lid. Reduce the heat to low and let the biryani cook for about 20-25 minutes, allowing the flavors to meld together and the rice to fully cook.  
        8. Garnish and Serve:
           - Once cooked, remove the skillet from the heat. Garnish the biryani with saffron-infused milk and additional chopped coriander leaves if desired. Let it rest for a few minutes before serving.
           - Serve the Indian-style Chicken Biryani hot with raita (yogurt sauce), salad, or your favorite side dish. Enjoy the delicious and aromatic flavors of this classic Indian dish!
        `,
        "category": "Indian",
        "image": "chicken_biryani.jpg"
      },
      {
        "name": "Thai Green Curry",
        "cookingtime": "45 mins",
        "ingredients": [
          "1 butternut squash (1.2kg)",
          "groundnut oil",
          "2x 400 g tins of light coconut milk",
          "400 g leftover cooked greens, such as Brussels sprouts",
           "Brussels tops, kale, cabbage, broccoli",
          "350 g firm silken tofu",
          "75 g unsalted peanuts",
          "sesame oil",
          "1 fresh red chilli",
          "3 limes",
          "1 teaspoon cumin seeds",
          "2 cloves garlic",
          "2 shallots",
          "5 cm piece of ginger",
          "4 lime leaves",
          "2 tablespoons fish sauce",
          "4 fresh green chillies",
          "2 tablespoons desiccated coconut",
          "1 bunch fresh coriander (30g)",
          "1 stick lemongrass"

        ],
        "instruction": `Preheat the oven to 180ºC/350ºF/gas 4.
        Wash the squash, carefully cut it in half lengthways and remove the seeds, then cut into wedges. In a roasting tray, toss with 1 tablespoon of groundnut oil and a pinch of sea salt and black pepper, then roast for around 1 hour, or until tender and golden.
        For the paste, toast the cumin seeds in a dry frying pan for 2 minutes, then tip into a food processor.
        Peel, roughly chop and add the garlic, shallots and ginger, along with the kaffir lime leaves, 2 tablespoons of groundnut oil, the fish sauce, chillies (pull off the stalks), coconut and most of the coriander (stalks and all).
        Bash the lemongrass, remove and discard the outer layer, then snap into the processor, squeeze in the lime juice and blitz into a paste, scraping down the sides halfway.Put 1 tablespoon of groundnut oil into a large casserole pan on a medium heat with the curry paste and fry for 5 minutes to get the flavours going, stirring regularly.
        Tip in the coconut milk and half a tin’s worth of water, then simmer and thicken on a low heat for 5 minutes.
        Stir in the roasted squash, roughly chop and add the leftover greens and leave to tick away on the lowest heat, then taste and season to perfection.
        Meanwhile, cube the tofu and fry in a pan on a medium- high heat with 1 tablespoon of groundnut oil for 2 minutes, or until golden.
        Crush the peanuts in a pestle and mortar and toast in the tofu pan until lightly golden.
        Serve the curry topped with the golden tofu and peanuts, drizzled with a little sesame oil. Slice the chilli and sprinkle over with the reserved coriander leaves. Serve with lime wedges, for squeezing over. Great with sticky rice.`,
        "category": "Thai",
        "image": "thai_green_curry.jpg"
      },
      {
        "name": "Tuna Mapo Tofu",
        "cookingtime": "45 mins",
        "ingredients": [
          "1 tablespoon Sichuan peppercorns",
          "190 g (6½ oz) fresh ginger , peeled",
          "190 g (6½ oz) garlic cloves , peeled",
          "10 French shallots , peeled",
          "375 g (13 oz) doubanjiang (fermented broad bean paste)",
          "300 ml (10 fl oz) grapeseed oil",
          "80 ml (2½ fl oz/1/3 cup) Shaoxing rice wine",
          "50 g (13/4 oz) caster (superfine) sugar",
          "125 ml (4 fl oz/½ cup) tamari",
          "1 tablespoon sesame oil",
          "1.8 kg (4 lb) minced (ground) yellowfin tuna , from sustainable sources",
          "200 g (7 oz) silken tofu, cut into small cubes",
          "1 bunch of spring onions (scallions) , finely sliced",
          "40 g (1½ oz/¼ cup) toasted sesame seeds",
          "1 dried red chilli , finely sliced (optional)",
          "steamed short-grain rice"
        ],
        "instruction": `Toast the Sichuan peppercorns in a dry frying pan until fragrant, then use a mortar and pestle to grind to a rough powder. Set aside.
        Place the ginger, garlic, shallots, doubanjiang and 150 ml (5 fl oz) of the grapeseed oil in a food processor and blitz to a smooth paste.
        Heat 100 ml (3½ fl oz) of the remaining grapeseed oil in a large heavy-based saucepan over a high heat. Add the paste and fry, stirring occasionally, for 8–10 minutes until dried and fragrant, then reduce the heat and simmer for a further 15 minutes, until the rawness from the vegetables has been completely cooked out. Stir in the Shaoxing wine, sugar, tamari and one-third of the ground Sichuan peppercorns, then spoon the mixture into a large bowl.  
        Wipe out the pan, add the sesame oil and remaining 2½ tablespoons of grapeseed oil and heat over a high heat. Working in two batches, add the tuna mince to the pan and fry for 2 minutes, or until the mince is coloured and has separated into individual strands, then stir through the fried paste mixture to combine.    
        To assemble the mapo tofu, return the tuna mixture to the saucepan and warm through over a low heat. Add the tofu, cover with a lid and heat for 3 minutes, then spoon into serving bowls.      
        Top with the spring onion, sesame seeds, chilli, if using, and the remaining ground Sichuan peppercorns.`,
        "category": "Chinese",
        "image": "tofu.jpg"
      },
      {
        "name": "Tacos al Pastor",
        "cookingtime": "45 mins",
        "ingredients": [
          "Thinly sliced marinated pork",
          "Corn tortillas",
          "Pineapple",
          "Onion",
          "Cilantro",
          "Lime wedges",
          "Salsa (such as salsa verde or salsa roja)",
          "Optional: radishes, avocado, or other toppings"
          
        ],
        "instruction": `The pork is typically marinated in a mixture of dried chilies, spices (such as cumin, oregano, and paprika), garlic, vinegar, and pineapple juice. The marinade infuses the meat with a combination of smoky, tangy, and spicy flavors.
        The marinated pork is then stacked onto a vertical spit, along with slices of pineapple on top. As the meat cooks, it's slowly roasted and basted with its own juices, resulting in tender, flavorful pork with caramelized edges.
        Once the pork is cooked, it's thinly sliced off the spit and served on warm corn tortillas. The tacos are typically topped with diced onion, chopped cilantro, and a squeeze of lime juice. The sweetness of the pineapple complements the savory pork, creating a perfect balance of flavors.
        Tacos al Pastor are often served with salsa on the side, allowing diners to customize the heat level to their preference. Additional toppings such as radishes, avocado, or salsa verde can also be added for extra flavor and texture.`,
        "category": "Mexican",
        "image": "tacos.jpg"
      },
      {
        "name": "Patatas Bravas",
        "cookingtime": "30 mins",
        "ingredients": [
          "4 large potatoes",
          "2 tablespoons olive oil",
          "1 teaspoon salt",
          "1/2 teaspoon paprika",
          "1/4 teaspoon black pepper",
          "1/4 cup mayonnaise",
          "2 tablespoons spicy tomato sauce",
          "1 tablespoon chopped parsley (optional, for garnish)"
        ],
        "instruction": `Preheat the oven to 425°F (220°C). Peel the potatoes and cut them into cubes. In a large bowl, toss the potato cubes with olive oil, salt, paprika, and black pepper until evenly coated. Spread the seasoned potato cubes in a single layer on a baking sheet lined with parchment paper. Bake in the preheated oven for 25-30 minutes, or until the potatoes are golden brown and crispy, flipping halfway through. While the potatoes are baking, mix the mayonnaise and spicy tomato sauce in a small bowl to make the bravas sauce. Once the potatoes are cooked, transfer them to a serving dish and drizzle with the bravas sauce. Alternatively, you can serve the sauce on the side for dipping. Garnish with chopped parsley, if desired. Serve hot and enjoy!`,
        "category": "Spanish",
        "image": "potatos.jpg"
      },
    ]);
  }
  catch (error) {
    console.log('err', +error)

  }

}
insertDymmmyRecipeData();

 */
/**
 *  async function insertDymmmyData(){
  try{
     await Category.insertMany(
      [
        {
          "name":"indian",
          "img":"img.jpd"
        },
         {
          "name":"indian",
          "img":"img.jpd"
        },
         {
          "name":"indian",
          "img":"img.jpd"
        },
      ]
     );
  }
  catch(error){
    console.log('err',+error)

  }

}
insertDymmmyData(); inside this we can create lot of category of foods
 */
