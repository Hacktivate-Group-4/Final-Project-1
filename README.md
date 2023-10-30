# Proyek REFLECTION API

Proyek ini dikembangkan sebagai bagian dari tugas Final Project Pertama dari Hacktivate Indonesia.

## Deskripsi

Proyek REFLECTION API adalah sebuah aplikasi yang memungkinkan pengguna untuk melakukan CRUD Reflection. Aplikasi ini memiliki berbagai fitur Keamanan berupa Autentikasi dan Authorisasi.

## Panduan API

CRUD REFLECTION API adalah salah satu fitur utama yang memungkinkan pengembang aplikasi lain untuk berinteraksi dengan proyek ini. Panduan API ini memberikan instruksi tentang cara menggunakan API, termasuk endpoint yang tersedia, permintaan yang diperlukan, dan respons yang diharapkan.

### Register User

#### Endpoint: POST `/users/register`
##### Dengan Mengirimkan request body :
```markdown
{
  "email": "<email>",
  "password": "<password>"
}
```
##### Output dari endpoint ini :
###### *Response (201 - Created)*

```markdown
{
  "id": <given id by system>,
  "email": "<email>"
}

```
###### *Response (400 - Bad Request)*

```markdown
{
  "message": "Email already used!"
}

```

### Login User

#### Endpoint: POST `/users/Login`

### Create Reflection

#### Endpoint: POST `/users/register`

### Get User Reflections

#### Endpoint: GET `/reflections`

### Get User Reflection By ID

#### Endpoint: GET `/reflections/:id`

### Edit User Reflection By ID

#### Endpoint: PUT `/reflections/:id`

### Delete User Reflection By ID

#### Endpoint: DELETE `/reflections/:id`



## Lisensi

Proyek REFLECTION API tidak dilisensikan dikarenakan proyek ini hanya untuk pembelajaran.

## Penutup

Kami sangat terbuka terhadap kontribusi. Jika Anda ingin berkontribusi pada proyek ini, silakan buka Issues atau Pull Requests. Kami selalu menyambut kontribusi yang konstruktif.

Sekian Panduan singkat dari proyek kecil kami, Terima kasih!
