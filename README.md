## 返回数据

```nodeJs
    1. res.send('hello world')
    2. res.end()
    3. 
        res.json({
            state: 0,
            msg: '用户名或密码不正确!'
        })

```


## 用户表
```sql
create table if not exists user(
	`id` int NOT NULL auto_increment primary key,
	`username` varchar(25) NOT NULL COMMENT '用户名',
	`password` varchar(32) NOT NULL COMMENT '密码',
	`name` varchar(25) NOT NULL COMMENT '姓名',
	`alias` varchar(25) NOT NULL DEFAULT 'yanghanliang' COMMENT '别名',
	`tel` char(11) COMMENT '电话',
	`background_wall` varchar(50) NOT NULL COMMENT '背景墙',
	`head_portrait` varchar(50) NOT NULL COMMENT '头像',
	`occupation` varchar(20) NOT NULL DEFAULT 'WEB开发工程师' COMMENT '职业',
	`synopsis` varchar(255) NOT NULL COMMENT '简介'
)ENGINE=INNODB DEFAULT CHARSET=utf8;


INSERT INTO `user` (`username`, `password`, `name`, `tel`, `background_wall`, `head_portrait`, `synopsis`) VALUES
('admin', '1218866243Yh*', '杨汉梁', '147852315**', '../../../assets/images/index/banner.png', '../../../assets/images/index/avatar.jpg', '一个喜欢游戏和编程的愣头小青年, 在这里分享一些,个人关于前端的知识感悟,以及一些自己觉得不错的dd')

```

## 文章表
```sql
create table if not exists article(
	`id` int NOT NULL auto_increment primary key,
	`comment_id` int COMMENT '评论的id',
	`category_id` smallint(6) COMMENT '分类id',
	`title` varchar(30) NOT NULL COMMENT '文章标题',
	`synopsis` text NOT NULL COMMENT '文章简介',
	`createtime` bigint(13) NOT NULL COMMENT '创建时间',
	`updatetime` bigint(13) COMMENT '更新时间',
  	`read` int(11) NOT NULL DEFAULT '0' COMMENT '阅读数',
  	`praise` int(11) NOT NULL DEFAULT '0' COMMENT '点赞',
	`original` int(1) NOT NULL DEFAULT '0' COMMENT '原创0,转载1',
	`content` text NOT NULL COMMENT '文章内容'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```

+ 注意： 时间不能使用 varchar 这种格式， 否则 moment 会提示 Invalid date (无效时间)
+ 注意： 想精确保留毫秒 需要设置 bigint(13) ，设置 int(13) 不行， 

### 文章内容详解

+ title 
+ section

## 评论表
```sql
create table if not exists comment(
	`id` INT NOT NULL auto_increment PRIMARY KEY,
	`article_id` INT NOT NULL COMMENT '文章id',
	`comment_id` INT NOT NULL DEFAULT '0' COMMENT '评论id',
	`alias` VARCHAR(20) NOT NULL DEFAULT '游客' COMMENT '昵称',
	`mailbox` VARCHAR(50) COMMENT '邮箱',
	`time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论的时间',
	`comment_content` text NOT NULL COMMENT '评论的内容',
	`head_portrait_url` VARCHAR(100) NOT NULL DEFAULT 'http://localhost:3001/user_head_portrait/test.jpeg' COMMENT '头像路径'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```

```txt
 JSON我相信大家都已经很熟悉了，但在 MySQL中，直至 5.7 版本中，才正式引入 JSON数据类型。在次之前，我们通常使varchar或text数据类型存储JSON格式数据。
 ```

---

// 解决异步操作（以前忘记写了
const async = require('async')
https://blog.csdn.net/zzwwjjdj1/article/details/51857959

## 转义

双引号：```&quot;```
单引号：```&apos;```

## 模糊搜索

```sql

SELECT * FROM article WHERE title Like '%qw%' or content Like '%qw%'

```

## searchData-api
```sql
`SELECT a.*,c.classname FROM
    article AS a LEFT OUTER JOIN category AS c
    ON a.category_id = c.id
    WHERE title Like '%${data.searchData}%' or content Like '%${data.searchData}%' or c.classname Like '%${data.searchData}%' or synopsis Like '%${data.searchData}%'`
```

按标题||内容||类名||描述 -> 搜索


## 分类表
```sql
CREATE TABLE IF NOT EXISTS `category` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `classname` varchar(30) NOT NULL COMMENT '分类名称',
  `pid` smallint(6) NOT NULL DEFAULT '0' COMMENT '父id',
  `pid_classname` varchar(30) NOT NULL COMMENT '父分类名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;
