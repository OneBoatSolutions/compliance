# AI-Assured Compliance Dashboard API Specification

This document provides a comprehensive, production-grade API specification for the **AI-Assured Compliance Dashboard**.

---

## 1. Authentication & Security Baseline

All API requests (except public endpoints) must be authenticated via NextAuth.js session cookies.

### 1.1 Role-Based Access Control (RBAC)

API access levels are categorized into three access tiers:

- **Public**: Access allowed without authorization header/session.
- **Authenticated (User)**: Requires a valid user session. Allows read/write access to resources within the user's registered organization.
- **Admin-Only**: Requires a valid user session with `role === "ADMIN"`. Grants administrative rights to edit framework catalogs, control databases, and manage tenant users.

### 1.2 Error Payload Shape

The application returns standardized error shapes when validations fail, authorization is denied, or server exceptions occur.

#### Standard Error Response (HTTP 400, 401, 403, 404, 409, 413, 415, 429)

```json
{
  "success": false,
  "error": "Short description of the error."
}
```

#### Validation Error Response (HTTP 422)

When Zod validations fail, the API returns a structured representation of the invalid fields:

```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field_name": {
      "_errors": ["ErrorMessage text"]
    }
  }
}
```

#### Internal Server Error (HTTP 500)

Returned when an unhandled server error occurs:

```json
{
  "error": "Detailed error message or 'Internal Server Error'"
}
```

---

## 2. Global Rate Limiting

The application enforces strict rate limits backed by Upstash/Managed Redis sliding-window counters. The presets configured are:

| Preset Name         | Key Prefix               | Request Limit | Time Window | Applied to Endpoints                 |
| :------------------ | :----------------------- | :------------ | :---------- | :----------------------------------- |
| `auth`              | `rl:auth`                | 10            | 15 minutes  | Forgot password, login attempts      |
| `ai`                | `rl:ai`                  | 20            | 1 minute    | AI mapping and remediation endpoints |
| `api`               | `rl:api`                 | 100           | 1 minute    | General data query routes            |
| `upload`            | `rl:upload`              | 10            | 1 minute    | Evidence uploading                   |
| `sensitive`         | `rl:sensitive`           | 5             | 1 hour      | Password resets and DDL updates      |
| `loginIpVolumetric` | `rl:login:ip:volumetric` | 20            | 1 minute    | Volumetric IP checking on logins     |
| `registerIp`        | `rl:register:ip`         | 50            | 15 minutes  | Register IP tracking                 |
| `registerEmail`     | `rl:register:email`      | 5             | 1 hour      | Register email uniqueness protection |
| `registerAbuse`     | `rl:register:abuse`      | 10            | 15 minutes  | Malformed registration payloads      |

_Note: Rate limiting is bypassed in local development if the environment variable `DISABLE_RATE_LIMIT="true"` is set._

---

## 3. API Directory Reference

### 3.1 Authentication

#### `POST /api/auth/register`

Creates a new tenant user and automatically registers their initial organization workspace.

- **Auth Level**: Public
- **Rate Limits**: `registerIp` (50 per 15 min), `registerAbuse` (10 per 15 min), `registerEmail` (5 per hour)
- **Request JSON Schema**:
  ```json
  {
    "name": "string (2-100 characters)",
    "companyName": "string (2-100 characters)",
    "email": "string (max 254, valid email format)",
    "password": "string (8-72 characters, must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character)"
  }
  ```
- **Response JSON (Success 201)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string (cuid)",
      "name": "string",
      "email": "string",
      "role": "USER"
    }
  }
  ```
- **Error Codes**:
  - `400`: Invalid JSON payload.
  - `409`: Email address is already registered.
  - `422`: Schema validation failure.
  - `429`: Too many registration requests.

---

#### `POST /api/auth/login`

Authenticates a user session against stored credentials.

- **Auth Level**: Public
- **Rate Limits**: `loginIpVolumetric` (20 per minute), `auth` (10 per 15 minutes per email/composite IP)
- **Request JSON Schema**:
  ```json
  {
    "email": "string (max 254, valid email)",
    "password": "string (8-256 characters)"
  }
  ```
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "string (cuid)",
        "name": "string",
        "email": "string",
        "role": "USER | ADMIN"
      }
    }
  }
  ```
- **Error Codes**:
  - `401`: Invalid email or password.
  - `422`: Schema validation failure.
  - `429`: Too many failed login attempts.

