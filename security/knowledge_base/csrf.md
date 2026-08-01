# CSRF — 跨站请求伪造 (Cross-Site Request Forgery)

## 原理

CSRF 攻击者诱导已登录用户点击一个链接或访问一个页面，在用户不知情的情况下，**以用户的身份**向目标网站发送恶意请求。

根本原因：Web 应用在执行敏感操作时，**没有验证请求是否真的是用户本人发起的**。服务器只靠 Cookie 识别用户，无法区分请求是用户主动操作还是被恶意页面伪造的。

## 攻击流程

```
1. 用户登录了银行网站 A（有了 Cookie 会话）
2. 用户没有登出 A，又在同一浏览器访问了恶意网站 B
3. 恶意网站 B 构造了一个请求：<img src="http://bank.com/transfer?to=attacker&amount=10000">
4. 浏览器自动发送这个请求（附带 A 的 Cookie）
5. 银行服务器收到有效 Cookie → 以为是用户本人操作 → 转账成功
```

## 常见触发方式

| 方式 | 示例 |
|------|------|
| `<img>` 标签 | `<img src="http://bank.com/transfer?to=...">` |
| `<form>` 自动提交 | 隐藏表单 + `document.forms[0].submit()` |
| `<a>` 标签 | 诱导用户点击伪装链接 |
| `<link>` 标签 | `rel="stylesheet"` 加载链接 |
| Ajax 请求 | `XMLHttpRequest` 自动携带 Cookie |

## 防御

| 防御措施 | 说明 | 有效性 |
|----------|------|--------|
| CSRF Token | 表单中嵌入随机 Token，服务端验证 | ✅ 标准方案 |
| SameSite Cookie | Cookie 标记 `SameSite=Strict/Lax` | ✅ 浏览器原生防御 |
| Referer/Origin 验证 | 检查请求来源 | ⚠️ 可能被绕过 |
| 二次验证 | 敏感操作要求输入密码/验证码 | ✅ 强防御 |

### CSRF Token 工作原理

1. 服务器生成一个随机的 Token，存入 Session
2. 页面表单中嵌入该 Token（隐藏字段）
3. 用户提交表单时，Token 一起提交
4. 服务器比对提交的 Token 和 Session 中的 Token
5. 如果不匹配 → 拒绝请求

```html
<!-- 表单中的 Token -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="随机生成的Token">
  <input type="text" name="to_account">
  <input type="text" name="amount">
  <input type="submit" value="转账">
</form>
```

### SameSite Cookie 设置

```python
# Flask 设置
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Django 设置
SESSION_COOKIE_SAMESITE = 'Lax'

# 在 Set-Cookie 头中的效果
Set-Cookie: session=xxxx; SameSite=Lax
```

## 与 XSS 的区别

| | CSRF | XSS |
|--|------|-----|
| 原理 | 利用身份认证 | 注入恶意脚本 |
| 目标 | 以用户身份执行操作 | 在用户浏览器执行代码 |
| 是否需要用户交互 | 仅需访问恶意页面 | 可能需要点击 |
| 防御核心 | Token / SameSite | 输出转义 / CSP |
| 关系 | XSS 可以绕过 CSRF 防御 | CSRF 不依赖 XSS |

## 真实案例

### 案例：2008 年 WordPress CSRF 漏洞
- 漏洞：WordPress 后台的 CSRF，攻击者可以修改管理员设置
- 利用方式：诱导管理员访问恶意页面，自动添加管理员账户
- 教训：CMS 系统后台必须对所有写操作进行 CSRF 防护

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 CSRF GET 方式、POST 方式以及 Token 防御机制的练习场景，可以对比有无 Token 时的区别。
