---
trigger: always_on
---

# Digitesia Engineering Standard — Capacitor Addendum (v1.0)

_Applies ONLY when target includes **Capacitor (Android / iOS)**_  
_This document EXTENDS v3.3 — no existing rules are overridden._

---

## PLATFORM SCOPE

- Capacitor is a **NATIVE APP with Web UI**
- Browser assumptions are **FORBIDDEN**
- PWA assumptions are **FORBIDDEN**
- React Native assumptions are **FORBIDDEN**

---

## ARCHITECTURE RULES (ABSOLUTE)

- Capacitor MUST be treated as a **mobile-first target**
- WebView is the **only rendering surface**
- Desktop-only UX assumptions are **FORBIDDEN**

Conceptual architecture:

Web UI  
↓  
Capacitor Bridge  
↓  
Native APIs

---

## UI / UX — MOBILE APP RULES (MANDATORY)

### Layout

- Mobile-first is **REQUIRED** (desktop is an enhancement)
- Default layout MUST be **single-column**
- Sidebar navigation is **FORBIDDEN** on mobile
- Bottom navigation / tab bar is **PREFERRED**
- Sticky headers MUST respect safe-area insets

### Interaction

- Hover-only interactions are **FORBIDDEN**
- Right-click / context menu behavior is **FORBIDDEN**
- Scroll hijacking is **FORBIDDEN**
- Pull-to-refresh MUST be explicitly enabled or disabled

### Touch & Input

- Minimum touch target: **44x44px**
- All inputs MUST be keyboard-aware
- Layout MUST NOT be covered by the on-screen keyboard
- Usage of `100vh` is **FORBIDDEN** → use dynamic viewport units

---

## SAFE AREA & DEVICE CONSTRAINTS

- Safe-area insets MUST be respected
- Hardcoded top/bottom padding or margins are **FORBIDDEN**
- Notch and gesture areas MUST be handled via CSS env variables

---

## NAVIGATION & HISTORY

- Browser back-button assumptions are **FORBIDDEN**
- Navigation MUST be router-driven
- Reload-based navigation is **FORBIDDEN**
- Deep linking MUST be supported

---

## NATIVE FEATURE ACCESS

### Rules

- Native features MUST be accessed via Capacitor plugins
- Web API fallbacks are allowed ONLY if explicitly supported
- Silent degradation is **FORBIDDEN**

### Allowed Native Features

- Push notifications
- Camera / media access
- File system
- Biometric authentication
- App lifecycle events (pause / resume)
- Deep linking

---

## STORAGE & STATE

- LocalStorage usage MUST be audited
- Sensitive data MUST NOT be stored in LocalStorage
- Authentication tokens:
  - Web → httpOnly cookies or in-memory storage
  - Capacitor → Secure Storage / Keychain

---

## NETWORKING

- Absolute URLs are **REQUIRED**
- Dependency on `window.location` is **FORBIDDEN**
- Offline and error states MUST be handled
- Network loss MUST NOT crash the app

---

## PERFORMANCE (WEBVIEW-SPECIFIC)

- Heavy reflows are **FORBIDDEN**
- Unbounded DOM lists are **FORBIDDEN**
- Virtualization is **REQUIRED** for large lists
- Background timers MUST pause when the app is backgrounded

---

## BUILD & RELEASE

- Capacitor build artifacts MUST NOT be manually edited
- Native Android / iOS changes MUST be minimal and documented
- Plugin versions MUST be pinned
- App versioning MUST follow semantic versioning

---

## DEBUGGING & LOGGING

- `console.log` is **FORBIDDEN**
- Native logs MUST be structured
- Debug-only tooling MUST be stripped in production builds

---

## FORBIDDEN ASSUMPTIONS (CRITICAL)

- “Works on desktop Chrome” ≠ acceptable
- “Looks fine in a browser” ≠ app-ready
- “Capacitor will fix mobile UX” ❌
- “We’ll optimize mobile later” ❌

---

## DECISION GUARD

Capacitor is **VALID ONLY IF ALL** of the following are true:

- UI is comfortable on mobile browsers
- No gesture-heavy or animation-critical UX
- No custom native UI requirements
- Business app / SaaS / dashboard use case
- Velocity is more important than animation perfection

If ANY condition is false → **STOP** and re-evaluate React Native.

---

## EXECUTIVE RULE

Capacitor reflects mobile web quality **1:1**.  
Bad mobile web → bad app.  
Good mobile web → good app.
