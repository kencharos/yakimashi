yakimashi
==========

I made this application to arrange my photos for printing.    
This application is used in LAN. So that, This application have not any functions
This application made by following framework and product.
+ Play Framework 2.1(Scala) with play-salat plug-in
+ mongoDB

example on heroku is [here](http://yakimashi.herokuapp.com/ "sample")

Usage
------
***install***  
+ Download this project.
+ Install play framework
+ Install mondoDB or get mongoDB uri(e.g, Mongo HQ)
+ modify following mongodb's property to your mongodb's uri in `conf/application.conf` 
  ` mongodb.default.uri="mongodb://127.0.0.1:27017/yakimashi" `
+ save test user your mongodb user collection.(password is SHA-256 hash. this example hash is "test" )
  ` db.user.save({{ _id:"test", passwordHash:"9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" }})`
+ `$ play run`
+ Open `http://localhost:9000` and login test/test.

***Add album***
+ add directory and image file to `public/album`.

License
----------
Distributed under the [MIT License][mit].  

[MIT]: http://www.opensource.org/licenses/mit-license.php