---

#### `POST /api/auth/logout`

Terminates the current user session.

- **Auth Level**: Public / Authenticated
- **Rate Limits**: None
- **Request**: Empty body.
- **Response JSON (Success 200)**: Standard NextAuth.js logout behavior.

---

#### `GET /api/auth/me`

Retrieves user metadata details of the currently active session.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Request**: Empty.
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string (cuid)",
      "email": "string",
      "name": "string",
      "role": "USER | ADMIN"
    }
  }
  ```
- **Error Codes**:
  - `401`: Unauthorized session.

---

#### `POST /api/auth/forgot-password`

Sends a secure password reset link to the specified email if it exists in the system database.

- **Auth Level**: Public
- **Rate Limits**: `auth` (10 per 15 minutes)
- **Request JSON Schema**:
  ```json
  {
    "email": "string (max 254, valid email)"
  }
  ```
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "If an account with that email exists, password reset instructions have been sent."
    }
  }
  ```
- **Error Codes**:
  - `422`: Schema validation failure.
  - `429`: Too many reset requests.

---

#### `POST /api/auth/reset-password`

Validates a token and updates the user's password.

- **Auth Level**: Public
- **Rate Limits**: `sensitive` (5 per hour)
- **Request JSON Schema**:
  ```json
  {
    "token": "string (min 10, max 512 characters)",
    "password": "string (8-72 characters, standard strength criteria)"
  }
  ```
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Password has been reset successfully."
    }
  }
  ```
- **Error Codes**:
  - `400`: Invalid or expired password reset token.
  - `422`: Schema validation failure.
  - `429`: Limit exceeded.

---

### 3.2 Organizations

#### `GET /api/organizations`

Returns a list of organizations owned by the active user.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string (cuid)",
        "name": "string",
        "productName": "string | null",
        "description": "string | null",
        "services": "string | null",
        "targetCustomers": "string | null",
        "problemSolved": "string | null",
        "dataHandled": ["string"],
        "regions": ["string"],
        "createdAt": "string (ISO Date)",
        "updatedAt": "string (ISO Date)"
      }
    ]
  }
  ```

---

#### `POST /api/organizations`

Creates a new organization profile.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**:
  ```json
  {
    "name": "string (2-100 characters)",
    "productName": "string (1-100 characters, optional)",
    "description": "string (1-500 characters, optional)",
    "services": "string (1-300 characters, optional)",
    "targetCustomers": "string (1-200 characters, optional)",
    "problemSolved": "string (1-300 characters, optional)",
    "dataHandled": [
      "PII (Personally Identifiable Information) | PHI (Protected Health Information) | Financial data | Payment card data | Biometric data | Children data | Employee data | Other (min 1 items, optional)"
    ],
    "regions": [
      "United States | European Union | United Kingdom | Canada | Australia | APAC | Latin America | Other (min 1 items, optional)"
    ]
  }
  ```
- **Response JSON (Success 201)**: Same object schema as GET organizational models.
- **Error Codes**:
  - `422`: Schema validation failure.

---

#### `GET /api/organizations/[id]`

Retrieves a single organization details by ID.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**: Singular organization object.
- **Error Codes**:
  - `403`: Forbidden (User does not own this organization).
  - `404`: Organization not found.

---

#### `PATCH /api/organizations/[id]`

Updates organization details.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**: (At least one field must be provided, fields are strict and partial)
- **Response JSON (Success 200)**: Updated organization object.
- **Error Codes**:
  - `403`: Forbidden.
  - `404`: Organization not found.
  - `422`: Schema validation failure.

---

### 3.3 Frameworks & Controls

#### `GET /api/frameworks`

