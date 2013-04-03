import play.api._
import models._

object Global extends GlobalSettings {

  override def onStart(app: Application) {
  	 // set initial data for Mongo
  	 val labels = List(Label("A", "A"),
  	 		Label("B", "B"),
  	 		Label("C", "C"),
  	 		Label("D", "D"),
  	 		Label("E", "E"),
  	 		Label("F", "F"),
  	 		Label("G", "G"),
  	 		Label("H", "H"))

  	 for (label <- labels) {
  	 	Label.findOneById(label.id) match {
  	 		case None => Label.save(label)
  	 		case Some(_) => Unit
  	 	}
  	 }
  	 
  	 // set uniqueIndex to Photo collection
  	 Photo.uniqueIndex()
  }  
  
    
}