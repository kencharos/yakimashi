package controllers

import play.api._
import play.api.mvc._
import play.api.data._
import play.api.data.Forms._
import models._

object PhotoEdit extends Controller {

	val photoForm = (
    "labels" -> seq (
      mapping(
        "id" -> text ,
        "name" -> nonEmptyText)(Label.apply)(Label.unapply)))

	def info(album:String, name:String) = TODO

	def update = TODO


}