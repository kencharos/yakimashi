package controllers

import play.api._
import play.api.mvc._
import model._

object LabelEdit extends Controller {

  def info = Action {

  	Ok(views.html.label(Label.findAll.toList.sortWith(_.key < _.key)))

  }

  def update = TODO
}