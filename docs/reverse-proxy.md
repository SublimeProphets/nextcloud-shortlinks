# Reverse proxy examples

The application keeps its supported Nextcloud route. A short root path is an operator-managed rewrite to `/apps/shortlinks/r/<alias>`; preserve the original trusted host/proto configuration and do not expose management APIs.

## nginx

```nginx
location ~ ^/s/([A-Za-z0-9_-]+)$ {
    return 302 https://cloud.example/apps/shortlinks/r/$1;
}
```

## Apache

```apache
RewriteEngine On
RewriteRule ^s/([A-Za-z0-9_-]+)$ https://cloud.example/apps/shortlinks/r/$1 [R=302,L,NE]
```

## Caddy

```caddy
@short path_regexp short ^/s/([A-Za-z0-9_-]+)$
redir @short https://cloud.example/apps/shortlinks/r/{re.short.1} 302
```

An internal reverse proxy may proxy instead of redirecting, but must forward only the bounded alias capture, use an HTTPS upstream, and follow Nextcloud trusted proxy/overwrite settings. Configure the same externally visible prefix as Shortlinks' public base URL. Never derive that base from an untrusted request `Host` header.
