# Job Portal Backend MVP - Laravel API Blueprint

This document maps the current frontend dummy flow to a real Laravel backend API.

## Roles

- `candidate`: can browse published jobs, save jobs, apply for jobs, see own applications, and receive notifications.
- `recruiter`: can create exactly one company, add jobs for that company, publish/unpublish jobs, and review applications for their company jobs.

## Recommended Laravel Stack

- Laravel Sanctum for API authentication.
- MySQL or PostgreSQL.
- Form Requests for validation.
- Policies for role/resource permissions.
- API Resources for consistent JSON responses.

## Database Tables

### users

Use Laravel default users table plus:

```php
$table->enum('role', ['candidate', 'recruiter'])->default('candidate');
```

Fields:

- `id`
- `name`
- `email`
- `password`
- `role`
- `created_at`
- `updated_at`

### companies

One recruiter can own one company.

Fields:

- `id`
- `user_id` foreign key to users
- `name`
- `industry`
- `location`
- `website` nullable
- `description` nullable
- `created_at`
- `updated_at`

Constraints:

- unique `user_id`

Relationship:

- `Company belongsTo User`
- `Company hasMany Job`

### jobs

Fields:

- `id`
- `company_id` foreign key to companies
- `title`
- `location`
- `type` enum/string: `Full Time`, `Part Time`, `Contract`, `Internship`
- `salary`
- `experience`
- `status` enum: `draft`, `published`
- `created_at`
- `updated_at`

Relationship:

- `Job belongsTo Company`
- `Job hasMany Application`
- `Job belongsToMany User` through saved jobs

### applications

Fields:

- `id`
- `job_id` foreign key to jobs
- `user_id` foreign key to users
- `full_name`
- `email`
- `cover_letter`
- `status` enum: `Pending`, `Interview Scheduled`, `Accepted`, `Rejected`
- `created_at`
- `updated_at`

Constraints:

- unique pair: `job_id`, `user_id`

Relationship:

- `Application belongsTo Job`
- `Application belongsTo User`

### saved_jobs

Fields:

- `id`
- `user_id` foreign key to users
- `job_id` foreign key to jobs
- `created_at`
- `updated_at`

Constraints:

- unique pair: `user_id`, `job_id`

### notifications

Use Laravel database notifications or a simple custom table.

Custom table fields:

- `id`
- `user_id`
- `title`
- `message`
- `read_at` nullable
- `created_at`
- `updated_at`

## Models

### User

Relationships:

```php
public function company()
{
    return $this->hasOne(Company::class);
}

public function applications()
{
    return $this->hasMany(Application::class);
}

public function savedJobs()
{
    return $this->belongsToMany(Job::class, 'saved_jobs')->withTimestamps();
}
```

Helpers:

```php
public function isCandidate(): bool
{
    return $this->role === 'candidate';
}

public function isRecruiter(): bool
{
    return $this->role === 'recruiter';
}
```

### Company

```php
public function user()
{
    return $this->belongsTo(User::class);
}

public function jobs()
{
    return $this->hasMany(Job::class);
}
```

### Job

```php
public function company()
{
    return $this->belongsTo(Company::class);
}

public function applications()
{
    return $this->hasMany(Application::class);
}
```

### Application

```php
public function user()
{
    return $this->belongsTo(User::class);
}

public function job()
{
    return $this->belongsTo(Job::class);
}
```

## API Routes

Prefix all routes with `/api`.

### Auth

```php
POST /register
POST /login
POST /logout
GET  /me
```

### Candidate Routes

Protected by `auth:sanctum` and candidate middleware/policy.

```php
GET    /candidate/dashboard
GET    /jobs
GET    /companies
GET    /applications
POST   /jobs/{job}/apply
POST   /jobs/{job}/save
DELETE /jobs/{job}/save
GET    /notifications
PATCH  /notifications/read
```

Important:

- `GET /jobs` returns only published jobs.
- `GET /companies` returns only companies with published jobs.
- `POST /jobs/{job}/apply` should reject draft jobs.
- Candidate cannot apply twice to the same job.

### Recruiter Routes

Protected by `auth:sanctum` and recruiter middleware/policy.

```php
GET   /recruiter/dashboard
GET   /recruiter/company
POST  /recruiter/company
GET   /recruiter/jobs
POST  /recruiter/jobs
PATCH /recruiter/jobs/{job}
PATCH /recruiter/jobs/{job}/status
GET   /recruiter/applications
PATCH /recruiter/applications/{application}/status
```

Important:

- Recruiter can create only one company.
- Recruiter can only manage jobs belonging to their own company.
- Recruiter can only review applications for their own company jobs.

## Request Payloads

### POST /register

```json
{
  "name": "Demo Candidate",
  "email": "candidate@example.com",
  "password": "password",
  "password_confirmation": "password",
  "role": "candidate"
}
```

### POST /login

```json
{
  "email": "candidate@example.com",
  "password": "password"
}
```

### POST /recruiter/company

```json
{
  "name": "Pixel Labs",
  "industry": "Software",
  "location": "Ahmedabad",
  "website": "https://pixellabs.test",
  "description": "A product engineering company."
}
```

Validation:

- `name`: required string max 255
- `industry`: required string max 255
- `location`: required string max 255
- `website`: nullable url
- `description`: nullable string

### POST /recruiter/jobs

```json
{
  "title": "Frontend Developer",
  "location": "Remote",
  "type": "Full Time",
  "salary": "$4k - $7k",
  "experience": "2+ years",
  "status": "draft"
}
```

Validation:

- `title`: required string max 255
- `location`: required string max 255
- `type`: required string
- `salary`: required string max 255
- `experience`: required string max 255
- `status`: required in `draft,published`

