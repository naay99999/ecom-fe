# E-commerce Frontend

Frontend สำหรับแพลตฟอร์ม e-commerce สร้างด้วย React และ Vite ครอบคลุมหน้าร้านค้า การค้นหา/หมวดหมู่ ตะกร้าสินค้า Checkout การยืนยันคำสั่งซื้อ การยืนยันตัวตน และพื้นที่บัญชีผู้ใช้

## Technology

- React 19 + Vite 8
- React Router สำหรับ routing
- TanStack Query สำหรับ server state และ data fetching
- Tailwind CSS 4 และ shadcn-style UI components
- MSW สำหรับจำลอง API ระหว่างพัฒนา
- Vitest และ ESLint สำหรับตรวจสอบคุณภาพโค้ด

## เริ่มต้นใช้งาน

ต้องมี Node.js เวอร์ชันที่รองรับ Vite 8 และ npm

```bash
npm install
cp .env.example .env
npm run dev
```

เปิด `http://localhost:5173` ในเบราว์เซอร์ โดย Vite จะ reload หน้าเว็บให้อัตโนมัติเมื่อมีการแก้ไขไฟล์

## Environment variables

กำหนดค่าในไฟล์ `.env` (อ้างอิงจาก `.env.example`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `/api` | Base URL ของ backend API เช่น `https://api.example.com` |
| `VITE_API_TIMEOUT_MS` | `10000` | ระยะเวลา timeout ของ API request หน่วยมิลลิวินาที |
| `VITE_ENABLE_MSW` | `false` | กำหนดเป็น `true` เพื่อเปิด mock API ใน development |

MSW จะทำงานเฉพาะ development mode เท่านั้น โดยแก้ไข mock endpoints และ responses ได้ที่ `src/mocks/handlers.js`

## คำสั่งที่ใช้บ่อย

```bash
npm run dev       # เริ่ม development server
npm run test      # รัน unit tests ด้วย Vitest
npm run lint      # ตรวจ ESLint
npm run build     # สร้าง production bundle ใน dist/
npm run preview   # เปิดดู production bundle ในเครื่อง
```

ก่อนส่งงานให้รันอย่างน้อย:

```bash
npm run test
npm run lint
npm run build
```

## โครงสร้างโปรเจกต์

```text
src/
├── pages/          # หน้าแต่ละ route เช่นสินค้า ตะกร้า checkout และบัญชี
├── layouts/        # เปลือกหน้าร่วม เช่น Root, Account และ Checkout layouts
├── features/       # UI และ logic ตามโดเมนธุรกิจ
├── components/ui/  # reusable UI primitives
├── lib/            # API client, React Query client และ utilities กลาง
├── mocks/          # MSW browser setup และ mock handlers
├── router.js       # นิยาม routes ทั้งหมด
├── providers.jsx   # Router, Query Client และ UI providers
└── styles/         # global styles
```

## แนวทางพัฒนาต่อ

- เพิ่มหน้าหรือ nested route ใน `src/router.js` และวาง page component ใน `src/pages/`
- วาง logic ที่ผูกกับโดเมนไว้ใต้ `src/features/<domain>/` และย้าย UI ที่ใช้ข้ามโดเมนไป `src/components/ui/`
- เรียก backend ผ่าน `apiClient` จาก `src/lib/api/client.js` เพื่อให้การจัดการ JSON, timeout และ error เป็นมาตรฐานเดียวกัน
- ใช้ TanStack Query สำหรับข้อมูลจาก API ที่ต้อง cache, refetch หรือ synchronize กับ UI
- เพิ่มหรือปรับ mock API ใน `src/mocks/handlers.js` เพื่อให้พัฒนาหน้าจอได้โดยไม่ต้องรอ backend
- สร้าง test ไว้ข้างไฟล์ที่ครอบคลุม โดยใช้ชื่อ `*.test.js` หรือ `*.test.jsx`

## Routes หลัก

| กลุ่ม | เส้นทาง |
| --- | --- |
| สินค้า | `/`, `/products`, `/products/:productId`, `/categories/:slug`, `/search` |
| การสั่งซื้อ | `/cart`, `/checkout`, `/checkout/success` |
| การยืนยันตัวตน | `/login`, `/register`, `/forgot-password` |
| บัญชีผู้ใช้ | `/account`, `/account/profile`, `/account/addresses`, `/account/orders`, `/account/orders/:orderId` |
| อื่น ๆ | `/wishlist`, `/about`, `/contact` |

## Git workflow

- `main` คือ production: ห้ามพัฒนาโดยตรง
- `develop` คือ branch สำหรับรวมงานพัฒนาและ shared testing
- `staging` ใช้สำหรับ QA และการตรวจรับก่อน release
- เริ่มงานจาก `develop` และสร้าง branch ตามรูปแบบ `<type>/<task-name>` โดย `type` ใช้ `feat`, `fix`, `hotfix`, `refactor` หรือ `chore`

```bash
git switch develop
git pull origin develop
git switch -c feat/product-filters

# แก้ไขโค้ด แล้วตรวจสอบคุณภาพ
npm run test
npm run lint
npm run build

git add <files>
git commit -m "feat: add product filters"
git push -u origin feat/product-filters
```

จากนั้นเปิด Pull Request เข้า `develop` พร้อมสรุป user-visible changes, routes ที่ได้รับผลกระทบ, issue ที่เกี่ยวข้อง (ถ้ามี), screenshot สำหรับงาน UI และผลการตรวจสอบที่รันแล้ว เมื่อพร้อมปล่อยให้ promote ตามลำดับ `develop` → `staging` → `main`

## Deployment

สร้างไฟล์ production ด้วย `npm run build` แล้วนำโฟลเดอร์ `dist/` ไป deploy บน static hosting หรือ web server ที่ตั้งค่า fallback ให้ `index.html` สำหรับ client-side routing
