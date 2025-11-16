# 🧪 Postman API Testing Guide

## Base URL
```
http://localhost:3000
```

---

## 1️⃣ Register a User

**POST** `/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

**Expected Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673123abc...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

**Save the `access_token` for next requests!**

---

## 2️⃣ Login

**POST** `/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "673123abc...",
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

---

## 3️⃣ Get Current User

**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
{
  "_id": "673123abc...",
  "email": "test@example.com",
  "name": "Test User"
}
```

---

## 4️⃣ Create a Project

**POST** `/projects`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Halloween Collection",
  "description": "Spooky themed Pokemon skins"
}
```

**Expected Response (201):**
```json
{
  "_id": "673456def...",
  "name": "Halloween Collection",
  "description": "Spooky themed Pokemon skins",
  "userId": "673123abc...",
  "createdAt": "2025-11-15T17:30:00.000Z",
  "updatedAt": "2025-11-15T17:30:00.000Z"
}
```

**Save the project `_id` for next requests!**

---

## 5️⃣ Get All Projects

**GET** `/projects`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "_id": "673456def...",
    "name": "Halloween Collection",
    "description": "Spooky themed Pokemon skins",
    "userId": "673123abc...",
    "createdAt": "2025-11-15T17:30:00.000Z",
    "updatedAt": "2025-11-15T17:30:00.000Z"
  }
]
```

---

## 6️⃣ Create a Category

**POST** `/categories`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Pumpkin Skins",
  "projectId": "673456def...",
  "color": "#ff6b35"
}
```

**Expected Response (201):**
```json
{
  "_id": "673789ghi...",
  "name": "Pumpkin Skins",
  "projectId": "673456def...",
  "color": "#ff6b35",
  "createdAt": "2025-11-15T17:35:00.000Z",
  "updatedAt": "2025-11-15T17:35:00.000Z"
}
```

**Save the category `_id` for next requests!**

---

## 7️⃣ Get Categories for a Project

**GET** `/categories/project/673456def...`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "_id": "673789ghi...",
    "name": "Pumpkin Skins",
    "projectId": "673456def...",
    "color": "#ff6b35",
    "createdAt": "2025-11-15T17:35:00.000Z",
    "updatedAt": "2025-11-15T17:35:00.000Z"
  }
]
```

---

## 8️⃣ Create a Pokemon (without files)

**POST** `/pokemon`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Pikachu",
  "projectId": "673456def...",
  "categoryId": "673789ghi...",
  "notes": "Orange and black Halloween themed skin"
}
```

**Expected Response (201):**
```json
{
  "_id": "673abc123...",
  "name": "Pikachu",
  "projectId": "673456def...",
  "categoryId": "673789ghi...",
  "notes": "Orange and black Halloween themed skin",
  "files": [],
  "createdAt": "2025-11-15T17:40:00.000Z",
  "updatedAt": "2025-11-15T17:40:00.000Z"
}
```

**Save the pokemon `_id` for next requests!**

---

## 9️⃣ Get All Pokemon for a Project

**GET** `/pokemon/project/673456def...`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
[
  {
    "_id": "673abc123...",
    "name": "Pikachu",
    "projectId": "673456def...",
    "categoryId": "673789ghi...",
    "notes": "Orange and black Halloween themed skin",
    "files": [],
    "createdAt": "2025-11-15T17:40:00.000Z",
    "updatedAt": "2025-11-15T17:40:00.000Z"
  }
]
```

---

## 🔟 Upload Main Image

**POST** `/pokemon/673abc123.../main-image`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Body (form-data):**
```
KEY: file
VALUE: [Select an image file]
TYPE: File
```

**Expected Response (200):**
```json
{
  "_id": "673abc123...",
  "name": "Pikachu",
  "projectId": "673456def...",
  "categoryId": "673789ghi...",
  "notes": "Orange and black Halloween themed skin",
  "mainImage": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v123.../pikachu.png",
    "publicId": "pokemon/673456def.../673abc123.../main_abc123"
  },
  "files": [],
  "createdAt": "2025-11-15T17:40:00.000Z",
  "updatedAt": "2025-11-15T17:45:00.000Z"
}
```

---

## 1️⃣1️⃣ Upload Pokemon Files

**POST** `/pokemon/673abc123.../files?type=skin&folder=v1`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Params:**
```
type: skin
folder: v1
```

**Body (form-data):**
```
KEY: files
VALUE: [Select one or more files]
TYPE: File (can select multiple)
```

**Expected Response (200):**
```json
{
  "_id": "673abc123...",
  "name": "Pikachu",
  "projectId": "673456def...",
  "categoryId": "673789ghi...",
  "notes": "Orange and black Halloween themed skin",
  "mainImage": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "pokemon/.../main_abc123"
  },
  "files": [
    {
      "_id": "673def456...",
      "name": "pikachu_skin.png",
      "type": "skin",
      "folder": "v1",
      "url": "https://res.cloudinary.com/...",
      "publicId": "pokemon/.../abc123",
      "uploadedAt": "2025-11-15T17:50:00.000Z"
    }
  ],
  "createdAt": "2025-11-15T17:40:00.000Z",
  "updatedAt": "2025-11-15T17:50:00.000Z"
}
```

---

## 1️⃣2️⃣ Download a File

**GET** `/pokemon/673abc123.../files/673def456...`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
{
  "_id": "673def456...",
  "name": "pikachu_skin.png",
  "type": "skin",
  "folder": "v1",
  "url": "https://res.cloudinary.com/your-cloud/image/upload/v123.../pikachu_skin.png",
  "publicId": "pokemon/673456def.../673abc123.../abc123",
  "uploadedAt": "2025-11-15T17:50:00.000Z"
}
```

