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
        "id" -> text,
        "name" -> nonEmptyText)(Label.apply)(Label.unapply)))

  def info = Action {
    
    Ok(views.html.label(labelForm.fill(Label.findAll.toList)))

  }

  def update = TODO
}