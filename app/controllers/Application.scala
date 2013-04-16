package controllers

import play.api._
import play.api.mvc._
import models._
import java.io.File
import com.drew.imaging._;
import com.drew.metadata.exif.ExifSubIFDDirectory

object Application extends Controller with Secured {
  
  def secureAt(path:String, file:String) = withAuth{user =>
    Assets.at(path, file).apply
  }
  
  def albums = withAuth { user => implicit request => 
  	val files = new File("public/album").listFiles();

  	Ok(views.html.albums(files.filter(_ isDirectory).map(_ getName).sorted));

  }

  def photo(album:String) = withAuth { user => implicit request => 
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

  def sheet(album:String, label:String) = withAuth{ user => implicit request =>
    Ok(views.html.sheet(album, Photo.findByLabel(album, label), Label.findOneById(label).get, Label.findSortedAll))

  }
}