Lists draft and published frameworks (used in administration portal).

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Query String Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10, max: 100)
  - `search`: string (max 200 characters, optional)
  - `region`: string (optional)
  - `category`: string (optional)
  - `status`: `"DRAFT" | "PUBLISHED" | "ARCHIVED"` (optional)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "string",
          "code": "string",
          "name": "string",
          "description": "string",
          "region": "string",
          "category": "string",
          "version": "string",
          "status": "DRAFT | PUBLISHED | ARCHIVED",
          "createdAt": "string",
          "updatedAt": "string",
          "_count": { "controls": "number" }
        }
      ],
      "meta": {
        "total": "number",
        "page": "number",
        "limit": "number",
        "totalPages": "number"
      }
    }
  }
  ```

---

#### `POST /api/frameworks`

Creates a draft framework.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**:
  ```json
  {
    "code": "string (uppercase, alphanumeric/hyphens/underscores only, 1-20 characters)",
    "name": "string (1-200 characters)",
    "description": "string (max 1000 characters, optional)",
    "region": "string (max 100 characters, optional)",
    "category": "string (max 100 characters, optional)",
    "version": "string (semver format e.g. '1.0.0', optional)",
    "effectiveDate": "string (ISO Date, optional)",
    "sourceLink": "string (valid URL up to 2048 characters, optional)"
  }
  ```
- **Response JSON (Success 201)**: Returns the newly created framework object (with status set to `"DRAFT"`).
- **Error Codes**:
  - `409`: A framework with this code already exists.
  - `422`: Schema validation failure.

---

#### `GET /api/frameworks/published`

Retrieves a simplified list of all published frameworks (used by users to build assessments).

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Query String Parameters**:
  - `search`: string (optional, queries name/code/description)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "code": "string",
        "name": "string",
        "description": "string",
        "region": "string",
        "category": "string",
        "version": "string",
        "_count": { "controls": "number" }
      }
    ]
  }
  ```

---

#### `GET /api/frameworks/[id]`

Retrieves full details of a framework, including all its controls.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "code": "string",
      "name": "string",
      "description": "string",
      "region": "string",
      "category": "string",
      "version": "string",
      "status": "DRAFT | PUBLISHED | ARCHIVED",
      "controls": [
        {
          "id": "string",
          "frameworkId": "string",
          "code": "string",
          "title": "string",
          "description": "string",
          "category": "string | null",
          "severity": "LOW | MEDIUM | HIGH | CRITICAL",
          "weight": "number"
        }
      ]
    }
  }
  ```
- **Error Codes**:
  - `404`: Framework not found.

---

#### `PATCH /api/frameworks/[id]`

Updates a framework's metadata fields.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**: Partial framework fields. _Note: For frameworks already in `"PUBLISHED"` state, only transition to `"ARCHIVED"` status is permitted. Other fields are immutable._
- **Response JSON (Success 200)**: Updated framework object.
- **Error Codes**:
  - `403`: Forbidden (cannot edit published framework metadata).
  - `404`: Framework not found.
  - `409`: Code duplication conflict.
  - `422`: Schema validation failure.

---

#### `DELETE /api/frameworks/[id]`

Deletes a framework from the library.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": { "deleted": true }
  }
  ```
- **Error Codes**:
  - `404`: Framework not found.
  - `409`: Conflict (framework is referenced by active assessments and cannot be deleted).

---

#### `POST /api/frameworks/[id]/publish`

Transition a draft framework status to `"PUBLISHED"`.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Request**: Empty body.
- **Response JSON (Success 200)**: Framework object showing status: `"PUBLISHED"`.
- **Error Codes**:
  - `404`: Framework not found.
  - `422`: Validation failed (framework must contain a valid name, code, description, and at least one control).

---

#### `POST /api/frameworks/[id]/controls`

Creates a control inside a draft framework.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**:
  ```json
  {
    "code": "string (1-100 characters)",
    "title": "string (1-500 characters)",
    "description": "string (1-5000 characters)",
    "category": "string (max 100 characters, optional)",
    "severity": "LOW | MEDIUM | HIGH | CRITICAL (default: MEDIUM, optional)",
    "weight": "number (0.1 to 10.0, default: 1.0, optional)"
  }
  ```
- **Response JSON (Success 201)**: Returns the created control database record.
- **Error Codes**:
  - `404`: Framework not found.
  - `409`: A control with this code already exists for this framework.
  - `422`: Schema validation failure.

---

#### `POST /api/frameworks/[id]/controls/import`

Bulk imports controls from raw CSV file contents.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Headers Required**: `Content-Type: text/csv` or `Content-Type: text/plain`
- **Request Body**: Raw CSV string (Max 5MB).
  - _CSV Header Columns Required_: `code`, `title`, `description`, `category`, `severity`, `weight`
- **Response JSON (Success 201)**:
  ```json
  {
    "success": true,
    "data": {
      "imported": "number (count of rows created)"
    }
  }
  ```
