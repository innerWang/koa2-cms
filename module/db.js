// DB库操作
// 通过单例和判断属性是否存在，优化数据库操作性能
// 仅有第一次find时会耗时
// 

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;

const Config = require('./config.js');


class Db{

	static getInstance(){  /*单例，解决多次实例化实例不共享的问题*/
		if(!Db.instance){
			Db.instance = new Db();
		}
		return Db.instance;
	}

	constructor(){
		this.dbClient = null; /*定义一个属性 为了放db对象 进行性能优化*/
		this.connect(); /*实例化时就连接数据库，这样可以保证在第一次查询的时候更快*/
	}

	connect(){ /*连接数据库*/
		return new Promise((resolve,reject)=>{
			if(!this.dbClient){   /*解决数据库多次连接的问题*/
				MongoClient.connect(Config.dbUrl,{ useNewUrlParser: true },(err,client)=>{
					if(err){
						reject(err);
					}else{
						this.dbClient = client.db(Config.dbName);
						resolve(this.dbClient);
					}
				})
			}else{
				resolve(this.dbClient)
			}	
		})
	}

  find(collectionName,json1={},json2={},json3){ /*查找数据*/
    // json2 用于指定返回表中的哪一列 如{title:1},则只返回_id和title这两列
    const pageNum = json3&&json3.pageNum || 1; 
    const pageSize = json3&&json3.pageSize || 10;
    const sortBy = json3 && json3.sortBy || {};
    const skipNum = (pageNum -1)*pageSize;
    
		return new Promise((resolve,reject)=>{
			this.connect().then((db)=>{
        //const result = db.collection(collectionName).find(json);
        const result = db.collection(collectionName).find(json1,json2).skip(skipNum).limit(pageSize).sort(sortBy);
				result.toArray((err,docs)=>{
					if(err){
						reject(err);
						return;
					}
					resolve(docs)
				})
			})
		})
	}

	update(collectionName,oldJson,newJson){
    return new Promise((resolve,reject)=>{
      this.connect().then( db =>{
        db.collection(collectionName).updateOne(oldJson,{
          $set: newJson
        },(err,result)=>{
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
      })
    })
	}

	insert(collectionName,json){
    return new Promise((resolve,reject)=>{
      this.connect().then(db=>{
        db.collection(collectionName).insertOne(json,(err,result)=>{
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
      })
    })
  }
  
  remove(collectionName,json){
    return new Promise((resolve,reject)=>{
      this.connect().then(db=>{
        db.collection(collectionName).removeOne(json,(err,result)=>{
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
      })
    })
  }

  getObjectID(id){ /** mongodb 里面查询_id，把字符串转换为对象*/
    return new ObjectID(id);
  }
  //统计数量
  count(collectionName,json){
    return new Promise((resolve,reject)=>{
      this.connect().then(db=>{
        const result = db.collection(collectionName).countDocuments(json)
        result.then(count=> resolve(count), err=>reject(err))
      })
    })
  }
}


module.exports = Db.getInstance();  //将实例对象暴露出来


/*
// 性能测试
var myDb = Db.getInstance();
setTimeout(()=>{
	console.time('start');
	myDb.find('user').then((docs)=>{
		//console.log(docs)
		console.timeEnd('start');
	})
},1000)

setTimeout(()=>{
	console.time('start1');
	myDb.find('user').then((docs)=>{
		//console.log(docs)
		console.timeEnd('start1');
	})
},3000)


var myDb2 = Db.getInstance();
setTimeout(()=>{
	console.time('start2');
	myDb2.find('user').then((docs)=>{
		//console.log(docs)
		console.timeEnd('start2');
	})
},5000)

setTimeout(()=>{
	console.time('start3');
	myDb2.find('user').then((docs)=>{
		//console.log(docs)
		console.timeEnd('start3');
	})
},7000)

*/






