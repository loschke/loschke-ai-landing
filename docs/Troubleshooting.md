# Troubleshooting

## Netzwerk-Fehler (ECONNRESET) beim E-Mail-Versand (Resend)

Falls beim lokalen Testen (`pnpm dev`) Fehler wie `fetch failed` oder `ECONNRESET` auftreten, liegt das oft daran, dass Node.js versucht, IPv6 zu nutzen, was im lokalen Netzwerk blockiert wird.

**Lösung:**
Starte den Dev-Server mit erzwungenem IPv4:

```powershell
$env:NODE_OPTIONS="--dns-result-order=ipv4first"; pnpm dev
```

**Hinweis:**
Auf Vercel (Production) ist dieser Workaround nicht nötig, da die Netzwerkumgebung dort korrekt konfiguriert ist.
