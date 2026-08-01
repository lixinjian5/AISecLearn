# 目录遍历 (Directory Traversal / Path Traversal)

## 原理

目录遍历攻击者利用应用程序对文件路径处理不当，通过 `../` 等特殊字符跳出程序允许的访问目录，读取或执行服务器上的任意文件。

根本原因：**用户输入被用作文件路径，且没有对 `../`（路径回溯）做过滤**。

## 示例

### 有漏洞的代码

```php
<?php
// 危险
$template = $_GET['template'];
include('templates/' . $template);
?>
```

### 攻击 Payload

```
# 读取系统文件
?template=../../../etc/passwd
?template=../../../etc/shadow

# Windows 系统
?template=../../../../windows/system32/drivers/etc/hosts

# 读取应用源码
?template=../../../index.php
?template=../config/database.php
```

### URL 编码绕过

如果应用过滤了 `../`，可以尝试编码绕过：

```
%2e%2e%2f    → ../
%2e%2e/      → ../
..%252f      → 双重 URL 编码
....//....// → 某些过滤会去掉 ../，留下 ../../
```

## 与文件包含的区别

目录遍历通常指**读取**文件内容，文件包含是**执行**文件中的代码。但在实际攻击中两者经常结合使用。

## 防御

| 防御措施 | 说明 |
|----------|------|
| 禁止用户传入路径 | 使用文件 ID 或索引映射实际文件 |
| 过滤 `../` | 移除路径中的 `../` 或 `..\` |
| `basename()` 函数 | 只取文件名部分，去掉目录 |
| 加入文件系统根目录限制 | 使用 `realpath()` 检查最终路径是否在允许范围内 |

### 安全代码示例

```php
<?php
// 安全：校验最终路径是否在允许的目录内
$base_dir = '/var/www/templates/';
$user_input = $_GET['template'];

// 使用 realpath 解析所有 ../
$target = realpath($base_dir . $user_input);
$allowed = realpath($base_dir);

// 检查目标路径是否以允许目录开头
if (strpos($target, $allowed) === 0) {
    include($target);
} else {
    echo "非法访问";
}
?>
```

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了目录遍历的练习场景，页面列出文件列表，通过点击文件可以查看是否存在路径遍历漏洞。
