package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.libs.json._
import play.api.libs.functional.syntax._
import models._
import com.mongodb.casbah.Imports._

object PhotoEdit extends Controller with Secured {

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

		val labelDeleteForm = Form(
				"name" -> nonEmptyText
		)

	def info(album:String, name:String) = withAuth{ user => implicit request =>
		val photo = Photo.findOneByName(album, name).getOrElse(Photo(album = album, name = name))
		Ok(Json.toJson(photo)).as("application/json")
	}

	def update = withAuth(parse.json) { user => implicit request =>
		request.body.validate[Photo].map{
				case p:Photo => {
					Photo.save(p)
					Ok(p.url)
				}
		}.recoverTotal{
			e => BadRequest("Detected error:"+ JsError.toFlatJson(e))
		}
	}

	def deleteLabel(album:String, label:String) = withAuth {user => implicit request =>
		labelDeleteForm.bindFromRequest.fold(
			// on validation error
			errors =>{
				Redirect(routes.Application.sheet(album, label)).flashing{
					"error" -> "error";
				}
			},
			// validation OK.
			value => {
				// update
				Photo.findOneByName(album,value).foreach {
					p => Photo.save(p.copy(labels = p.labels.filter(_ != label)))
				}
				Redirect(routes.Application.sheet(album, label))
			}
		)
	}
}