- **Error Codes**:
  - `400`: Empty payload or parsing error.
  - `404`: Framework not found.
  - `413`: Payload too large (exceeds 5MB).
  - `415`: Unsupported Media Type (invalid Content-Type).
  - `409`: Conflict (duplicate code found within CSV or database).
  - `422`: Validation failed for specific rows:
    ```json
    {
      "success": false,
      "error": "Validation failed",
      "details": {
        "rows": [{ "row": 3, "message": "Severity must be LOW, MEDIUM, HIGH, or CRITICAL" }]
      }
    }
    ```

---

#### `PATCH /api/frameworks/[id]/controls/[controlId]`

Updates control details.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**: Partial control fields.
- **Response JSON (Success 200)**: Updated control object.
- **Error Codes**:
  - `404`: Control not found under this framework.
  - `409`: Code duplication conflict.
  - `422`: Schema validation failure.

---

#### `DELETE /api/frameworks/[id]/controls/[controlId]`

Deletes a control.

- **Auth Level**: Admin-Only
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**: `{ "success": true, "data": { "deleted": true } }`
- **Error Codes**:
  - `404`: Control not found.

---

### 3.4 Controls

#### `GET /api/controls/[id]/details`

Retrieves relationships, description, and metadata of a control.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "description": "string",
      "metadata": "object | null",
      "relatedControls": [
        {
          "id": "string",
          "code": "string",
          "title": "string",
          "type": "dependency | parent | related"
        }
      ]
    }
  }
  ```
- **Error Codes**:
  - `404`: Control not found.

---

### 3.5 Assessments

#### `GET /api/assessments`

Retrieves all assessments created by the active user.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string (cuid)",
        "status": "DRAFT | IN_PROGRESS | COMPLETED",
        "score": "number | null",
        "createdAt": "string (ISO Date)",
        "organizationId": "string"
      }
    ]
  }
  ```

---

#### `POST /api/assessments`

Creates a new assessment checklist mapping selected framework controls.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**:
  ```json
  {
    "organizationId": "string (cuid)",
    "frameworkIds": ["string (cuid) (min 1 items)"]
  }
  ```
- **Response JSON (Success 201)**:
  ```json
  {
    "success": true,
    "data": {
      "assessmentId": "string (cuid)",
      "totalItems": "number"
    }
  }
  ```
- **Error Codes**:
  - `400`: Frameworks not found or are not in published state, or no controls exist.
  - `403`: Forbidden (user does not own the organization).
  - `404`: Organization not found.
  - `422`: Schema validation failure.

---

#### `GET /api/assessments/[id]`

Retrieves assessment master details along with raw items lists.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**: Complete assessment tree with controls and evidence counts.
- **Error Codes**:
  - `404`: Assessment not found.

---

#### `DELETE /api/assessments/[id]`

Deletes an assessment checklist.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**: `{ "success": true, "data": { "id": "string" } }`
- **Error Codes**:
  - `404`: Assessment not found.

---

#### `POST /api/assessments/[id]/duplicate`

Duplicates the control list of an existing assessment into a new assessment.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Request**: Empty body.
- **Response JSON (Success 201)**: Same object schema as POST `/api/assessments`.
- **Error Codes**:
  - `400`: Source assessment contains no controls.
  - `404`: Source assessment not found.

---

#### `GET /api/assessments/[id]/items`

