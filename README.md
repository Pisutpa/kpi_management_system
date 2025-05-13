
# Fullstack Project

โปรเจกต์เว็บแอปพลิเคชันแบบ Fullstack ประกอบด้วย **Frontend (React)** และ **Backend (Node.js + Express + PostgreSQL)**

---

## 🖥️ Frontend

แอปพลิเคชันฝั่งหน้าเว็บ (Frontend) พัฒนาด้วย **Vite**, **TailwindCSS**, **Zustand**, **Recharts** และไลบรารียอดนิยมอื่น ๆ

### Features

- ⚡️ **Vite** สำหรับการพัฒนาและ build อย่างรวดเร็ว  
- 🎨 **TailwindCSS** สำหรับการออกแบบ UI แบบ utility-first  
- 📊 **Chart.js** และ **Recharts** สำหรับการแสดงผลข้อมูลด้วยกราฟ  
- 🌍 **React Router v7** สำหรับการจัดการเส้นทาง (Routing)  
- 🔥 **Zustand** สำหรับจัดการ state แบบง่ายและขยายได้  
- ✉️ **React Toastify** สำหรับแสดงการแจ้งเตือน (Notification)

### Prerequisites

- [Node.js](https://nodejs.org/) >= **20.x**  
- [npm](https://www.npmjs.com/) >= **9.x**  
  *(หรือใช้ [pnpm](https://pnpm.io/) หรือ [yarn](https://yarnpkg.com/) แทนได้)*

### Getting Started

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/frontend.git
cd frontend
```

#### 2️⃣ Install dependencies

```bash
npm install
```

#### 3️⃣ Run the development server

```bash
npm run dev
```

แอปจะเปิดที่ [http://localhost:5173]

---

## ⚙️ Backend API

API ฝั่งเซิร์ฟเวอร์ (Backend) ที่พัฒนาด้วย **Node.js**, **Express**, **PostgreSQL**, และระบบยืนยันตัวตนด้วย **JWT**

### Features

- ⚡️ **Express.js** สำหรับสร้าง RESTful API ที่มีประสิทธิภาพ  
- 🔐 **JWT Authentication** สำหรับการยืนยันตัวตนที่ปลอดภัย  
- 🛡️ **bcrypt** สำหรับการแฮชรหัสผ่าน  
- 🌍 **CORS** สำหรับรองรับการเรียกใช้งานข้ามโดเมน  
- 📄 **Morgan** สำหรับ log คำร้องขอ HTTP  
- 🗄️ **PostgreSQL** ฐานข้อมูลที่ใช้งานผ่าน **pg** library  
- 🌱 **dotenv** สำหรับจัดการ environment variables  
- 🚀 **Nodemon** สำหรับรีโหลดเซิร์ฟเวอร์อัตโนมัติระหว่างพัฒนา
- 📝 **pdfkit** สำหรับการสร้างไฟล์ PDF
- 📊 **json2csv** สำหรับการแปลงข้อมูลจาก JSON เป็น CSV
- 🛠️ **iconv-lite** สำหรับแปลงรหัสตัวอักษ
### Prerequisites

- [Node.js](https://nodejs.org/) >= **20.x**  
- [npm](https://www.npmjs.com/) >= **9.x**  
- [PostgreSQL](https://www.postgresql.org/) >= **14.x**

### Getting Started

#### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/backend.git
cd backend
```

#### 2️⃣ Install dependencies

```bash
npm install
```

#### 3️⃣ Set up environment variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก และกำหนดค่าต่อไปนี้

```bash
# .env

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
JWT_SECRET=your_jwt_secret_key
```

> ⚠️ **สำคัญ:** แทนที่ `username`, `password`, `database_name`, และ `JWT_SECRET` ด้วยค่าจริงของคุณ

🗄️ Set up Database Schema
หลังจากคุณสร้างฐานข้อมูล PostgreSQL แล้ว ให้รัน SQL ด้านล่างนี้เพื่อสร้างตารางที่จำเป็น:

```bash 
-- roles table 
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('admin', 'user'))
);

INSERT INTO roles (name) VALUES ('admin'), ('user');

-- users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- kpis table
CREATE TABLE kpis (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2) NOT NULL,
    actual_value DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) CHECK (status IN ('On Track', 'At Risk', 'Off Track')),
    assigned_user INT REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- kpi_updates table
CREATE TABLE kpi_updates (
    id SERIAL PRIMARY KEY,
    kpi_id INT REFERENCES kpis(id) ON DELETE CASCADE,
    updated_value DECIMAL(10,2) NOT NULL,
    comment TEXT,
    updated_by INT REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4️⃣ Start the development server

```bash
npm start
```

เซิร์ฟเวอร์จะทำงานที่ [http://localhost:5000]

---
## API Documentation
### Authentication Endpoints
- POST /api/register - สมัครสมาชิก
- POST /api/login - เข้าสู่ระบบ
- POST /api/current-user - ตรวจสอบสถานะผู้ใช้ปัจจุบัน
- GET /api/current-admin - ตรวจสอบสถานะผู้ดูแลระบบ (Admin)
### Kpis Manage Admin Endpoints
- POST /api/api/kpi (Admin) - สร้าง KPI ใหม่
- GET /api/kpis (Admin)- ดึงข้อมูล KPI ทั้งหมด
- GET api/kpi/:id (Admin)- ดึงข้อมูล KPI ตาม ID
- PUT /api/kpi/:id (Admin) - อัปเดต KPI
- DELETE /api/kpi/:id (Admin) - ลบ KPI
### User Manage Admin Endpoints
- POST /api/user (Admin) - สร้างผู้ใช้ใหม่
- GET /api/users (Admin) - ดึงข้อมูลผู้ใช้ทั้งหมด
- GET /api/user/:id (Admin) - ดึงข้อมูลผู้ใช้ตาม ID
- PUT /api/user/:id (Admin) - อัปเดตข้อมูลผู้ใช้ 
- DELETE /api/user/:id (Admin) - ลบผู้ใช้
### Manage User Endpoints
- GET /api/my-users/:id - ดึงข้อมูลKPIของผู้ใช้
- PUT api/my-users/kpis/:id  - อัปเดตข้อมูลKPIของผู้ใช้
### Overview Endpoints
- GET /api/overview - ดึงข้อมูลทั้งหมดมาแสดงในหน้า dashboard
## 🛠️ Tech Stack

| ส่วน | เทคโนโลยี |
|------|------------|
| **Frontend** | React, Vite, TailwindCSS, Zustand, Recharts, Chart.js, React Router, React Toastify |
| **Backend** | Node.js, Express.js, PostgreSQL, JWT, bcrypt, dotenv, Morgan, CORS |

---
## 🛠️ **หมายเหตุในการพัฒนา**

- โปรเจกต์นี้ใช้ **Nodemon** สำหรับการรีโหลดอัตโนมัติระหว่างการพัฒนา โดยจะตรวจจับการเปลี่ยนแปลงในไฟล์และเริ่มต้นเซิร์ฟเวอร์ใหม่
- โปรดตรวจสอบให้แน่ใจว่าคุณได้ตั้งค่าตัวแปรสภาพแวดล้อมในไฟล์ `.env` อย่างถูกต้อง รวมถึงการเชื่อมต่อกับฐานข้อมูลและ **JWT secret**
- ฐานข้อมูล **PostgreSQL** ควรทำงานอยู่ในเครื่องหรือบนเซิร์ฟเวอร์ที่คุณตั้งค่าไว้


## 📸 Screenshots

## 1.ภาพรวมแดชบอร์ด

ภาพหน้าจอนี้แสดงแดชบอร์ดหลักของ MyAppKpi สำหรับภาพรวม KPI.

**องค์ประกอบหลัก:**

* **ส่วนหัว:** โลโก้ MyAppKpi, ปุ่มเข้าสู่ระบบ/ลงทะเบียน
* **สรุป KPI:** จำนวน KPI ทั้งหมด (12), KPI ที่สำเร็จ (5), อัตราความสำเร็จ (41.67%)
* **แสดงข้อมูล KPI:**
    * แนวโน้มความสำเร็จของ KPI (กราฟเส้น).
    * การแบ่งตามหมวดหมู่ KPI (แผนภูมิวงกลม).
* **รายการ KPI ละเอียด:** ตารางแสดงรายการ KPI พร้อมชื่อ, สถานะ, วันที่เริ่มต้น, วันที่สิ้นสุด และระบบแบ่งหน้า.
* **ส่วนท้าย:** ทีมผู้จัดทำและวันที่

**หน้าที่:**

แดชบอร์ดนี้ใช้สำหรับติดตามและวิเคราะห์ KPI โดยให้สรุปเมตริก, แสดงข้อมูลแนวโน้ม, และแสดงรายการ KPI ละเอียด.
![](Screenshot/1homedashborad.png)

## 2.หน้าจอลงทะเบียนผู้ใช้ใหม่

ภาพนี้แสดงหน้าจอลงทะเบียนผู้ใช้ใหม่.

**องค์ประกอบหลัก:**


* **ส่วนหัว:** โลโก้ "MyAppKpi", ปุ่ม "Login", "Register".
* **แบบฟอร์ม:** ช่องชื่อผู้ใช้, ช่องอีเมล, ช่องรหัสผ่าน, ช่องยืนยันรหัสผ่าน, ปุ่ม "Register".


**หน้าที่:**

หน้าจอนี้มีหน้าที่หลักในการให้ผู้ใช้ใหม่สามารถสร้างบัญชีส่วนตัวเพื่อเข้าถึง
และใช้งานฟังก์ชันต่างๆ
![](Screenshot/2register.png)
## 3.หน้าจอเข้าสู่ระบบ

หน้าจอนี้ใช้สำหรับให้ผู้ใช้เข้าสู่ระบบ MyAppKpi.

**องค์ประกอบหลัก:**

* **ส่วนหัว:** โลโก้ MyAppKpi, ปุ่มลงทะเบียน.
* **แบบฟอร์ม:** ช่องชื่อผู้ใช้, ช่องรหัสผ่าน, ปุ่มเข้าสู่ระบบ.

**หน้าที่:**

ผู้ใช้เข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่าน หรือไปยังหน้าลงทะเบียน.
![](Screenshot/3login.png)

## 4.รายละเอียด KPI ของผู้ใช้

หน้าจอนี้แสดงรายละเอียด KPI ของผู้ใช้ใน MyAppKpi.

**องค์ประกอบหลัก:**

* **ส่วนหัว:** โลโก้ MyAppKpi, ข้อมูลผู้ใช้ ("Welcome, pisu2").
* **หัวเรื่อง:** "รายละเอียด KPI ของคุณ".
* **ตาราง KPI:**
    * คอลัมน์: ลำดับ, ชื่อ KPI, ค่าเป้าหมาย, ค่าจริง, สถานะ, ปุ่มดำเนินการ.

**หน้าที่:**

ผู้ใช้ดู KPI ที่เกี่ยวข้อง, ติดตามความคืบหน้า, ทราบสถานะ, และดำเนินการที่เกี่ยวข้องได้
![](Screenshot/4userdashborad.png)

## 5. อัปเดต KPI ของผู้ใช้

หน้าจอนี้ใช้สำหรับอัปเดต KPI ของผู้ใช้ใน MyAppKpi.

**องค์ประกอบหลัก:**

* **ส่วนหัว:** โลโก้ MyAppKpi, ข้อมูลผู้ใช้ ("Welcome, pisu2").
* **หัวเรื่อง:** "รายละเอียด KPI ของคุณ".
* **ตาราง KPI:**
    * คอลัมน์: ลำดับ, ชื่อ KPI, ค่าเป้าหมาย, ค่าจริง, สถานะ, ปุ่มดำเนินการ.
* **อัปเดต:** ค่าใหม่, ความคิดเห็น, บันทึก.

**หน้าที่:**

ผู้ใช้อัปเดตและบันทึกข้อมูล KPI ที่เกี่ยวข้องกับตนเอง.


![](Screenshot/5updatekpiuser.png)

# 6.KPI Dashboard Admin

หน้านี้แสดงภาพรวมและรายละเอียดของตัวชี้วัดผลการดำเนินงาน (Key Performance Indicators)

## ส่วนหัว (Header)

* **Admin Panel:** ข้อความที่แสดงอยู่ด้านบนซ้าย บ่งบอกว่าเป็นส่วนควบคุมของผู้ดูแลระบบ
* **KPI Dashboard:** ชื่อหน้าปัจจุบัน
* **ตัวกรองสถานะ KPI:** มีปุ่ม **On Track** (สีเขียว), **At Risk** (สีเหลือง), และ **Off Track** (สีแดง) ซึ่งน่าจะใช้สำหรับกรอง KPI ตามสถานะ
* **ตัวเลือกเพิ่มเติม:** มีเมนูแบบเลื่อนลง (Dropdown) สำหรับเลือกมุมมองหรือตัวกรองอื่น ๆ (ข้อความภาษาไทยอ่านไม่ออกชัดเจน)

## ภาพรวม KPI (KPI Overview)

* **แผนภูมิวงกลม (Pie Chart):** แสดงสัดส่วนของ KPI ตามสถานะต่าง ๆ (On Track, At Risk, Off Track) พร้อมคำอธิบายสี
* **KPI Trends (แนวโน้ม KPI):**
    * **กราฟเส้น (Line Chart):** แสดงแนวโน้มของ KPI ตามช่วงเวลา โดยแกน X เป็นเดือนและปี (ตั้งแต่ 2024-12 ถึง 2026-09) และแกน Y เป็นค่า KPI (ตัวเลข 0 ถึง 3)
    * มีคำอธิบายกราฟเป็นภาษาไทยว่า "**จำนวน KPI ที่เปลี่ยนแปลง**"

## KPI ที่บรรลุเป้าหมาย (Achieved KPIs)

* **ข้อความ:** "**Achieved KPIs: 41.67%**" แสดงเปอร์เซ็นต์ของ KPI ที่บรรลุเป้าหมาย
* **ตาราง:** แสดงรายการ KPI ที่มีรายละเอียดดังนี้:

    | No. | Title                                  | Status   | Assigned User | Start Date     | End Date       |
    | --- | -------------------------------------- | -------- | ------------- | -------------- | -------------- |
    | 1   | ยอดขายรถยนต์ไตรมาส 1 ปี 2568           | On Track | john          | 31 ธันวาคม 2568 | 31 มีนาคม 2569 |
    | 2   | ยอดขายรถยนต์ไตรมาส 2 ปี 2568           | On Track | 

* **การนำทางตาราง:** มีตัวเลือกสำหรับแสดงจำนวนรายการต่อหน้า (5 รายการถูกเลือก) และปุ่มสำหรับไปยังหน้าถัดไป/ก่อนหน้า ("หน้า 1/3", "ถัดไป")

## เมนูหลักด้านซ้าย (Main Navigation)

* **Dashboard:** แถบเมนูที่น่าจะนำไปยังหน้าหลัก
* **Manage Kpi:** แถบเมนูสำหรับจัดการ KPI
* **Manage User:** แถบเมนูสำหรับจัดการผู้ใช้งาน

## ส่วนบนขวา (Top Right)

* ไอคอนผู้ใช้งานและชื่อ พร้อมเมนูแบบเลื่อนลง

## หน้าที่
หน้าที่หลักของ "KPI Dashboard Admin" คือ แสดงภาพรวมและรายละเอียด KPI เพื่อให้ผู้ดูแลระบบติดตามและประเมินผลได้รวดเร็ว โดยนำเสนอสถานะ, แนวโน้ม, รายละเอียด KPI, ภาพรวมความสำเร็จ และมีส่วนจัดการ
![](Screenshot/6dashboradadmin.png)

## 7. หน้าจอจัดการ KPI

หน้าจอนี้ใช้สำหรับจัดการ KPI ใน MyAppKpi.

**องค์ประกอบหลัก:**

* **ส่วนหัว:** Admin Panel, Dashboard, Manage Kpi, Manage User, ข้อมูลผู้ใช้.

* **หัวเรื่อง:** "รายละเอียด KPI ของคุณ".

* **แบบฟอร์มสร้าง KPI:** Title, Description, Target Value, Actual Value, Status, Assigned User, Start Date, End Date, ปุ่ม Create KPI.

* **ดาวน์โหลดเทมเพลต CSV:** ปุ่มสีเขียวสำหรับดาวน์โหลดเทมเพลต CSV ซึ่งน่าจะใช้สำหรับการนำเข้า KPI หลายรายการพร้อมกัน

* **ดาวน์โหลดรายงาน PDF:** ปุ่มสีแดงสำหรับดาวน์โหลดรายงาน PDF ของ KPI

* **ตาราง KPI:** ค่าใหม่, ความคิดเห็น, บันทึก.
   *คอลัมน์: ลำดับ, ชื่อ KPI, สถานะ, ผู้รับผิดชอบ, วันที่เริ่มต้น, วันที่สิ้นสุด, จัดการ (ปุ่มแก้ไข/ลบ).
**หน้าที่:**

ผู้ดูแลระบบสร้าง, แก้ไข, ลบ และจัดการข้อมูล KPI.

![](Screenshot/7managekpi.png)

# 8. หน้าจัดการผู้ใช้งาน (Admin - User Management)

 ผู้ดูแลระบบ (Admin) สามารถจัดการข้อมูลผู้ใช้งานในระบบได้

**องค์ประกอบหลัก:**

* **สร้างผู้ใช้งาน:** กรอกข้อมูล (ชื่อผู้ใช้, อีเมล, รหัสผ่าน, บทบาท) และกด "สร้าง"
* **แสดงรายชื่อผู้ใช้งาน:** ตารางแสดงข้อมูลผู้ใช้งาน (ลำดับ, ชื่อผู้ใช้, ประเภทผู้ใช้)
* **จัดการผู้ใช้งาน:** มีปุ่มแก้ไขและลบสำหรับแต่ละผู้ใช้งาน

**รายละเอียด:**

* **แบบฟอร์มสร้างผู้ใช้งาน:**
    * **ชื่อผู้ใช้ (Username):** ช่องสำหรับชื่อผู้ใช้ใหม่
    * **อีเมล (Email):** ช่องสำหรับอีเมลผู้ใช้
    * **รหัสผ่าน (Password):** ช่องสำหรับรหัสผ่าน
    * **ประเภทผู้ใช้งาน (Select role):** เลือกบทบาท (เช่น Admin, User)
    * **ปุ่ม "Create":** สร้างบัญชีใหม่
* **ตารางรายชื่อผู้ใช้งาน:**
    * **NO.:** ลำดับ
    * **ชื่อ:** ชื่อผู้ใช้
    * **ประเภทผู้ใช้งาน:** บทบาท
    * **จัดการ:**
        * **ปุ่มแก้ไข:** แก้ไขข้อมูลผู้ใช้
        * **ปุ่มลบ:** ลบบัญชีผู้ใช้

![](Screenshot/8manageuser.png)
