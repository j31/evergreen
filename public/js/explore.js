// Wait for DOM to load
$(document).ready(function() {
 

 // Get dictionary terms passed to view, and convert back to object
 var dataFromView = $('#dictionary_data').html();
 var dictionary = JSON.parse(dataFromView);
 
 var dataFromView = $('#username_data').html();
 var username = JSON.parse(dataFromView);
 
 var dataFromView = $('#userk_data').html();
 var userk = JSON.parse(dataFromView);
 var knowledge = userk[0].knowledge; 
 
 
 ///// START OF DATA
 
 // Seed data for categories
 var categoriesEnum = [
  { _id: 0, group: "Writings", category: "Sayings", imgFileName: "cat_proverbs.jpg"     },
  { _id: 1, group: "Writings", category: "Mythology", imgFileName: "cat_mythology.jpg"   },
  { _id: 2, group: "Writings", category: "Philosophy", imgFileName: "cat_philosophy.jpg"   },
  { _id: 3, group: "Writings", category: "Literature", imgFileName: "cat_literature.jpg"   },
  { _id: 4, group: "Writings", category: "Religion", imgFileName: "cat_religion.jpg"     },

  { _id: 5, group: "World", category: "Geography", imgFileName: "cat_geography.jpg"    },
  { _id: 6, group: "World", category: "Politics",  imgFileName: "cat_politics.jpg"     },
  { _id: 7, group: "World", category: "Modern History", imgFileName: "cat_mod_history.jpg"  },
  { _id: 8, group: "World", category: "Cont. History",   imgFileName: "cat_cont_history.jpg" },
  { _id: 9, group: "World", category: "Pre-modern History",  imgFileName: "cat_pre_mod_history.jpg" },
  { _id: 10, group: "World", category: "Business & Economics", imgFileName: "cat_business.jpg"     },

  { _id: 11, group: "Sciences", category: "Technology",  imgFileName: "cat_technology.jpg"   },
  { _id: 12, group: "Sciences", category: "Life Sciences",  imgFileName: "cat_life_science.jpg"    },
  { _id: 13, group: "Sciences", category: "Medicine and Health", imgFileName: "cat_medicine.png"        },

  { _id: 14, group: "Sciences", category: "Physical Sciences", imgFileName: "cat_phys_science.jpg"    },
  { _id: 15, group: "Sciences", category: "Social Sciences", imgFileName: "cat_social_science.jpg"  },
  { _id: 16, group: "Sciences", category: "Earth Sciences", imgFileName: "cat_earth_science.jpg"   },

  { _id: 17, group: "Arts", category: "Fine Arts",  imgFileName: "cat_fine_arts.jpg"    },
  { _id: 18, group: "Arts", category: "Classical Music", imgFileName: "cat_clas_music.jpg"   }
]
 

 
  // User class
  function User (name, knowledge) {
    this.username = name
    this.knowledge = knowledge
    this.currentCategory = ""
  };
 
  // Instantiate user
  var user = new User (username, knowledge);
 
 
  // Main application Class
  function Explore (user, dictionary) {
    this.user = user; 
    this.dict = dictionary;
    this.knowledgeTerm = {};
    this.question = "";
    this.answer = "";
  };
 
 
  // Instantiate Explore session object
  var app = new Explore (user, dictionary );
  console.log("app ", app)



  Explore.prototype.getCategoryChoices = function () {

    $("#choose-cat").removeClass("d-none")

    // Find terms with 0 strength score (not yet seen)
    var zeroStrengthTerms = knowledge.filter( t => t.strength === 0 )
    console.log("number of 0 strength terms ", zeroStrengthTerms.length)

    // Find unique categories where user has >0  "0" strength terms
    var flags = [], categoriesInDictionary = [], l = zeroStrengthTerms.length, i;
    for( i=0; i<l; i++) {
      if( flags[zeroStrengthTerms[i].cat]) continue;
      flags[zeroStrengthTerms[i].cat] = true;
      var cat = categoriesEnum.find( cat => cat.category === zeroStrengthTerms[i].cat )
      categoriesInDictionary.push(cat);
    }
    console.log("number categories with 0 strength terms ", categoriesInDictionary.length)



    // INJECT CATEGORY CARDS (when they have terms in dictinary)
    var html = '<div class="row justify-content-center">'
    for (i in categoriesInDictionary) {
      html += '<div class="col-xs-6"><div class="card cat-card" style="width: 9rem;"><img class="card-img-top" src="../img/categories/' + categoriesInDictionary[i].imgFileName + '" alt="Card image cap"><div class="card-body"><h6 class="card-title">' + categoriesInDictionary[i].category + '</h6><button type="button" class="btn btn-link cat-card-link" id="'+categoriesInDictionary[i]._id+'">Explore</button></div></div></div>'
    };
    html += '</div>'
    $('#cat-cards').html(html)


    $(".cat-card-link").click(function() {
      var catId = this.id
      var newCat = categoriesEnum.find( cat => cat._id == catId )
      app.user.currentCategory = newCat
      console.log("NEW CATEGORY PICKED", newCat);
      $("#choose-cat").addClass("d-none")
      app.showQuickScanTerms();
    }); 
  }



  Explore.prototype.showQuickScanTerms = function () {


    $("#display-terms").removeClass("d-none")

    // Find user's terms with 0 strength score (not yet seen)
    var zeroStrengthTerms = knowledge.filter( t => t.strength === 0 )
    
    // Find user's zero strength terms in current category 
    var termsInCategory = zeroStrengthTerms.filter( t => t.cat === app.user.currentCategory.category )

    console.log("currentCategory ", app.user.currentCategory.category)
    console.log("number of 0 strength terms in this Category ", termsInCategory)

    // get up to 5 terms
    var l = ( termsInCategory.length > 5 ? 5 : termsInCategory.length )
    var quickScanTerms = []
    for (let i=0; i<l; i++) {
      var term = termsInCategory[i]._id
      quickScanTerms.push( app.dict.find( t => t._id == term ) )
    }
    console.log("quick scan terms from dict ", quickScanTerms)

    
    var html = '<div id="accordion">'
    for (let i=0; i < quickScanTerms.length ; i++) {
      let q = quickScanTerms[i]
      html += 
      `<div class="card" id="card${q._id}">
        <div class="card-header" id="heading${q._id}">
          <h5 class="mb-0">
            <button class="btn btn-home-sm btn-sm know-it-btn" id="${q._id}">I know it!</button> 
            <button class="btn btn-link collapsed" data-toggle="collapse" data-target="#collapse${q._id}" aria-expanded="false" aria-controls="collapse${q._id}">
            <h5>${q.term} &nbsp; <i class="fas fa-question-circle"></i></h5>
            </button>
          </h5>
        </div>
        <div id="collapse${q._id}" class="collapse" aria-labelledby="heading${q._id}" data-parent="#accordion">
          <div class="card-body">
          ${q.def}
          </div>
        </div>
      </div>`
    }
    html+= '</div>'
    $('#quickScanTerms').html(html)

    $(".know-it-btn").click(function() {
      var id = this.id
      var i = knowledge.map(function(e) { return e._id; }).indexOf(id);

      knowledge[i].strength += 1; 

      console.log("New strength is ", knowledge[i].strength )

      let cardId = "#card" + id
      $(cardId).addClass("d-none")
      console.log("cardid ", cardId)

      console.log("knowledge ", knowledge)

      axios.patch(`http://localhost:3000/knowledge/${username}`, knowledge)
      .then(response => {
        console.log("User knowledge Axios update to term, ", term)
      })
      .catch(error => {
        console.log(error)
      })

    });


  }



  

 // Start main app
 app.getCategoryChoices()
 
})
 







 