---

## 1️⃣3️⃣ Delete a File

**DELETE** `/pokemon/673abc123.../files/673def456...`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
{
  "_id": "673abc123...",
  "name": "Pikachu",
  "files": [],
  "createdAt": "2025-11-15T17:40:00.000Z",
  "updatedAt": "2025-11-15T17:55:00.000Z"
}
```

---

## 1️⃣4️⃣ Update a Pokemon

**PATCH** `/pokemon/673abc123...`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Pikachu Halloween",
  "notes": "Updated with better textures"
}
```

**Expected Response (200):**
```json
{
  "_id": "673abc123...",
  "name": "Pikachu Halloween",
  "projectId": "673456def...",
  "categoryId": "673789ghi...",
  "notes": "Updated with better textures",
  "files": [],
  "createdAt": "2025-11-15T17:40:00.000Z",
  "updatedAt": "2025-11-15T18:00:00.000Z"
}
```

---

## 1️⃣5️⃣ Delete a Pokemon

**DELETE** `/pokemon/673abc123...`

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Expected Response (200):**
```json
{
  "_id": "673abc123...",
  "name": "Pikachu Halloween",
  "projectId": "673456def...",
  "categoryId": "673789ghi...",
  "notes": "Updated with better textures",
  "files": [],
  "createdAt": "2025-11-15T17:40:00.000Z",
  "updatedAt": "2025-11-15T18:00:00.000Z"
}
```

---

## 🎯 Complete Testing Flow

### Step-by-step in order:

1. **Register** → Save `access_token`
2. **Get Me** → Verify auth works
3. **Create Project** → Save `projectId`
4. **Get Projects** → Verify project created
5. **Create Category** → Save `categoryId`
6. **Get Categories** → Verify category created
7. **Create Pokemon** → Save `pokemonId`
8. **Get Pokemon** → Verify pokemon created
9. **Upload Main Image** → Verify image uploaded to Cloudinary
10. **Upload Files** → Verify files uploaded
11. **Download File** → Get file URL
12. **Update Pokemon** → Change name/notes
13. **Delete File** → Remove one file
14. **Delete Pokemon** → Remove entire pokemon
15. **Delete Category** → `DELETE /categories/{categoryId}`
16. **Delete Project** → `DELETE /projects/{projectId}`

---

## 📋 Postman Collection Setup

1. **Create Environment:**
   - `base_url`: `http://localhost:3000`
   - `access_token`: (will be set automatically)
   - `project_id`: (will be set manually)
   - `category_id`: (will be set manually)
   - `pokemon_id`: (will be set manually)

2. **Auto-save tokens with Tests:**

Add this to the **Tests** tab of your Register/Login requests:

```javascript
// Parse response
var jsonData = pm.response.json();

// Save token to environment
pm.environment.set("access_token", jsonData.access_token);

// Save user ID
pm.environment.set("user_id", jsonData.user._id);
```

3. **Use variables in requests:**
   - URL: `{{base_url}}/auth/login`
   - Header: `Authorization: Bearer {{access_token}}`

---

## 🔍 Common Errors

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Fix:** Add `Authorization: Bearer YOUR_TOKEN` header

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Project not found"
}
```
**Fix:** Check if the ID exists and belongs to your user

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```
**Fix:** Check request body matches the DTO requirements

---

## 🚀 Quick Test Script

Copy this into Postman **Collection Runner** or use individually:

1. Register User
2. Login User
3. Create Project
4. Create 2-3 Categories
5. Create 5-10 Pokemon
6. Upload images to each
7. Upload files to each
8. Test filtering by category
9. Test updates
10. Test deletions

---

Happy testing! 🎮
