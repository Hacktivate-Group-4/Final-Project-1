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
#### *Request Body*
```markdown
{
  "email": "<email>",
  "password": "<password>"
}
`````

#### Endpoint: POST `/users/Login`uf
#### *Response (200)*
```markdown
{
  "access_token": "<your access token>"
}
`````

#### *Response (401)*
``````markdown
{
  "message": "Email or password invalid!"
}
``````
### Create Reflection
#### *Request body*
``````markdown
{
  "success": "<posted success>",
  "low_point": "<posted low point>",
  "take_away": "<posted take away>",
}
``````
### *Request body*
``````markdown
{
  "Authorization": "bearer <your access token>"
}

### *Response (201 - Created)*
``````markdown
{
  "id": <given id by system>,
  "success": "<posted success>",
  "low_point": "<posted low point>",
  "take_away": "<posted take away>",
  "UserId": "<UserId>",
  "createdAt": "2023-04-20T07:15:12.149Z",
  "updatedAt": "2023-04-20T07:15:12.149Z",
}

### *Response (401)*
``````markdown
{
  "message": "Unauthorized"
}



### Get User Reflections
### *Request Header*
``````markdown
{
  "Authorization": "bearer <your access token>"
}

### *Response (200)*
``````markdown
[
	{
  "id": <given id by system>,
  "success": "<posted success>",
  "low_point": "<posted low point>",
  "take_away": "<posted take away>",
  "UserId": "<UserId>",
  "createdAt": "2023-04-20T07:15:12.149Z",
  "updatedAt": "2023-04-20T07:15:12.149Z",
	}
]

### *Reponse (401)*
``````markdown
{
  "message": "Unauthorized"
}
#### Endpoint: GET `/reflections`

### Get User Reflection By ID

#### Endpoint: GET `/reflections/:id`

### Edit User Reflection By ID

#### Endpoint: PUT `/reflections/:id`

### *Request Header*
``````markdown
{
  "Authorization": "bearer <your access token>"
}

### *Request Param*
``````markdown
{
  "id": "<id reflections>"
}

### *Request Body*
``````markdown
{
  "success": "<posted success>",
  "low_point": "<posted low point>",
  "take_away": "<posted take away>"
}

### *Response (200)*
``````markdown
{
  "id": <given id by system>,
  "success": "<posted success>",
  "low_point": "<posted low point>",
  "take_away": "<posted take away>",
  "UserId": "<UserId>",
  "createdAt": "2023-04-20T07:15:12.149Z",
  "updatedAt": "2023-04-20T07:15:12.149Z",
}

### *Response (401)*
``````markdown
{
  "message": "Unauthorized"
}



### Delete User Reflection By ID
### *Request Header*
``````markdown
{
  "Authorization": "bearer <your access token>"
}

#### Endpoint: DELETE `/reflections/:id`
### *Request Params*
``````markdown
{
  "id": "<id reflections>"
}

### Delete Sukses
### *Response (200)*
``````markdown
{
  "message": "Success delete"
}

### 
### *Response (401)*
``````markdown
{
  "message": "Unauthorized"
}

## Lisensi

Proyek REFLECTION API tidak dilisensikan dikarenakan proyek ini hanya untuk pembelajaran.

## Penutup

Kami sangat terbuka terhadap kontribusi. Jika Anda ingin berkontribusi pada proyek ini, silakan buka Issues atau Pull Requests. Kami selalu menyambut kontribusi yang konstruktif.

Sekian Panduan singkat dari proyek kecil kami, Terima kasih!
