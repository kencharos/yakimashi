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

  def photo(album:String) = Action {
  	var images = new File("public/album", album).listFiles().filter(_ isFile)
  	val photos = images.map(f =>
  	    Photo.findOneByName(album, f.getName) match {
  	      case None => Photo(album = album, name = f.getName)
  	      case Some(p) => p
  	    }
  	  )
	  Ok(views.html.photo(album, photos, Label.findSortedAll))
  }
}