Lists paginated, filtered assessment control items.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Query String Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 50, max: 100)
  - `status`: comma-separated strings of `NOT_STARTED | COMPLIANT | PARTIALLY_COMPLIANT | NOT_COMPLIANT | NOT_APPLICABLE` (optional)
  - `framework`: comma-separated strings of framework IDs (optional)
  - `severity`: comma-separated strings of `LOW | MEDIUM | HIGH | CRITICAL` (optional)
  - `category`: comma-separated strings of categories (optional)
  - `search`: string (max 200, searches comments/control code/control title, optional)
  - `sortBy`: `"severity" | "updatedAt" | "createdAt" | "status" | "code"` (default: `"severity"`)
  - `sortOrder`: `"asc" | "desc"` (default: `"desc"`)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "string",
          "status": "NOT_STARTED | COMPLIANT | PARTIALLY_COMPLIANT | NOT_COMPLIANT | NOT_APPLICABLE",
          "comments": "string | null",
          "createdAt": "string",
          "updatedAt": "string",
          "_count": { "evidence": "number" },
          "control": {
            "id": "string",
            "code": "string",
            "title": "string",
            "description": "string",
            "category": "string | null",
            "severity": "LOW | MEDIUM | HIGH | CRITICAL",
            "weight": "number",
            "framework": { "id": "string", "code": "string", "name": "string" }
          }
        }
      ],
      "meta": {
        "total": "number",
        "page": "number",
        "limit": "number",
        "totalPages": "number",
        "hasNextPage": "boolean",
        "hasPrevPage": "boolean"
      }
    }
  }
  ```
- **Error Codes**:
  - `404`: Assessment not found.
  - `422`: Schema validation failure.

---

#### `GET /api/assessments/[id]/items/[itemId]`

Retrieves a single assessment item details with full uploaded evidence profiles.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "NOT_STARTED | COMPLIANT | PARTIALLY_COMPLIANT | NOT_COMPLIANT | NOT_APPLICABLE",
      "comments": "string | null",
      "owner": "string | null",
      "targetDate": "string (ISO Date) | null",
      "evidence": [
        {
          "id": "string",
          "originalName": "string",
          "fileSize": "number (bytes)",
          "mimeType": "string",
          "description": "string | null",
          "uploadedAt": "string (ISO Date)"
        }
      ]
    }
  }
  ```
- **Error Codes**:
  - `404`: Assessment item not found under this assessment.

---

#### `PATCH /api/assessments/[id]/items/[itemId]`

Updates assessment item state (status, notes, owner, target dates). Triggers an atomic, server-side compliance score recalculation transaction.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**: (At least one field must be provided)
  ```json
  {
    "status": "NOT_STARTED | COMPLIANT | PARTIALLY_COMPLIANT | NOT_COMPLIANT | NOT_APPLICABLE (optional)",
    "comments": "string (max 2000, optional, nullable)",
    "owner": "string (max 200, optional, nullable)",
    "targetDate": "string (ISO Date format, optional, nullable)",
    "remarks": "string (max 2000, optional, nullable)",
    "evidenceNotes": "string (max 2000, optional, nullable)"
  }
  ```
- **Response JSON (Success 200)**: Returns the newly recalculated overall assessment score.
  ```json
  {
    "success": true,
    "data": {
      "score": "number"
    }
  }
  ```
- **Error Codes**:
  - `404`: Assessment item not found.
  - `422`: Validation error.

---

#### `GET /api/assessments/[id]/items/[itemId]/comments`

Retrieves user discussion comments for an assessment item.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "userName": "string",
        "content": "string",
        "createdAt": "string (ISO Date)"
      }
    ]
  }
  ```

---

#### `POST /api/assessments/[id]/items/[itemId]/comments`

Creates a comment on the assessment item.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Request JSON Schema**:
  ```json
  {
    "content": "string (1-1000 characters)"
  }
  ```
- **Response JSON (Success 201)**: Returns the created comment object.
- **Error Codes**:
  - `400`: Comment is empty or exceeds character limits.
  - `404`: Assessment item not found.

---

#### `GET /api/assessments/[id]/items/[itemId]/timeline`

Retrieves chronological change logs (creation, uploads, comments) for an item.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "type": "CREATED | EVIDENCE | COMMENT",
        "date": "string (ISO Date)",
        "user": "string",
        "details": "string"
      }
    ]
  }
  ```
- **Error Codes**:
  - `500`: Assessment item not found.

---

#### `GET /api/assessments/[id]/score`

Retrieves the overall score and detailed breakdown of each framework included in the assessment.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "assessmentId": "string",
      "score": "number (rounded to 1 decimal place)",
      "frameworkScores": [
        {
          "frameworkId": "string",
          "frameworkCode": "string",
          "frameworkName": "string",
          "score": "number"
        }
      ]
    }
  }
  ```
- **Error Codes**:
  - `404`: Assessment not found.

---

#### `GET /api/assessments/[id]/section-progress`

Queries control status metrics filtered by framework and category.

- **Auth Level**: Authenticated
- **Rate Limits**: `api` (100 per minute)
- **Query String Parameters**:
  - `controlId`: string (required)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "total": "number",
      "compliant": "number",
      "partiallyCompliant": "number",
      "nonCompliant": "number",
      "notStarted": "number"
    }
  }
  ```
- **Error Codes**:
  - `500`: Control not found or controlId parameter is missing.

---

### 3.6 AI Integration

#### `POST /api/ai/map-compliance`

