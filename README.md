# GET REQUESTS

http://localhost:8080/user/get-user/:uid<br>
http://localhost:8080/user/confirm-email/:confirmation_code<br>
http://localhost:8080/user/get-profile-pic/:uid<br>
http://localhost:8080/user/get-trees/:uid<br>
http://localhost:8080/user/register/:referral_code<br>
http://localhost:8080/ref-link/get-people-referred/:uid<br>
http://localhost:8080/ref-link/gen-ref-link/:uid<br>
http://localhost:8080/ref-link/register/:referral_codeuid<br>
http://localhost:8080/ref-link/get-ref-code/:uid<br>
http://localhost:8080/packs/get-packages<br>
http://localhost:8080/packs/get-bundles<br>
http://localhost:8080/transaction/get-trans/:uid<br>



# POST REQUESTS

### Register User
http://localhost:8080/user/register

``` json
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
http://localhost:8080/user/login

``` json
{
  "email": "your email",
  "pass": "your password"
}
```

### Reset Password
http://localhost:8080/user/reset-pass

``` json
{
  "code": "123",
  "new_pass": "new password"
}
```

### Request password reset
http://localhost:8080/user/req-pass-reset

``` json
{
  "email": "abc@xyz.com"
}
```

### Edit profile request - Form data
http://localhost:8080/user/edit/<uid>?remove_image=true/false

``` json
{
  "name": "New Name",
  "city": "New City"
}
```

### Buy Package
http://localhost:8080/transaction/buy-package

``` json
{
  "uid": "uid",
  "pid": "pid"
}
```

### Buy Bundle
http://localhost:8080/transaction/buy-bundle

``` json
{
  "uid": "uid",
  "bid": "bid"
}
```

### Modify Balance to Wallet
http://localhost:8080/admin/mod-balance

``` json
{
  "uid": "uid",
  "amount": 100
}
```
