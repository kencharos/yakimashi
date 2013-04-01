package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import model._

object LabelEdit extends Controller {

  val labelForm = Form(
    "labels" -> seq (
      mapping(
        "id" -> text ,
        "name" -> nonEmptyText)(Label.apply)(Label.unapply)))

  def info = Action {
    
    Ok(views.html.label(labelForm.fill(Label.findSortedAll)))

  }

  def update = Action { implicit request =>
    labelForm.bindFromRequest.fold(
      // on validation error
      errors => BadRequest(views.html.label(errors)),
      // validation OK.
      labels => {
      	// update name
      	labels.foreach(Label.updateName(_))
      	Ok(views.html.label(labelForm.fill(labels)))
      }
    )

  }
}