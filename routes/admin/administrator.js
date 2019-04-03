const router = require('koa-router')();
const DB = require('../../module/db.js');
const tools = require('../../module/tools.js');

router.get('/', async (ctx) => {
  const result = await DB.find('administrator', {})
  await ctx.render('admin/administrator/list', {
    list: result
  })
})

router.get('/add', async (ctx) => {
  await ctx.render('admin/administrator/add')
})

router.post('/doAdd', async (ctx) => {
  // 1. 获取表单数据
  const data = ctx.request.body;

  // 2. 验证表单数据是否合法
  const username = data.username;
  const password = data.password;
  const rpassword = data.rpassword;

  if (!/^\w{4,20}/.test(username)) {
    await ctx.render('admin/error', {
      message: '用户名不合法',
      redirect: ctx.state.__ROOT__ + '/admin/administrator/add'
    })
  } else if (password !== rpassword || password.length < 6) {
    await ctx.render('admin/error', {
      message: '密码和确认密码不一致或密码长度小于六位',
      redirect: ctx.state.__ROOT__ + '/admin/administrator/add'
    })
  } else {
    // 在数据库查询当前新建的管理员是否存在
    const result = await DB.find('administrator', {
      "username": username
    })
    if (result.length > 0) {
      await ctx.render('admin/error', {
        message: '用户名已经存在',
        redirect: ctx.state.__ROOT__ + '/admin/administrator/add'
      })
    } else {
      const addResult = await DB.insert('administrator', {
        "username": username,
        "password": tools.md5(password),
        "lastLoginTime": null,
        "status": 1
      })

      ctx.redirect(ctx.state.__ROOT__ + '/admin/administrator');
    }
  }
})

router.get('/edit', async (ctx) => {
  const id = ctx.query.id;
  const result = await DB.find('administrator', {
    '_id': DB.getObjectID(id)
  })
  await ctx.render('admin/administrator/edit', {
    result: result[0]
  })
})

router.post('/doEdit', async (ctx) => {
  const id = ctx.request.body.id;
  const password = ctx.request.body.password;
  const rpassword = ctx.request.body.rpassword;
  try {
    if (password !== '') {
      if (password !== rpassword || password.length < 6) {
        await ctx.render('admin/error', {
          message: '密码和确认密码不一致或密码长度小于六位',
          redirect: ctx.state.__ROOT__ + '/admin/administrator/edit?id=' + id
        })
      } else {
        //更新密码
        const updateResult = await DB.update('administrator', {
          "_id": DB.getObjectID(id)
        }, {
          "password": tools.md5(password)
        })
        ctx.redirect(ctx.state.__ROOT__ + '/admin/administrator');
      }
    }else{
      ctx.redirect(ctx.state.__ROOT__ + '/admin/administrator');
    }
  } catch (e) {
    console.log(e)
    await ctx.render('admin/error', {
      message: 'oh no...更新时出错了...',
      redirect: ctx.state.__ROOT__ + '/admin/administrator/edit?id=' + id
    })
  }
})

router.get('/delete', async (ctx) => {
  ctx.body = "删除管理员"
})

module.exports = router.routes();