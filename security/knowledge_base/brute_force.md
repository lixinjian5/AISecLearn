# 暴力破解 (Brute Force)

## 原理

暴力破解指攻击者通过系统地尝试所有可能的用户名和密码组合，来获取系统访问权限。

根本原因：**没有限制登录尝试次数、没有使用验证码、密码策略太弱**。

## 常见攻击方式

| 类型 | 说明 |
|------|------|
| 用户名枚举 | 存在/不存在的用户名返回不同的错误信息 → 猜出有效用户名 |
| 字典攻击 | 使用常见密码列表（如 rockyou.txt）批量尝试 |
| 全暴力破解 | 尝试所有可能的字符组合（长度短时可尝试） |
| 凭证填充 | 用其他网站泄露的账号密码尝试登录 |
| 验证码绕过 | 验证码在客户端生成 / 验证码可复用 / 验证码未刷新 |

## 验证码常见漏洞

| 漏洞类型 | 说明 | Pikachu 示例 |
|----------|------|-------------|
| 验证码在服务端校验但不过期 | 同一个验证码可重复使用 | `bf_server.php` |
| 验证码在客户端校验 | 验证码校验逻辑在前端 JS 中 | `bf_client.php` |
| 验证码太简单 | 机器识别率很高（如简单计算） | — |
| Token 可预测 | 防爆破 Token 生成方式太简单 | `bf_token.php` |

## 防御

| 防御措施 | 说明 |
|----------|------|
| 限制尝试次数 | 连续 N 次失败后锁定账号一段时间 |
| 验证码 | 多次失败后要求输入验证码 |
| 延迟响应 | 登录失败后端随机延迟 0.5-3 秒 |
| 统一错误信息 | "用户名或密码错误"（不区分用户是否存在） |
| 双因素认证（2FA） | 密码 + 手机验证码 / TOTP |
| 强密码策略 | 要求长度、复杂度（大小写 + 数字 + 特殊字符） |
| 监控告警 | 短时间内大量失败登录触发告警 |

## 安全代码示例

```python
from flask import Flask, request
from flask_limiter import Limiter
import time

limiter = Limiter(app, key_func=lambda: request.remote_addr)

@app.route('/login', methods=['POST'])
@limiter.limit("5 per minute")  # 每分钟最多 5 次
def login():
    username = request.form['username']
    password = request.form['password']
    
    # 延迟（防止快速枚举）
    time.sleep(1)
    
    user = User.query.filter_by(username=username).first()
    
    if not user or not user.check_password(password):
        # 统一错误信息
        return "用户名或密码错误", 401
    
    login_user(user)
    return "登录成功"
```

## 真实案例

### 案例：2014 年 iCloud 名人照片泄露
- 手法：攻击者对 iCloud 账号进行暴力破解（没有限制尝试次数）
- 后果：多位名人的私密照片泄露
- 教训：苹果随后在 iCloud 中加入了登录限制措施

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了基于表单的暴力破解、验证码绕过（Server 端/Client 端）以及 Token 防爆破的练习场景。
