package controllers

import play.api._
import play.api.mvc._
import models._
import java.io.File;

object Application extends Controller {

  def albums = Action {
  	val files = new File("public/album").listFiles();

  	Ok(views.html.albums(files.filter(_ isDirectory).map(_ getName)));
    
  }
  
  def photo(name:String) = Action {
  	var images = new File("public/album", name).listFiles().filter(_ isFile)
  	val photos = images.map(f => Photo(url = "album/" + name + "/" + f.getName, name = f.getName))
	  Ok(views.html.photo(name, photos))
  }
}