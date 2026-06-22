# Charvo — App de Celular (Capacitor)

O app React é empacotado com **Capacitor** em apps nativos Android e iOS, reaproveitando 100% da interface web. As chamadas de API vão para a produção na Vercel (`VITE_API_URL=https://charvo.vercel.app`, embutido no build local via `.env.local`).

## Estrutura
- `backend/frontend/capacitor.config.ts` — appId `app.charvo`, appName `Charvo`, webDir `dist`
- `backend/frontend/android/` — projeto nativo Android
- `backend/frontend/ios/` — projeto nativo iOS
- Login (Supabase) usa **deep link** `app.charvo://auth` no app nativo (ver `AuthContext.tsx`)

## Pré-requisitos
- **Android:** Android Studio + JDK 21 (o JDK do sistema estava novo demais p/ o Gradle — instale o 21). Conta Google Play Developer ($25, uma vez).
- **iOS:** Xcode + CocoaPods (`sudo gem install cocoapods`). Conta Apple Developer ($99/ano). Só builda em macOS.

## Fluxo de desenvolvimento
A cada mudança no app web, rode (em `backend/frontend`):
```
npm run cap:sync          # build + copia para os projetos nativos
npm run cap:android       # build + sync + abre no Android Studio
npm run cap:ios           # build + sync + abre no Xcode
```

## Rodar/instalar
- **Android:** `npm run cap:android` → no Android Studio, escolha um emulador ou device e clique ▶. Para gerar APK/AAB de release: Build > Generate Signed Bundle/APK.
- **iOS:** `npm run cap:ios` → no Xcode, selecione o device e ▶. Precisa de um time de assinatura (Apple Developer).

## Login no app (IMPORTANTE)
No Supabase (Auth > URL Configuration), além das URLs web, adicione o redirect:
```
app.charvo://auth
```
Sem isso, o link mágico não volta para o app.

## Publicação
- **Google Play:** gere um AAB assinado, crie o app no Play Console, suba o AAB, preencha ficha da loja, envie p/ revisão.
- **App Store:** no Xcode, Archive > Distribute App; crie o app no App Store Connect; envie p/ revisão. (Atenção à diretriz 4.2 — apps muito "casca de site" podem ser rejeitados; o Charvo tem contas, geração e biblioteca, então tem funcionalidade real.)

## Notas
- A pasta `public` dentro de android/ios é cópia do `dist` (gerada pelo `cap sync`) e é ignorada pelo git.
- O ícone/splash padrão do Capacitor pode ser trocado depois com `@capacitor/assets`.
