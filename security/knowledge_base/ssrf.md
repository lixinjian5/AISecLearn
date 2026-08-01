# SSRF — 服务端请求伪造 (Server-Side Request Forgery)

## 原理

SSRF 发生在应用程序从服务器端发起网络请求时，目标 URL 由用户控制。攻击者可以让服务器向内部网络（内网）发送请求，访问本不可从外部访问的资源。

根本原因：**服务器端发起的网络请求使用了用户提供的 URL，且没有做充分限制**。

## 能做什么

| 目标 | 说明 |
|------|------|
| 扫描内网 | 探测内网哪些 IP 在线、哪些端口开放 |
| 读取云服务元数据 | 访问云服务器的元数据接口（如 AWS 的 169.254.169.254） |
| 攻击内网服务 | 向内网的 Redis、MongoDB、Memcached 等发请求 |
| 绕过防火墙 | 防火墙拦住外网请求，但拦不住服务器发出的请求 |
| 读取本地文件 | 使用 `file://` 协议读取服务器文件 |

## 样例

```
http://example.com/fetch?url=http://www.baidu.com    正常
http://example.com/fetch?url=http://127.0.0.1:80     访问本机
http://example.com/fetch?url=http://127.0.0.1:3306   探测 MySQL
http://example.com/fetch?url=http://192.168.1.1:8080 访问内网
http://example.com/fetch?url=file:///etc/passwd      读取文件
http://example.com/fetch?url=dict://127.0.0.1:6379   攻击 Redis
```

### 云服务元数据攻击（经典场景）

```
# AWS
http://example.com/fetch?url=http://169.254.169.254/latest/meta-data/

# 阿里云
http://example.com/fetch?url=http://100.100.100.200/latest/meta-data/

# GCP
http://example.com/fetch?url=http://metadata.google.internal/computeMetadata/v1/
```

——攻击者可以获取云服务器的临时访问密钥。

## 防御

| 防御措施 | 说明 |
|----------|------|
| URL 白名单 | 只允许访问指定的域名/IP |
| 禁止内网 IP | 拦截 127.0.0.1、10.x.x.x、172.16-31.x.x、192.168.x.x |
| 禁止特殊协议 | 禁用 `file://`、`dict://`、`gopher://` 等协议 |
| 禁止元数据 IP | 特别拦截 169.254.169.254（AWS）等云元数据地址 |
| 限制出站网络 | 服务器出站流量只允许必要的端口和 IP |

### 安全代码示例（Python）

```python
import requests
from urllib.parse import urlparse
import ipaddress

ALLOWED_DOMAINS = ['api.trusted.com', 'cdn.trusted.com']
BLOCKED_IPS = ['127.0.0.1', '10.', '172.16.', '192.168.', '169.254.']

def safe_fetch(url):
    parsed = urlparse(url)
    
    # 协议白名单
    if parsed.scheme not in ['http', 'https']:
        return "不支持的协议", 400
    
    # 域名白名单
    if parsed.hostname not in ALLOWED_DOMAINS:
        return "不允许的域名", 400
    
    # IP 黑名单
    try:
        ip = socket.gethostbyname(parsed.hostname)
        if ip.startswith(tuple(BLOCKED_IPS)):
            return "不允许的 IP", 400
    except:
        return "无法解析域名", 400
    
    return requests.get(url, timeout=5).text
```

## 与 XXE 的关系

XXE 经常被用来触发 SSRF：XML 外部实体中的 `SYSTEM "http://内网地址"` 就是 SSRF。

## 真实案例

### 案例：2019 年 Capital One 数据泄露
- 漏洞：SSRF 攻击 AWS 元数据接口获取临时凭证
- 后果：1.06 亿用户的个人信息泄露
- 教训：云环境中的 SSRF 危害极大，直接导致云服务凭据泄露

## 在 Pikachu 靶场中的对应模块

Pikachu 提供了 SSRF（curl）和 SSRF（file_get_contents）两个练习场景。
