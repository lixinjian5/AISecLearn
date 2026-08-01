# 不安全的文件下载 (Unsafe File Download)

## 原理

应用程序根据用户提供的文件名或路径提供文件下载，但没有充分验证用户请求的文件是否在允许范围内。攻击者可以通过路径遍历获取服务器上的敏感文件。

根本原因：**文件下载路径由用户控制，没有做路径白名单或权限校验**。

## 示例

### 有漏洞的代码

```php
<?php
// 危险
$filename = $_GET['file'];
$filepath = '/var/www/downloads/' . $filename;

if (file_exists($filepath)) {
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . basename($filepath) . '"');
    readfile($filepath);
}
?>
```

### 攻击方式

```
# 下载配置文件
?file=../../config/database.php

# 下载系统文件（Linux）
?file=../../../../etc/passwd

# 下载系统文件（Windows）
?file=../../../../windows/win.ini

# 下载源代码
?file=../../index.php
```

## 与文件包含的区别

| | 文件下载 | 文件包含 |
|--|----------|----------|
| 执行方式 | 服务器读取文件内容发给用户 | 服务器将文件内容作为代码执行 |
| 目的 | 读取文件内容 | 执行文件中的代码 |
| 典型函数 | `readfile()`、`file_get_contents()` | `include()`、`require()` |

## 防御

| 防御措施 | 说明 |
|----------|------|
| 白名单 | 只允许下载指定的文件列表，不要使用用户提供的文件名 |
| 存储文件 ID 而非路径 | 数据库存文件 ID，下载时通过 ID 查找实际路径 |
| 路径校验 | 检查路径中是否包含 `../` 或绝对路径 |
| 限制下载目录 | 限制下载只能从某一目录下读取，且不允许跳出 |
| 权限验证 | 下载前验证用户是否有权限访问该文件 |

### 安全代码示例

```php
<?php
// 安全：通过文件 ID 映射实际路径
$file_map = [
    1 => '/var/www/downloads/report_2024.pdf',
    2 => '/var/www/downloads/manual.pdf',
    3 => '/var/www/downloads/template.docx',
];

$file_id = (int)$_GET['id'];

if (isset($file_map[$file_id])) {
    $filepath = $file_map[$file_id];
    // ... 提供下载
} else {
    echo "文件不存在";
}
?>
```

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 Unsafe Filedownload 练习场景，通过下载 NBA 球星图片的功能演示了通过路径遍历下载任意文件的漏洞。
