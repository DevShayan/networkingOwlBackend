# GET REQUESTS

### Get current logged in user/admin
https://localhost:8080/user/get-curr-user

### Get user
https://localhost:8080/admin/get-user/:uid

### Confirm email (by clicking email link)
https://localhost:8080/user/confirm-email/:confirmation_code

### Get profile picture
https://localhost:8080/user/get-profile-pic/:uid


### Get user trees
https://localhost:8080/user/get-trees/:uid

### Logout current user
https://localhost:8080/user/logout

### Get users referred by user
https://localhost:8080/ref-link/get-people-referred/:uid

### Generate referral link
https://localhost:8080/ref-link/gen-ref-link/:uid

### Get referral link
https://localhost:8080/ref-link/get-ref-link/:uid

### Get all packages
https://localhost:8080/packs/get-packages

### Get all bundles
https://localhost:8080/packs/get-bundles

### Get bundle picture
https://localhost:8080/packs/get-bundle-pic/:bid

### Get transactions of user
https://localhost:8080/transaction/get-trans/:uid



# POST REQUESTS

### Register User
https://localhost:8080/user/register

``` jsonc
{
  "user": {
    "name": "Ahmed",
    "city": "Pishawar",
    "email": "ahmed@app.com",
    "password": "456",
    "curr_package": {
      "name": "my-pack-1",
      "price": 500
    },
    "dob": "2001-03-12T13:37:27+00:00",
    "country": "Pakistan",
    "phone_no": "+92 123 4567891"
  },
  "ref_code": "123" // nullable
}
```


``` json
{
  "user": {
    "name": "King Khan",
    "city": "New York",
    "date_joined": "2023-03-12T13:37:27+00:00",
    "email": "kingkhanepe@gmail.com",
    "password": "111",
    "curr_package": "_id",
    "dob": "2002-03-12T13:37:27+00:00",
    "country": "USA",
    "phone_no": "+92 123 4567895"
  }
}
```

### Login
https://localhost:8080/user/login

``` json
{
  "email": "your email",
  "pass": "your password",
  "is_admin": "false"
}
```

### Reset Password
https://localhost:8080/user/reset-pass

``` json
{
  "code": "123",
  "new_pass": "new password"
}
```

### Request password reset
https://localhost:8080/user/req-pass-reset

``` json
{
  "email": "abc@xyz.com"
}
```

### Edit profile request - Form data
https://localhost:8080/user/edit/<uid>?remove_image=true/false

``` json
{
  "name": "New Name",
  "city": "New City"
}
```

### Buy Package
https://localhost:8080/transaction/buy-package

``` json
{
  "uid": "uid",
  "pid": "pid"
}
```

### Buy Bundle
https://localhost:8080/transaction/buy-bundle

``` json
{
  "uid": "uid",
  "bid": "bid"
}
```

### Modify Balance to Wallet
https://localhost:8080/admin/mod-balance

``` json
{
  "uid": "uid",
  "amount": 100
}
```
