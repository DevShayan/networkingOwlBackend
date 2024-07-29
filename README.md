[

/////////////////////////// GET REQUESTS ///////////////////////////

// http://localhost:8080/user/get-user/<uid>
// http://localhost:8080/user/confirm-email/<confirmation_code>
// http://localhost:8080/user/get-profile-pic/<uid>
// http://localhost:8080/user/get-trees/<uid>
// http://localhost:8080/user/register/<referral_code>

// http://localhost:8080/ref-link/get-people-referred/<uid>
// http://localhost:8080/ref-link/gen-ref-link/<uid>
// http://localhost:8080/ref-link/register/<referral_codeuid>
// http://localhost:8080/ref-link/get-ref-code/<uid>

// http://localhost:8080/packs/get-packages
// http://localhost:8080/packs/get-bundles

// http://localhost:8080/transaction/get-trans/<uid>



////////////////////////// POST REQUESTS //////////////////////////

// Register User: http://localhost:8080/user/register

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
},

///////////////////////

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
},

// Login: http://localhost:8080/user/login

{
  "email": "your email",
  "pass": "your password"
},

// reset pass: http://localhost:8080/user/reset-pass

{
  "code": "123",
  "new_pass": "new password"
},

// Request password reset: http://localhost:8080/user/req-pass-reset

{
  "email": "abc@xyz.com"
},

// edit profile request - Form data: http://localhost:8080/user/edit/<uid>?remove_image=true/false

{
  "name": "New Name",
  "city": "New City"
},

// Buy Package : http://localhost:8080/transaction/buy-package

{
  "uid": "uid",
  "pid": "pid"
},

// Buy Bundle : http://localhost:8080/transaction/buy-bundle

{
  "uid": "uid",
  "bid": "bid"
},

// Modify Balance to Wallet : http://localhost:8080/admin/mod-balance

{
  "uid": "uid",
  "amount": 100
}


]
