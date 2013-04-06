package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import models._

import com.mongodb.casbah.Imports._

object PhotoEdit extends Controller {

	// Json - class transration
	// To convert String - ObjectId, set custom constractor
	implicit val photoFormat = (
	    (__ \ "id").format[String] and
	    (__ \ "album").format[String] and
	    (__ \ "name").format[String] and
	    (__ \ "labels").format[Seq[String]] and
	    (__ \ "etc").format[Int] and
	    (__ \ "comment").format[String] and
	    (__ \ "noDisp").format[Boolean]
  	)(
  		(id, album, name, labels, etc, comment, noDisp)
			=> Photo(new ObjectId(id), album, name, labels, etc, comment, noDisp)
		,unlift((p:Photo) => Some(p.id.toStringMongod, p.album, p.name, p.labels, p.etc, p.comment, p.noDisp))
	)



	def info(album:String, name:String) = Action {
		val photo = Photo.findOneByName(album, name).getOrElse(Photo(album = album, name = name))
		Ok(Json.toJson(photo)).as("application/json")
	}

	def update = Action { request =>
    	request.body.asJson.map { json =>
			json.validate[Photo].map{
 				case p:Photo => {
 					Photo.save(p)
 					Ok(p.url)
 				}
			}.recoverTotal{
				e => BadRequest("Detected error:"+ JsError.toFlatJson(e))
			}
		}.getOrElse {
			BadRequest("Expecting Json data")
		}
	}
}