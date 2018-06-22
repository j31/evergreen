## To Use
- Clone, cd new-project, npm install
- git remote set-url origin https://github.com/USERNAME/REPOSITORY.git
- git remote -v   to verify new remotes
- Give Mongo DBNAME in .env
- jQuery, Bootstrap CDNs are included by default in layout.hbs
- Modify or remove navbar & footer partials
- Seeds.js creates user: admin (login:admin)
- Example /admin page is protected with isAdmin custom middleware
- Example /protected page is protected with ensureLoggedIn()

## Notes
- Added isAdmin to user model
- Added ensure-logged-in to package.json
- Added middleware folder, and isAdmin authorization middlware
- Added seeds.js to create admin user
- Update hoek package to v5
- Updated to .connection.openUri to avoid Mongo deprication error
- Added config folder and consolidated passport configs
- Added jQuery and Bootstrap CDN in layout.hbs
- Added middleware to pass username to locals
- Added partials folder and registered in app.js
- Added bootstrap Navbar partial, and simple footer partial
- Changed Auth routes to root
- Public asset folders renamed to: img, css, js
- Removed locals.title to avoid .title conflict
- Fixed a few typos: login link, removed role: "teacher" param, etc..
 
 ## Dev
 - npm run dev
 - node bin/seeds.js
 - http://localhost:3000/

 ## Heroku
 - create new PROJECTNAME
 - heroku git:remote -a PROJECTNAME
 - git push heroku master
 - heroku addons:create mongolab:sandbox
 - https://PROJECTNAME.herokuapp.com/


