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
	`type` varchar(30) NOT NULL COMMENT '分类',
	`title` varchar(30) NOT NULL COMMENT '文章标题',
	`synopsis` text NOT NULL COMMENT '文章简介',
	`createtime` int(10) NOT NULL COMMENT '创建时间', 
  	`read` int(11) NOT NULL DEFAULT '0' COMMENT '阅读数',
  	`praise` int(11) NOT NULL DEFAULT '0' COMMENT '点赞',
	`original` int(1) NOT NULL DEFAULT '0' COMMENT '原创0,转载1',
	`content` text NOT NULL COMMENT '文章内容'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```
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