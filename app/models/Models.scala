package models

import play.api.Play.current

import com.novus.salat._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import se.radley.plugin.salat._
import com.mongodb.casbah.commons.MongoDBObject
import mongoContext._


object Label extends ModelCompanion[Label, String] {
  val dao = new SalatDAO[Label, String](collection = mongoCollection("label")) {}
  def findSortedAll = findAll.toList.sortBy(_.id);
  def updateName(label:Label) = dao.update(MongoDBObject("_id" -> label.id),
      MongoDBObject("name" -> label.name), false, false)
}

object Photo extends ModelCompanion[Photo, ObjectId] {
  val dao = new SalatDAO[Photo, ObjectId](collection = mongoCollection("photo")) {}
}

case class Photo(@Key("_id")id:ObjectId = new ObjectId,
	url:String,
	name:String,
	labelkeys:Seq[String] = Seq(),
	etc:Int = 0,
	comment:String = "",
	noDisp:Boolean = false) {

	def count = labelkeys.size + etc
}

case class Label(@Key("_id")id:String, name:String);
