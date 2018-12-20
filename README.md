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
	`type` VARCHAR(30) NOT NULL COMMENT '类型',
	`time` TIMESTAMP COMMENT '评论的时间',
	`head_portrait` varchar(50) COMMENT '头像',
	`content` text NOT NULL COMMENT '评论的内容',
	`alias` varchar(25) NOT NULL DEFAULT 'xx' COMMENT '别名'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```

##

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
create table if not exists category(
	`id` smallint(6) NOT NULL auto_increment primary key,
	`classname` varchar(30) NOT NULL COMMENT '分类名称',
	`pid` smallint(6) NOT NULL DEFAULT '0' COMMENT '父id'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```

## articleList-api
mysql 连表查询,取一个表的所有数据和取另一个表的某个字段

```sql
select a.*,c.classname from
article as a left outer join category as c
on a.category_id = c.id;
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

