# 黎生小窝博客系统后台api

### 技术栈

nodejs(express)+mysql

### 如何启动

1、将public/sql目录下的html表文件导入blog数据库

2、在该目录的命令行中依次执行下列命令

```powershell
npm install

npm install nodemon

npm run start
```

项目即可启动

### 功能说明

配合 黎生小窝博客 使用，也可以自行对接内部提供的api，主要分为两个部分

​	——	1、用户api：routes/user文件下

​	——	2、博客api：routes/blog文件下

自定义了一些工具库，位于utils目录中

### 其他

这里自定义状态码233为前端直接渲染，状态码250为后端提示，前端可以根据提示做出相应操作



作者邮箱：1435585893@qq.com
