package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {
  
  def index = Action {
    
    Ok(views.html.index("Your new application is ready."))
  }
  
  def list(name:String) = Action {
  	val list = List(name, name, name, name)
  	
  	Ok(views.html.list(list))
  }

}