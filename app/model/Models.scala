package model

import play.api.Play.current

import com.novus.salat._
import com.novus.salat.annotations._
import com.novus.salat.dao._
import com.mongodb.casbah.Imports._
import se.radley.plugin.salat._
import com.mongodb.casbah.commons.MongoDBObject
import mongoContext._

case class Photo(url:String, name:String)


case class Label(@Key("_id")id:ObjectId = new ObjectId, key:String, name:String);

object Label extends ModelCompanion[Label, ObjectId] {
  val dao = new SalatDAO[Label, ObjectId](collection = mongoCollection("label")) {}

  def findOneByKey(key: String): Option[Label] 
		  = dao.findOne(MongoDBObject("key" -> key))
  
  def updateName(label:Label) = dao.update(MongoDBObject("key" -> label.key),
      MongoDBObject("name" -> label.name), false, false)
}