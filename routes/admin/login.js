const router = require('koa-router')();
const tools = require('../../module/tools.js');
const DB = require('../../module/db.js');
const svgCaptcha = require('svg-captcha');

router.get('/',async (ctx) =>{
  await ctx.render('./admin/login');
})

router.post('/doLogin',async (ctx) =>{
  console.log(ctx.request.body)

  //验证用户名密码是否合法
  let username = ctx.request.body.username;
  let password = ctx.request.body.password;
  let verifyCode = ctx.request.body.code;

  if(verifyCode.toLowerCase() === ctx.session.code.toLowerCase()){
    //后台也要验证用户名或密码是否有问题

    //去数据库匹配
    const result = await DB.find('administrator',{"username":username,"password":tools.md5(password)});

    // 成功以后把用户信息写入session
    if(result.length>0){
      ctx.session.userInfo = result[0];
      console.log(result[0])
      ctx.redirect(ctx.state.__ROOT__+'/admin')
      //更新用户表，修改用户登录的时间
      await DB.update('administrator',{"_id":result[0]._id},{
        lastLoginTime: new Date()
      })

    }else{
      ctx.render('admin/error',{
        message:'用户名或密码错误',
        redirect:ctx.state.__ROOT__+'/admin/login'
      })
    }
  }else{
    ctx.render('admin/error',{
      message:'验证码错误',
      redirect:ctx.state.__ROOT__+'/admin/login'
    })
  }  
})

/** 验证码*/
router.get('/code',async (ctx) =>{
  const captcha = svgCaptcha.create({
    size:4,
    fontSize: 50,
    width: 120,
    height:34,
    background:"#cc9966"
    });  
  ctx.session.code = captcha.text;
  ctx.response.type = 'image/svg+xml';
  ctx.body = captcha.data;
})

router.get('/logout',async (ctx)=>{
  ctx.session.userInfo = null;
  ctx.redirect(ctx.state.__ROOT__+'/admin/login')
})

module.exports = router.routes();