# RCE — 远程命令/代码执行 (Remote Code Execution)

## 原理

RCE 分为两种：

**命令执行**：应用将用户输入拼接到系统命令中执行，攻击者可以通过特殊字符（如 `;`、`|`、`&&`）注入额外的命令。

**代码执行**：应用将用户输入传递给 `eval()`、`exec()` 等函数执行，攻击者可以执行任意代码。

根本原因：**应用调用了系统命令或代码执行函数，且参数包含未经充分过滤的用户输入**。

## 常见危险函数

### 命令执行
| 语言 | 函数 | 说明 |
|------|------|------|
| PHP | `system()` | 执行命令并输出结果 |
| PHP | `exec()` | 执行命令返回最后一行 |
| PHP | `shell_exec()` / `` ` `` | 执行命令返回全部输出 |
| PHP | `passthru()` | 执行命令并直接输出原始结果 |
| Python | `os.system()` | 执行系统命令 |
| Python | `os.popen()` | 打开管道执行命令 |
| Python | `subprocess.call()` | 执行子进程（shell=True 时危险） |
| Java | `Runtime.exec()` | 执行系统命令 |
| Node.js | `child_process.exec()` | 执行系统命令 |

### 代码执行
| 语言 | 函数 | 说明 |
|------|------|------|
| PHP | `eval()` | 将字符串作为 PHP 代码执行 |
| PHP | `assert()` | 断言字符串作为代码执行 |
| PHP | `preg_replace()` | `/e` 修饰符将替换内容作为代码执行 |
| Python | `eval()` | 执行 Python 表达式 |
| Python | `exec()` | 执行任意 Python 代码 |
| JavaScript | `eval()` | 执行任意 JS 代码 |

## 示例

### 命令执行漏洞

```php
<?php
// 危险
$ip = $_GET['ip'];
echo system("ping -c 3 " . $ip);
?>
```

正常请求：`?ip=127.0.0.1`
攻击请求：`?ip=127.0.0.1; whoami`
攻击请求：`?ip=| dir`
攻击请求：`?ip=127.0.0.1 && cat /etc/passwd`

### 代码执行漏洞

```python
# 危险
user_input = request.GET.get('code')
result = eval(user_input)
```

攻击输入：`__import__('os').system('whoami')`

```php
<?php
// 危险
$code = $_GET['code'];
eval($code);
?>
```

攻击请求：`?code=phpinfo();`

## 防御

| 防御措施 | 说明 |
|----------|------|
| 避免调用系统命令 | 尽量使用语言内置函数替代系统命令 |
| 白名单验证 | 只允许指定的少数命令或参数 |
| 转义特殊字符 | 对 `;` `|` `&` `` ` `` `$` `(` `)` 等转义 |
| ` escapeshellarg()` / `escapeshellcmd()` | PHP 中用于转义命令参数 |
| 关闭危险函数 | 在 php.ini 中禁用 `system()`、`exec()` 等（`disable_functions`） |
| 最小权限运行 | Web 服务以低权限用户运行 |

### 安全做法

```php
<?php
// 安全：白名单
$allowed_ips = ['127.0.0.1', '::1'];
$ip = $_GET['ip'];

if (in_array($ip, $allowed_ips, true)) {
    echo system("ping -c 3 " . escapeshellarg($ip));
} else {
    echo "不允许的 IP";
}
?>
```

## 真实案例

### 案例：Equifax Struts2 漏洞（CVE-2017-5638）
- 漏洞：Apache Struts2 框架的远程代码执行
- 利用方式：构造恶意 Content-Type 请求头触发 OGNL 表达式执行
- 影响：1.43 亿条数据泄露
- 教训：框架组件必须及时更新

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 `exec "ping"`（命令执行）和 `exec "eval"`（代码执行）两个练习场景。
