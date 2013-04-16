package controllers

import play.api._
import play.api.data._
import play.api.data.Forms._
import play.api.mvc._
import models._
import java.security.MessageDigest

object Auth extends Controller {

  val loginForm = Form(
    tuple(
      "user" -> nonEmptyText,
      "password" -> nonEmptyText
    ) verifying ("不正なユーザーもしくはパスワード", result => result match {
      case (user, password) => check(user, password)
    })
  )

  def check(user: String, password: String) = {
	 User.findOneById(user) match {
	   case Some(u) => hash(password) == u.passwordHash
	   case	None => false
	 }
  }

  def hash(str:String) = {
     val md = MessageDigest.getInstance("SHA-256");
	 md.update(str.getBytes())
	 md.digest().foldLeft("")((s, b) => s + "%02x".format(if(b < 0) b + 256 else b))
  }
  
  def login = Action { implicit request =>
    request.session.get(Security.username) match {
      case Some(_) => Redirect(routes.Application.albums)
      case None => Ok(views.html.login(loginForm))
    }
  }

  def authenticate = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => BadRequest(views.html.login(formWithErrors)),
      user => Redirect(routes.Application.albums).withSession(Security.username -> user._1)
    )
  }

  def logout = Action { implicit request =>
    Redirect(routes.Auth.login).withNewSession.flashing(
      "success" -> "ログアウトしました。"
    )
  }
}

trait Secured {

  private def username(request: RequestHeader) = request.session.get(Security.username)

  private def onUnauthorized(request: RequestHeader) = Results.Redirect(routes.Auth.login)

  /** dafault */
  def withAuth(f: => String => Request[AnyContent] => Result) = {
    Security.Authenticated(username, onUnauthorized) { user =>
      Action(request => f(user)(request))
    }
  }
   /** use bodyparser  */
  def withAuth[AnyContent](bp: BodyParser[AnyContent])(f: => String => Request[AnyContent] => Result) = {
    Security.Authenticated(username, onUnauthorized) { user =>
      Action(bp)(request => f(user)(request))
    }
  }

  /** use  exisiting Action wrapping
  def withAuth[A](action: Action[A]): Action[A] = {
    Action(action.parser) { implicit request =>
       username(request) match {
          case Some(_) => action(request)
          case None => onUnauthorized(request)
       }
    }
  }*/
}
