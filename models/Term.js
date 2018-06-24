const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const termSchema = new Schema({
  term: {type: String, required: true, unique: true}, 
  def: {type: String},
  cat: {type: String, required: true},
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Term = mongoose.model('Term', termSchema);
module.exports = Term;


// const categories = [
//   { category: "Proverbs",  imgFileName: "cat_proverbs.jpg"     },
//   { category: "Mythology", imgFileName: "cat_mythology.jpg"   },
//   { category: "Geography", imgFileName: "cat_geography.jpg"    },
//   { category: "Technology",imgFileName: "cat_technology.jpg"   },
//   { category: "Fine Arts", imgFileName: "cat_fine_arts.jpg"    },
//   { category: "Philosophy",imgFileName: "cat_philosophy.jpg"   },
//   { category: "Literature",imgFileName: "cat_literature.jpg"   },
//   { category: "Life Sciences",    imgFileName: "cat_life_science.jpg"},
//   { category: "Medicine & Health",imgFileName: "cat_medicine.png"        },
//   { category: "Politics",         imgFileName: "cat_politics.jpg"     },
//   { category: "Religion",         imgFileName: "cat_religion.jpg"     },
//   { category: "Modern History",   imgFileName: "cat_mod_history.jpg"  },
//   { category: "Business & Economics", imgFileName: "cat_business.jpg"     },
//   { category: "Classical Music",      imgFileName: "cat_clas_music.jpg"   },
//   { category: "Cont. History",        imgFileName: "cat_cont_history.jpg" },
//   { category: "Pre-modern History",   imgFileName: "cat_pre_mod_history.jpg" },
//   { category: "Physical Sciences",    imgFileName: "cat_phys_science.jpg"    },
//   { category: "Social Sciences",      imgFileName: "cat_social_science.jpg"  },
//   { category: "Earth Sciences",       imgFileName: "cat_earth_science.jpg"   },
// ]