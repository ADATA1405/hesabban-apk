# ساخت APK حساببان (Capacitor)

## پیش‌نیاز (روی کامپیوتر خودتان)
- Node.js 18 یا بالاتر
- Android Studio (همراه JDK و Android SDK)

## مراحل
```
cd hesabban-apk
npm install
npm run setup      # ساخت پروژه‌ی اندروید (فقط بار اول)
npm run apk        # ساخت APK
```
خروجی: `android/app/build/outputs/apk/debug/app-debug.apk`

این APK با کلید debug امضا شده و برای نصب مستقیم و فروش فایل خوب است.
برای انتشار در مارکت‌ها: Android Studio ← Build ← Generate Signed Bundle / APK.

## تغییر نام یا Package ID
`capacitor.config.json` را قبل از `npm run setup` ویرایش کنید (appId بعداً سخت تغییر می‌کند).

## بعد از هر تغییر در www/index.html
```
npm run apk
```

## ساخت APK با GitHub Actions
Secrets لازم در تنظیمات مخزن:
- `KEYSTORE_BASE64`: فایل keystore به‌صورت base64 (`base64 -w0 hesabban-release.jks`)
- `KEY_ALIAS`, `KEYSTORE_PASSWORD`, `KEY_PASSWORD`

اجرا: تب Actions → Build release APK → Run workflow. خروجی در بخش Artifacts است.