```


> articleList-api
mysql 连表查询,取一个表的所有数据和取另一个表的某个字段

```sql
select a.*,c.classname from
article as a left outer join category as c
on a.category_id = c.id;
```

## 笔记表

```sql
create table if not exists note(
	`id` smallint(6) NOT NULL auto_increment primary key,
	`category_id` smallint(6) COMMENT '分类id',
	`content` text NOT NULL COMMENT '内容'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```

## 评论用户表

```sql
create table if not exists comment_user(
	`id` smallint(6) NOT NULL auto_increment primary key,
	`ip` varchar(12) NOT NULL COMMENT 'ip地址',
	`user_head_portrait` text COMMENT '用户头像',
	`alias` VARCHAR(20) NOT NULL DEFAULT '游客' COMMENT '昵称',
	`mailbox` VARCHAR(50) COMMENT '邮箱',
)

```

if(error) {
	console.log(error)
}

简写 --->

if (error) throw error








---

> 接口文档

# index

> 获取首页需要的数据

+ 默认获取5条文章数据,并且是根据 `updatetime` 降序

+ 单独的点击分页,分页跳转,分页数目切换,以及排序比较简单
	+ 第一次加载时
		+ 需要获取总数据数目
		+ 以及几条数据(用于展示)-每页条数
	+ 点击第几页
		+ 根据点击的页数(当前页)以及每页条数和当前排序的方式(以哪个字段为标准排序),去获取数据即可

```sql
const sql = `SELECT a.*,c.classname FROM
        article AS a LEFT OUTER JOIN category AS c
        ON a.category_id = c.id
        ORDER BY ${sortField} ${orderBy}
        LIMIT ${currentPage},${number}`
```

+ 单独搜索数据填充比较简单
	+ 需要获取模糊查询的```数据```以及该数据的```条数```
+ 当搜索数据和分页,排序这些结合起来后就比较麻烦
	+ 需要获取模糊查询的```数据```以及该数据的```条数```
	+ 将获取到的数据进行排序
	+ 当处于搜索时，点击分页，要根据```当前的数据```进行跳转

## 问题 1

+ 在使用 element-ui 分页排序，按```更新时间```排序，问题如下：
	+ 当点击第二页时渲染数据是底部开始渲染（虽然问题不大，但总感觉别扭
+ 问题排查：
	+ 我首先将数据打印出来
	+ 打印出来的数据如下：（当前是降序排序

```js
console.log()
```

```
2018年-12月-18日 09时:57分:26秒 星期2
2018年-12月-16日 23时:10分:59秒 星期7
null
null
null
null

```

> 但表格渲染出来的数据却是：

```
null
null
null
null
2018年-12月-18日 09时:57分:26秒 星期2
2018年-12月-16日 23时:10分:59秒 星期7
```

+ 然后我怀疑可能是 element-ui 数据渲染的模式就是从底部开始渲染
	+ 于是我查看文档发现并不是
	+ 由于 element-ui 的数据格式和我的不一样，所以我开始怀疑数据格式的问题

> element-ui 的案例数据格式如下：

```
'2016-05-04'
```

> 我的数据格式如下：

```
"2018年-12月-18日 09时:57分:26秒 星期2"
```

> 单双引号在这里可以忽略，一样的效果

+ 想到数据格式，又想到 js 的 sort 排序方法，再一想会不会可能是 `null` 的原因呢？
	+ 于是我在后端服务器上做了以下修改
```js
// 将原来的
results[i].updatetime = results[i].updatetime === null ? null : moment(results[i].updatetime).format('YYYY年-MM月-DD日 HH时:mm分:ss秒 星期E')

// 修改为
results[i].updatetime = results[i].updatetime === null ? '' : moment(results[i].updatetime).format('YYYY年-MM月-DD日 HH时:mm分:ss秒 星期E')
```

+ 发现数据渲染正常，就是 `null` 的原因

+ 经过测试后发现还是会有这个问题，原因是返回的格式不对，只能返回时间戳，或者单纯的时间格式




> paging-api 分类接口，融合了模糊搜索，排序，分页功能


## 获取上一篇和下一篇文章

+ preArticle

```sql

const sql = `SELECT title, a.id FROM
        article as a LEFT OUTER JOIN category as c
        ON a.category_id = c.id
        WHERE a.id > ${id}
        ORDER BY createtime
        LIMIT 1`

```

+ nextArticle

```sql

const sql = `SELECT title, a.id FROM
        article as a LEFT OUTER JOIN category as c
        ON a.category_id = c.id
        WHERE a.id < ${id}
        ORDER BY createtime desc
        LIMIT 1`

```