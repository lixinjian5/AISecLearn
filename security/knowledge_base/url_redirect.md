# 不安全的 URL 重定向 (Unvalidated Redirects and Forwards)

## 原理

应用程序根据用户提供的参数进行页面跳转，但没有验证目标 URL 是否合法。攻击者可以将用户引导到恶意网站（钓鱼网站）。

根本原因：**将用户传入的 URL 直接用于重定向，没有做白名单校验**。

## 常用场景

```php
<?php
// 危险
$redirect = $_GET['url'];
header('Location: ' . $redirect);
?>
```

```
合法用法：http://example.com/redirect?url=http://example.com/profile
攻击用法：http://example.com/redirect?url=http://phishing-site.com
```

## 为什么危险

1. **看起来可信**：用户看到是 `example.com` 的链接，以为安全
2. **绕过 URL 检查**：一些安全检查只检查初始 URL，不跟踪重定向
3. **OAuth 授权窃取**：在 OAuth 流程中，攻击者可以窃取授权码

## 示例

### 常见攻击方式

```
http://bank.com/login?redirect=http://fake-bank.com

http://trusted.com/go?url=http://evil.com

http://example.com/?next=javascript:alert(1)
```

### OAuth 回调劫持

OAuth 流程中，应用跳转到 `redirect_uri` 参数指定的地址。如果未校验：

```
https://oauth-provider.com/auth?client_id=xxx&redirect_uri=http://evil.com/callback
```

——攻击者拿到授权码后就能接管用户账号。

## 防御

| 防御措施 | 说明 |
|----------|------|
| 白名单 | 只允许重定向到预设的少数几个 URL |
| 使用索引而非 URL | 用 `?page=1` 代替 `?redirect=http://xxx` |
| 验证域名 | 检查重定向目标是否属于本域名 |
| 显式提示 | 跳转到外部时显示警告页面 |
| 编码校验 | 不直接拼接用户输入到重定向头 |

### 安全代码示例

```python
from urllib.parse import urlparse

ALLOWED_HOSTS = ['example.com', 'www.example.com']

def safe_redirect(url):
    parsed = urlparse(url)
    
    if parsed.hostname in ALLOWED_HOSTS:
        return redirect(url)
    else:
        return redirect('/default-page')
```

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了"不安全的URL跳转"练习场景。
