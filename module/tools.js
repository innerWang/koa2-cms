const md5 = require('md5');


let tools={
  md5(str){
    return md5(str);
  },
  classifyToList(data){
    //获取一级分类
    let firstLevelArr = [];
    for(let i=0;i<data.length;i++){
      if(data[i].pid === '0' ){
        firstLevelArr.push(data[i]);
      }
    }

    // 获取二级分类
    for(let i=0;i<firstLevelArr.length;i++){
      firstLevelArr[i].list = [];
      //遍历所有的数据，看谁的pid===_id，则属于_id的子分类
      for(let j=0;j<data.length;j++){
        if(firstLevelArr[i]._id == data[j].pid){
          firstLevelArr[i].list.push(data[j])
        }
      }
    }
    return firstLevelArr;
  }
}


module.exports = tools;