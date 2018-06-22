## To Use
- Fork, clone, cd new-project, npm install
- Give Mongo DBNAME in .env
- jQuery, Bootstrap CDNs are included by default in layout.hbs
- Modify or remove navbar & footer partials

## Notes
- Update hoek package to v5
- Updated to .connection.openUri to avoid Mongo deprication error
- Added config folder and consolidated passport configs
- Added jQuery and Bootstrap CDN in layout.hbs
- Added middleware to pass username to locals
- Added partials folder and registered in app.js
- Added bootstrap Navbar partial, and simple footer partial
- Changed Auth routes to root
- Public asset folders renamed to: img, css, js
- Removed locals.title to avoid .title and simplify
- Fixed a few typos: login link, removed role: "teacher" param...
 
 ## Dev
 - npm run dev
 - http://localhost:3000/

 ## Heroku
 - create new PROJECTNAME
 - heroku git:remote -a PROJECTNAME
 - git push heroku master
 - heroku addons:create mongolab:sandbox
 - https://PROJECTNAME.herokuapp.com/


