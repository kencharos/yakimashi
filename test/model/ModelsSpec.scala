package model

import org.specs2.mutable.Specification
import play.api.test._
import play.api.test.Helpers._

class ModelsSpec extends Specification {

  "Label" should {

    "if 2 record in db, can select record" in {
      running(FakeApplication()) {
    	  // set up
         Label.findAll.foreach( Label.remove(_))
         println("delete")
	     Label.save(Label("A","Aname"))
	     Label.save(Label("B","Bname"))

	     val all = Label.findAll.toList
	     val a = Label.findOneById("A")
	     val b = Label.findOneById("B")
	     all.size must equalTo(2)
	     a.get must equalTo(all(0))
	     b.get must equalTo(all(1))

         // tear down
         Label.findAll.foreach( Label.remove(_))
      }
    }

  }

}