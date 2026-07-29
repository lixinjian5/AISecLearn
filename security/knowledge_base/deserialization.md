# 反序列化漏洞 (Deserialization)

## 原理

序列化是将对象转换成可存储或传输的格式（如二进制或字符串）。反序列化是逆过程。当程序从不可信来源反序列化数据时，攻击者可以构造恶意序列化数据，触发对象中的特定方法，导致代码执行。

根本原因：**反序列化时，没有验证数据来源，也没有限制可反序列化的类**。

## 常见场景

| 语言 | 序列化格式 | 危险函数 |
|------|------------|----------|
| PHP | `serialize()` / `unserialize()` | `unserialize()` |
| Java | `ObjectOutputStream` / `ObjectInputStream` | `readObject()` |
| Python | `pickle` | `pickle.loads()` |
| Node.js | `node-serialize` | `unserialize()` |

## 攻击原理

### PHP 反序列化

PHP 反序列化时，会自动调用某些魔术方法：

| 魔术方法 | 调用时机 |
|----------|----------|
| `__wakeup()` | 反序列化时自动调用 |
| `__destruct()` | 对象销毁时自动调用 |
| `__toString()` | 对象被当作字符串时调用 |
| `__call()` | 调用不可访问的方法时调用 |

如果这些魔术方法中包含了危险操作（如执行命令、文件操作），攻击者就可以通过构造序列化数据来触发。

```php
<?php
class Test {
    public $cmd = "whoami";
    
    function __destruct() {
        system($this->cmd);
    }
}

// 攻击者构造的序列化数据
$payload = serialize(new Test());
// 输出: O:4:"Test":1:{s:3:"cmd";s:6:"whoami";}
unserialize($payload); // 触发 __destruct() → 执行 whoami
?>
```

### Java 反序列化

Java 中常见利用链（gadget chain），如 CommonsCollections、Fastjson、Shiro 等。

攻击者通过 ysoserial 工具生成恶意 payload：
```bash
java -jar ysoserial.jar CommonsCollections1 'command' > payload.bin
```

## 防御

| 防御措施 | 说明 |
|----------|------|
| 不使用不可信来源的反序列化 | 不要反序列化用户输入的数据 |
| 使用 JSON 替代 | JSON 没有反序列化代码执行的机制 |
| 类白名单 | 只允许反序列化特定的类 |
| 数据完整性校验 | 序列化数据加签，反序列化前验签 |
| 及时更新库版本 | 很多反序列化漏洞在库更新中修复 |

## 真实案例

### 案例 1：2015 年 Jenkins 反序列化漏洞（CVE-2015-8103）
- 漏洞：Jenkins CLI 使用了不安全的反序列化
- 利用：ysoserial 生成 payload → 远程代码执行
- 影响：大量使用 Jenkins 的企业服务器被攻陷

### 案例 2：Fastjson 反序列化
- 漏洞：阿里 Fastjson 库中 autoType 功能导致 RCE
- 利用：构造 JSON 中的 `@type` 字段指向恶意类
- 教训：JSON 解析库也可能存在反序列化风险

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 PHP 反序列化漏洞练习场景，演示了如何通过构造序列化数据触发代码执行。
