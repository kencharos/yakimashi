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

  def findOneByName(album:String, name:String) = dao.findOne(
      MongoDBObject("album" -> album, "name" -> name))

   def findByLabel(album:String, label:String) = dao.find(
      MongoDBObject("album" -> album, "noDisp" -> false, "labels" -> label))
      .sort(MongoDBObject("name" -> 1))
      .toList

  def uniqueIndex() = mongoCollection("photo").ensureIndex(
      MongoDBObject("album" -> 1, "name" -> 1), MongoDBObject("unique" -> true))
}

object User extends ModelCompanion[User, String] {
  val dao = new SalatDAO[User, String](collection = mongoCollection("user")) {}
}

case class User(@(Key)("_id")user:String, passwordHash:String)

case class Photo(@Key("_id")id:ObjectId = new ObjectId,
	album:String,
	name:String,
	labels:Seq[String] = Seq(),
	etc:Int = 0,
	comment:String = "",
	noDisp:Boolean = false) {
	
	def count = labels.size + etc
	def url = "album/" + album + "/" + name
}

case class Label(@Key("_id")id:String, name:String);


