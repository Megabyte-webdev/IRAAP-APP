# IRAAP application fixes

This source package contains the requested signup, archive/document, search, loading/error, and metadata fixes.

## Implemented

- Student self-registration through `POST /auth/register`.
- Duplicate-email and password validation with clear API errors.
- Consistent access-token storage/use through `iraapUser.token`.
- Refresh interceptor no longer recursively refreshes `/auth/refresh-token`.
- PDF-only uploads with a 20 MB limit and friendly upload errors.
- Cloudinary cleanup uses the correct `raw` resource type.
- Archive/document pages no longer append `.pdf` to already-canonical Cloudinary URLs.
- Student and supervisor archive routes now use the same paginated archive experience.
- Archive search is debounced and searches title, abstract, research area, methodology, and keywords.
- Year, keyword, and supervisor filters support arrays correctly.
- Supervisor filtering targets the supervisor relation instead of the student/author relation.
- Consistent pagination metadata is returned by `/projects`.
- Dashboard, archive, filter, and global error/loading states were improved.
- Project-detail access allows approved public projects plus authenticated owners/supervisors/admins.
- Signup/login and project pages receive useful metadata/canonical paths.

## Environment

`COOKIE_DOMAIN` is optional. In production it can be set to `.iraap.com.ng` when the API and frontend share that parent domain. In local development the cookie uses the API host without a cross-site domain.

No database migration is required for these changes; the existing `users`, `projects`, `project_versions`, and `metadata` tables are used.