Maps onboarding profile metrics to suggestions for regulatory frameworks.

- **Auth Level**: Authenticated
- **Rate Limits**: `aiRateLimit` (10 per hour per user)
- **Request JSON Schema**:
  ```json
  {
    "name": "string",
    "description": "string",
    "services": "string",
    "customers": "string",
    "problem": "string",
    "dataHandled": ["string"],
    "regions": ["string"]
  }
  ```
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "suggestedFrameworkCodes": ["string"],
      "justification": "string"
    }
  }
  ```
- _Timeout Behavior_: The endpoint will timeout and fallback to returns a mock mapping payload structure if the LLM API does not respond within 10 seconds.
- **Error Codes**:
  - `400`: Invalid profile structure.
  - `401`: Session unauthorized.
  - `429`: Custom AI hourly rate limit exceeded.

---

#### `POST /api/ai/remediation`

Generates step-by-step remediation plan suggestions for a failing control.

- **Auth Level**: Authenticated
- **Rate Limits**: `aiRateLimit` (10 per hour per user)
- **Request JSON Schema**:
  ```json
  {
    "frameworkName": "string",
    "controlId": "string",
    "controlTitle": "string",
    "controlDescription": "string",
    "currentStatus": "string",
    "severity": "string",
    "regenerate": "boolean (optional)",
    "assessmentId": "string (optional)",
    "userNotes": "string (optional)",
    "uploadedEvidenceFiles": ["string (optional)"],
    "productDescription": "string (optional)",
    "targetAudience": "string (optional)"
  }
  ```
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "title": "string",
      "summary": "string",
      "steps": [
        {
          "title": "string",
          "description": "string",
          "priority": "HIGH | MEDIUM | LOW",
          "owner": "string",
          "estimatedHours": "number"
        }
      ],
      "policies": ["string"],
      "technicalControls": ["string"]
    }
  }
  ```
- **Error Codes**:
  - `400`: Invalid parameters.
  - `401`: Session unauthorized.
  - `429`: Rate limit exceeded.
  - `504`: Gateway timeout (AI service timed out).

---

### 3.7 Reports

#### `GET /api/reports/[assessmentId]/view`

