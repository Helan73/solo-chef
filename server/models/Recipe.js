const mongoose=require('mongoose');
const recipeSchema = new mongoose.Schema({
  name:{
    type:String,
    required: 'This is required field.'
  },
  cookingtime:{
    type: String,
    required:true
  },
  ingredients: {
    type: [String],
    required: 'This is required field.'
  },
  instruction: {
    type:String,
    required: 'This is required field.'
  },
  category: {
    type: [String],
    enum: ['Indian','Spanish','Chinese','Thai','American','Mexican'],
    required: 'This is required field.'
  },
  image: {
    type:String,
    required: 'This is required field.'
  },
  video:{
    type: String,
    required:false
  },
});

recipeSchema.index({name: 'text', instruction: 'text'});
//Wildcard Indexing
module.exports=mongoose.model('Recipe', recipeSchema);