# 敏感信息泄露 (Sensitive Information Disclosure)

## 原理

敏感信息泄露是指应用程序无意中将敏感数据暴露给未经授权的用户。这些信息可能存在于响应报文、错误消息、源代码注释、备份文件、公开的配置文件中。

根本原因：**开发过程中留下了调试信息、测试数据或未清理的敏感内容**。

## 常见泄露途径

| 途径 | 说明 | 示例 |
|------|------|------|
| HTML 注释 | 开发人员留下的注释暴露信息 | `<!-- TODO: 修复 bug，管理员密码: admin123-->` |
| 错误信息 | 数据库错误暴露 SQL 语句 | `You have an error in your SQL syntax...` |
| 源代码备份 | 备份文件未删除 | `index.php.bak`、`index.php~`、`.git` 目录暴露 |
| 配置文件 | 配置文件可被直接访问 | `/config.php` → 数据库密码 |
| JSONP/CORS 配置错误 | 跨域请求泄露数据 | `Access-Control-Allow-Origin: *` |
| 目录列表 | Web 服务器启用了目录浏览 | 看到 `/uploads/` 下的所有文件 |
| 版本信息 | 服务器软件版本暴露 | `Apache/2.4.49 (Ubuntu)`（针对性漏洞） |
| 调试接口 | 生产环境未关闭调试模式 | `/debug/`、`/api/docs/` |

## 示例

### HTTP 响应头中的版本信息

```
HTTP/1.1 200 OK
Server: nginx/1.18.0
X-Powered-By: PHP/7.4.33
```

——攻击者知道目标用 nginx 1.18.0 和 PHP 7.4.33，可以搜索对应的已知漏洞。

### .git 目录泄露

```
http://target.com/.git/config
```

——攻击者可以下载整个 .git 目录，获取所有源码和提交历史。

### 备份文件泄露

```
http://target.com/index.php.bak
```

——下载源码分析的 PHP 文件，寻找其他漏洞。

## 防御

| 防御措施 | 说明 |
|----------|------|
| 隐藏版本信息 | 关闭 Server 头的版本显示 |
| 关闭调试模式 | 生产环境 `display_errors = Off`，`debug=False` |
| 清理注释 | 部署前移除 HTML/JS 中的敏感注释 |
| 删除备份文件 | 不在 Web 目录保留 `.bak`、`.old`、`~` 文件 |
| 保护 .git | 不允许直接访问 `.git` 目录 |
| 禁用目录列表 | Web 服务器配置禁止目录浏览 |
| 错误页面自定义 | 使用统一错误页面，不暴露调用栈 |

### 安全配置示例（Nginx）

```nginx
# 禁止访问 .git 目录
location ~ /\.git {
    deny all;
}

# 禁止目录列表
autoindex off;

# 隐藏版本号
server_tokens off;
```

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了名为 "I can see your ABC" 的敏感信息泄露练习场景。