### PATCH /recruiter/jobs/{job}/status

```json
{
  "status": "published"
}
```

### POST /jobs/{job}/apply

```json
{
  "full_name": "Demo Candidate",
  "email": "candidate@example.com",
  "cover_letter": "I am interested in this role."
}
```

Validation:

- `full_name`: required string max 255
- `email`: required email
- `cover_letter`: required string

### PATCH /recruiter/applications/{application}/status

```json
{
  "status": "Accepted"
}
```

Allowed statuses:

- `Pending`
- `Interview Scheduled`
- `Accepted`
- `Rejected`

When status changes to `Accepted`, `Rejected`, or `Interview Scheduled`, create a notification for the candidate.

## Response Shapes

Use one consistent envelope for all JSON responses. The frontend currently accepts `data`, a named key like `jobs`, or a raw object, but the recommended backend shape is:

### Success Envelope

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

For lists:

```json
{
  "success": true,
  "message": "Jobs fetched successfully.",
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### Error Envelope

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

Recommended status codes:

- `200`: fetched or updated successfully.
- `201`: created successfully.
- `204`: deleted successfully, no response body.
- `401`: unauthenticated.
- `403`: authenticated but not allowed by role/policy.
- `404`: resource not found.
- `422`: validation error.
- `500`: unexpected server error.

### Laravel Response Helper

Create `app/Support/ApiResponse.php`:

```php
namespace App\Support;

class ApiResponse
{
    public static function success($data = null, string $message = 'Success.', int $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    public static function error(string $message = 'Something went wrong.', array $errors = [], int $status = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }
}
```

Example controller usage:

```php
return ApiResponse::success(new JobResource($job), 'Job created successfully.', 201);
return ApiResponse::error('You can create only one company.', [], 422);
```

### Auth Response

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "plain-text-token",
    "user": {
      "id": 1,
      "name": "Demo Candidate",
      "email": "candidate@example.com",
      "role": "candidate"
    }
  }
}
```

### Job Resource

```json
{
  "id": 1,
  "title": "Frontend Developer",
  "company": {
    "id": 1,
    "name": "Pixel Labs"
  },
  "location": "Remote",
  "type": "Full Time",
  "salary": "$4k - $7k",
  "experience": "2+ years",
  "status": "published",
  "has_applied": false,
  "is_saved": false,
  "created_at": "2026-05-06T10:00:00.000000Z"
}
```

### Application Resource

```json
{
  "id": 1,
  "job": {
    "id": 10,
    "title": "Frontend Developer"
  },
  "company": {
    "id": 3,
    "name": "Pixel Labs"
  },
  "candidate": {
    "id": 4,
    "name": "Demo Candidate",
    "email": "candidate@example.com"
  },
  "cover_letter": "I am interested in this role.",
  "status": "Pending",
  "applied_at": "2026-05-06T10:00:00.000000Z"
}
```

### Notification Resource

```json
{
  "id": 1,
  "title": "Application accepted",
  "message": "Your application for Frontend Developer at Pixel Labs was accepted.",
  "read": false,
  "created_at": "2026-05-06T10:00:00.000000Z"
}
```

## Middleware

Create role middleware:

```php
Route::middleware(['auth:sanctum', 'role:candidate'])->group(function () {
    // candidate routes
});

Route::middleware(['auth:sanctum', 'role:recruiter'])->group(function () {
    // recruiter routes
});
```

Middleware behavior:

- If user role does not match, return `403`.

## Policies

### JobPolicy

- `update`: user is recruiter and owns job company.
- `publish`: user is recruiter and owns job company.
- `apply`: user is candidate and job status is published.

### ApplicationPolicy

- `viewCandidate`: user owns the application.
- `review`: recruiter owns the application job company.

## Controller MVP List

```text
AuthController
CandidateDashboardController
JobController
CompanyController
ApplicationController
SavedJobController
NotificationController
RecruiterDashboardController
RecruiterCompanyController
RecruiterJobController
RecruiterApplicationController
```

## Suggested Build Order

1. Auth with role support.
2. Role middleware.
3. Company migration/model/controller.
4. Job migration/model/controller.
5. Public published jobs endpoint.
6. Candidate apply/save endpoints.
7. Recruiter application review endpoint.
8. Candidate notification endpoint.
9. Dashboard summary endpoints.
10. Connect frontend axios calls.

## Frontend Endpoint Mapping

Replace dummy composable actions with these endpoints:

- Candidate jobs page: `GET /api/jobs`
- Apply modal submit: `POST /api/jobs/{id}/apply`
- Save job: `POST /api/jobs/{id}/save`
- Unsave job: `DELETE /api/jobs/{id}/save`
- Candidate applications page: `GET /api/applications`
- Candidate notifications: `GET /api/notifications`
- Recruiter company page: `GET /api/recruiter/company`, `POST /api/recruiter/company`
- Recruiter jobs page: `GET /api/recruiter/jobs`, `POST /api/recruiter/jobs`
- Publish/unpublish: `PATCH /api/recruiter/jobs/{id}/status`
- Recruiter reviews: `GET /api/recruiter/applications`
- Accept/reject/interview: `PATCH /api/recruiter/applications/{id}/status`

## MVP Rules Checklist

- Candidate cannot access recruiter APIs.
- Recruiter cannot access candidate APIs.
- Recruiter can create only one company.
- Recruiter can create jobs only after company exists.
- User job list shows only published jobs.
- Companies list shows only companies with published jobs.
- Candidate cannot apply twice for same job.
- Recruiter can review only applications for own company jobs.
- Candidate receives notification when application is accepted, rejected, or interview is scheduled.
