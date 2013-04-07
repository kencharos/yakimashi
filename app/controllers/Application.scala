package controllers

import play.api._
import play.api.mvc._
import models._
import java.io.File
import com.drew.imaging._;
import com.drew.metadata.exif.ExifSubIFDDirectory

object Application extends Controller {

  def albums = Action {
  	val files = new File("public/album").listFiles();

  	Ok(views.html.albums(files.filter(_ isDirectory).map(_ getName)));

  }

  def photo(album:String) = Action {
  	var images = new File("public/album", album).listFiles().filter(_ isFile).sortBy(_ getName)

  	def exifTime(f:File) = {
  	  try {
  		  val meta = ImageMetadataReader.readMetadata(f);
        val date = meta.getDirectory(classOf[ExifSubIFDDirectory]).getDate(
            ExifSubIFDDirectory.TAG_DATETIME_ORIGINAL);
        if (date == null) {
          None
        } else {
          Some(date)
        }
  	  } catch {
  	    case e => None
  	  }
  	}

  	val photos = images.map(f =>
  	    Photo.findOneByName(album, f.getName) match {
  	      case None => (Photo(album = album, name = f.getName), exifTime(f))
  	      case Some(p) => (p, exifTime(f))
  	    }
  	  )
	  Ok(views.html.photo(album, photos, Label.findSortedAll))
  }

  def sheet(album:String, label:String) = Action{
    Ok(views.html.sheet(album, Photo.findByLabel(album, label), Label.findOneById(label).get, Label.findSortedAll))

  }
}