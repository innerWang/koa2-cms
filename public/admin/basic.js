
const app = {
  toggle: function (el,collectionName,attr,id) {
    $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(data){
      if(data.success){
        if(el.src.indexOf('yes') != -1){
          el.src = '/admin/images/no.gif'
        }else{
          el.src = '/admin/images/yes.gif'
        }
      }
    })
  },
  confirmDelete: function(){
    $('.delete').click(function(){
      var flag = confirm('你确定删除吗？')
      return flag;
    })
  },
  changeSort(el,collectionName,id){
    var sortValue = el.value;
    $.get('/admin/changeSort',{collectionName:collectionName,id:id,sortValue:sortValue},function(data){
      console.log(data)
    })
  }
}

app.confirmDelete()
