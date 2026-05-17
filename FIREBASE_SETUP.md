# Firebase setup — status

The frontend keeps living on **Vercel** (mealplan.mayanakkariya.com). Firebase
provides **Firestore** (shared data) + **Storage** (meal photos) + **Auth**
(4 fixed accounts). Identifiers from the live project are baked into
`index.html` and `guide.html` already.

## ✅ Already done (by Claude)

- Firebase project created: **`daivik-meal-plan`** (project number `197581914517`).
- Web app registered: `daivik-web` — `appId: 1:197581914517:web:298337cfe85ab6358ff69c`.
- Firestore database provisioned in `nam5` (multi-region US).
- Email/Password sign-in provider enabled.
- Firestore security rules deployed (mom/dad write, all four roles read).
- `FIREBASE_CONFIG` in `index.html` and `guide.html` populated with the live
  apiKey, authDomain, storageBucket, etc.

## 🟡 You still need to do these (5 minutes)

### 1. Create the 4 user accounts

Firebase doesn't allow user creation via this CLI. Open
**[Authentication → Users](https://console.firebase.google.com/project/daivik-meal-plan/authentication/users)**
and click **Add user** four times. Use the temporary PINs below — you can
reset any of them later by clicking the ⋮ menu next to the user.

| Role | Email | Temp PIN |
|---|---|---|
| Mom (read/write) | `mom@daivik.app` | `111111` |
| Dad (read/write) | `dad@daivik.app` | `222222` |
| Dietician (read only) | `dietician@daivik.app` | `333333` |
| Family (read only) | `family@daivik.app` | `444444` |

### 2. Add the production domain to Authorized domains

**[Authentication → Settings → Authorized domains](https://console.firebase.google.com/project/daivik-meal-plan/authentication/settings)** →
**Add domain** → `mealplan.mayanakkariya.com`. `localhost` is already there
by default.

### 3. Upgrade to Blaze (needed for Storage — meal photos)

Firestore + Auth work on the free Spark plan, but **Storage requires Blaze**
on new projects. Daily/monthly traffic for a family app stays well inside the
free quota — you'll almost certainly be billed ₹0/month. Add a billing
account here:
**https://console.firebase.google.com/project/daivik-meal-plan/usage/details**

After Blaze is on:

- **Enable Storage:**
  **https://console.firebase.google.com/project/daivik-meal-plan/storage** →
  click **Get started** → keep the default `daivik-meal-plan.firebasestorage.app` bucket.
- **Deploy Storage rules** (the file `storage.rules` in this repo is ready):
  ```
  firebase deploy --only storage
  ```

Until Blaze + Storage are on, meal-photo and profile-photo upload buttons
will throw a "Could not upload photo" toast. Everything else (logs, growth,
weeks, share to dietician) works without it.

### 4. (Optional) Storage CORS

If photos don't render from Vercel after step 3, run once:

```
gsutil cors set storage-cors.json gs://daivik-meal-plan.firebasestorage.app
```

with `storage-cors.json`:

```json
[
  {
    "origin": ["https://mealplan.mayanakkariya.com", "http://localhost:*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

### 5. Push to GitHub → Vercel redeploys automatically

```
git add .
git commit -m "Migrate data layer to Firebase (Firestore + Storage + Auth)"
git push
```

## Smoke test once steps 1–2 are done

1. Open `https://mealplan.mayanakkariya.com` (or local copy via a static server — `file://` breaks ES modules).
2. Login as Mom (`111111`) → add a meal log → it should write to Firestore.
3. Open the site in another browser, sign in as Family (`444444`) → see the log within ~1 s, no edit buttons visible.
4. Open `guide.html` in a private window (signed out) → should redirect to `index.html`.

## Useful links

- Firebase console: https://console.firebase.google.com/project/daivik-meal-plan/overview
- Firestore data: https://console.firebase.google.com/project/daivik-meal-plan/firestore
- Auth users: https://console.firebase.google.com/project/daivik-meal-plan/authentication/users
- Storage: https://console.firebase.google.com/project/daivik-meal-plan/storage
- Project ID: `daivik-meal-plan`
- Web App ID: `1:197581914517:web:298337cfe85ab6358ff69c`