Builds a unified compliance report dataset used to visualize scores, heatmaps, and summaries.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "reportTitle": "string",
    "generatedAt": "string (ISO Date)",
    "overallScore": "number",
    "completionPercent": "number",
    "readinessBand": "string (e.g. 'OPTIMIZED' | 'MANAGED')",
    "executiveSummary": "string",
    "findings": [{ "type": "success | warning | info | insight", "text": "string" }],
    "alerts": [{ "title": "string", "description": "string" }],
    "criticalRisksCount": "number",
    "criticalRisks": [
      {
        "code": "string",
        "severity": "string",
        "status": "string",
        "riskScore": "number",
        "title": "string"
      }
    ],
    "topRecommendations": [{ "title": "string" }],
    "frameworkScores": [
      { "frameworkCode": "string", "frameworkName": "string", "score": "number" }
    ],
    "riskSummary": {
      "totalRiskScore": "number",
      "openHighRisks": "number",
      "openMediumRisks": "number",
      "openLowRisks": "number"
    },
    "distribution": {
      "compliant": "number",
      "nonCompliant": "number",
      "partial": "number",
      "notApplicable": "number"
    },
    "heatmap": "object (matrix data)",
    "remediation": [
      { "title": "string", "summary": "string | null", "status": "string", "stepsCount": "number" }
    ],
    "controlRows": [
      {
        "code": "string",
        "title": "string",
        "severity": "string",
        "status": "string",
        "weight": "number"
      }
    ],
    "evidenceRows": [
      {
        "id": "string",
        "originalName": "string",
        "fileSize": "number",
        "mimeType": "string",
        "uploadedAt": "string"
      }
    ],
    "organization": {
      "id": "string",
      "name": "string",
      "productName": "string | null",
      "description": "string | null",
      "services": "string | null",
      "targetCustomers": "string | null",
      "problemSolved": "string | null",
      "dataHandled": ["string"],
      "regions": ["string"]
    },
    "assessment": {
      "id": "string",
      "status": "string",
      "score": "number | null",
      "createdAt": "string",
      "completedAt": "string | null"
    }
  }
  ```
- _Note: In Sprint 6, the legacy generating/downloading file links endpoints (Task 6.1) were deprecated to rely strictly on browser native PDF print styles._
- **Error Codes**:
  - `404`: Assessment not found or access denied.

---

### 3.8 Evidence Vault

#### `POST /api/evidence/upload`

Uploads evidence documents to backing object storage (S3/MinIO) and tracks metadata.

- **Auth Level**: Authenticated (Ownership check on assessment item)
- **Rate Limits**: `upload` (10 requests per minute)
- **Headers Required**: `Content-Type: multipart/form-data`
- **Request Form Fields**:
  - `assessmentItemId`: string (cuid, required)
  - `description`: string (max 500 characters, optional)
  - `file`: Binary file stream (Max 10MB)
- **Security Controls Applied**:
  1.  _MIME validation_: Allowed list includes: `application/pdf`, `.docx`, `.xlsx`, `text/plain`, `image/png`, `image/jpeg`, `text/csv`, `application/zip`.
  2.  _Extension verification_: Must map correctly to MIME.
  3.  _Magic byte signatures check_: Verifies true binary contents in buffer.
  4.  _Text/CSV Sanitisation_: Formula-injection scripts are neutralised before storage.
  5.  _Virus Scan_: Integrated ClamAV stream scanner (fails open in development unless configured).
  6.  _Capacity limits_: Max 20 files allowed per assessment item.
- **Response JSON (Success 201)**:
  ```json
  {
    "success": true,
    "evidence": [
      {
        "id": "string (cuid)",
        "assessmentItemId": "string",
        "filename": "string (storage UUID)",
        "originalName": "string (sanitised)",
        "fileUrl": "string (signed URL)",
        "fileSize": "number",
        "mimeType": "string",
        "description": "string | null",
        "uploadedAt": "string"
      }
    ]
  }
  ```
- **Error Codes**:
  - `400`: File count cap exceeded or file is missing.
  - `404`: Assessment item not found.
  - `413`: Payload too large (exceeds 10MB).
  - `415`: File extension, MIME, or magic byte mismatch.
  - `422`: Schema validation error or virus signature detected.

---

#### `GET /api/evidence/[id]`

Generates a secure, temporary pre-signed download URL for a file.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "filename": "string",
      "originalName": "string",
      "fileSize": "number",
      "mimeType": "string",
      "description": "string | null",
      "uploadedAt": "string",
      "downloadUrl": "string (S3 signed url, active for 7 days)"
    }
  }
  ```
- **Error Codes**:
  - `404`: Evidence not found.

---

#### `DELETE /api/evidence/[id]`

Removes evidence records from database and deletes binary object from AWS S3/MinIO.

- **Auth Level**: Authenticated (Owner Check Enforced)
- **Rate Limits**: `api` (100 per minute)
- **Response JSON (Success 200)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "deleted": true
    }
  }
  ```
- **Error Codes**:
  - `404`: Evidence not found.

---

### 3.9 System Infrastructure Checks

#### `GET /api/health`

Lightweight process checking endpoint.

- **Auth Level**: Public
- **Rate Limits**: None (Bypassed to prevent monitor lockouts)
- **Query String Parameters**:
  - `db_metrics`: `"true" | "false"` (optional, prints active connections)
- **Response JSON (Success 200)**:
  ```json
  {
    "status": "ok",
    "timestamp": "string (ISO Date)",
    "version": "string"
  }
  ```

---

#### `GET /api/ready`

Deep integration health check (verifies active Postgres and Redis connections).

- **Auth Level**: Public
- **Rate Limits**: Custom local in-process limiter (60 requests per minute per IP, zero Redis dependencies to prevent circular failures).
- **Response JSON (Success 200)**:
  ```json
  {
    "status": "healthy",
    "services": {
      "database": "healthy",
      "redis": "healthy"
    }
  }
  ```
- **Response JSON (Degraded 503)**:
  ```json
  {
    "status": "degraded",
    "services": {
      "database": "unreachable",
      "redis": "healthy"
    }
  }
  ```

---

### 3.10 Storage Integration

#### `GET /api/storage/[...path]`

Local disk-backed storage file routing (fallback alternative to S3 bucket in local development environments). Resolves files saved inside the `.local-storage` directory.

- **Auth Level**: Public (Secure directory traversal validation applied)
- **Response**: Binary file stream download.
- **Error Codes**:
  - `403`: Directory traversal traversal traversal check fail.
  - `404`: Target path does not exist.
