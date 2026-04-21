# Support Ticket Fix Required

## Issue Identified:
The backend expects database columns `contact_name` and `contact_email` but they don't exist in the database.

## Backend Error:
```
column "contact_name" of relation "support_tickets" does not exist
```

## Frontend Changes Made:
✅ SupportTicketForm.tsx - Now sends both `name/email` and `contact_name/contact_email`
✅ SupportBookingForm.tsx - Now sends both field name variations
✅ AdminOperationsPage.tsx - Updated to display `contact_name` and `contact_email` fields

## Backend Fix Needed:
The backend controller (support.controller.js) needs to be updated to:
1. Use `name` and `email` columns instead of `contact_name` and `contact_email`, OR
2. Add the missing database columns `contact_name` and `contact_email`

## Test Once Backend is Fixed:
1. Submit a support ticket via the frontend form
2. Check admin panel at http://localhost:5173/admin/operations
3. Tickets should appear with names and emails visible

## Current Status:
- Frontend is ready ✅
- Backend needs database schema or controller fix ❌
