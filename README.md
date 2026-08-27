# Configurable Notification System

A full-stack notification management system that allows users to define configurable notification rules, trigger events, evaluate those events against active rules, and deliver notifications through multiple channels.

The system provides a dashboard for monitoring notification activity, rule status, delivery results, and recent notifications.

## Live Demo

* **Frontend:** https://configurable-notification-system.vercel.app/dashboard
* **Backend API:** https://configurable-notification-system.onrender.com/api

---

## Overview

The Configurable Notification System is designed around an event-driven notification workflow.

A user can:

* Create notification rules
* Define conditions for when a rule should trigger
* Configure notification recipients
* Select one or more notification channels
* Enable or disable rules
* Trigger events for testing
* Automatically generate notifications when rules match
* Deliver notifications through email and in-app channels
* View notification history
* Monitor notification metrics from the dashboard

The system separates **event processing**, **rule evaluation**, **notification creation**, and **channel delivery** into dedicated services.

---

## Key Features

### Notification Rules

Users can create configurable rules containing:

* Rule name
* Event type
* Conditions
* Recipients
* Notification channels
* Notification template
* Enabled/disabled state

Example:

```text
Rule: High Value Orders

Event:
ORDER_CREATED

Condition:
orderValue > 10000

Recipient:
Sales Manager

Channels:
EMAIL
IN_APP
```

---

### Rule Engine

When an event is triggered, the backend evaluates all enabled rules against the event data.

Only rules whose conditions match the incoming event generate notifications.

This allows the notification logic to remain configurable instead of hard-coded for individual event types.

---

### Multi-Channel Notifications

The system currently supports:

* **EMAIL**
* **IN_APP**

The channel architecture is designed so additional notification channels can be added without modifying the core event-processing logic.

---

### Email Notifications

Email delivery is implemented using **EmailJS**.

The backend communicates with the EmailJS API using the configured service, template, and private API credentials.

This approach was selected instead of SMTP because the application is deployed in a serverless/cloud environment where traditional SMTP configuration can introduce deployment and authentication issues.

Email templates support dynamic values such as:

* Recipient name
* Notification message
* Event ID
* Subject

---

### In-App Notifications

In-app notifications are currently represented through the application notification system and persisted in MongoDB.

Each generated notification stores information such as:

* Rule
* Event ID
* Recipient
* Channel
* Message
* Delivery status
* Creation timestamp

---

### Dashboard

The dashboard provides an overview of the current notification system.

The KPIs are calculated from the actual backend data rather than hard-coded values.

Current metrics include:

| KPI           | Description                                    |
| ------------- | ---------------------------------------------- |
| Active Rules  | Number of currently enabled notification rules |
| Notifications | Total notifications stored in the database     |
| Sent          | Notifications with successful delivery status  |
| Failed        | Notifications with failed delivery status      |

The dashboard also displays the most recent notification activity.

When there is no data in MongoDB, the dashboard correctly displays zero values and an empty notification state.

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │      Angular UI     │
                    │                     │
                    │ Dashboard           │
                    │ Rules               │
                    │ Events              │
                    │ Notification History│
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Controllers         │
                    │ Routes              │
                    │ Services            │
                    └──────────┬──────────┘
                               │
                     Trigger Event
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Event Processing    │
                    │ Service             │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Rule Engine     │
                    │                     │
                    │ Evaluate conditions │
                    │ against event data  │
                    └──────────┬──────────┘
                               │
                         Matching Rules
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Notification        │
                    │ Creation            │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Channel Dispatcher  │
                    └───────┬─────┬───────┘
                            │     │
                       EMAIL     IN_APP
                            │     │
                            ▼     ▼
                       EmailJS  Application
                            │     │
                            └──┬──┘
                               │
                               ▼
                         MongoDB
```

---

## Event Processing Flow

The complete notification flow is:

```text
1. Client triggers an event
          ↓
2. Backend receives the event
          ↓
3. Enabled notification rules are retrieved
          ↓
4. Rule Engine evaluates each rule
          ↓
5. Matching rules are identified
          ↓
6. Notifications are created for each recipient/channel
          ↓
7. Channel Dispatcher selects the appropriate channel
          ↓
8. EmailJS sends email notifications
   or
   In-app notification is processed
          ↓
9. Notification status is updated
          ↓
10. Dashboard and notification history reflect persisted data
```

For example, if one rule has two channels:

```text
One Event
   ↓
One Matching Rule
   ↓
┌───────────────┬───────────────┐
│               │
EMAIL         IN_APP
│               │
▼               ▼
Notification   Notification
```

Therefore, one matching event can generate two notification records when both channels are configured.

---

## Backend Structure

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── event.controller.ts
│   │   ├── notification.controller.ts
│   │   └── rule.controller.ts
│   │
│   ├── models/
│   │   ├── notification-rule.model.ts
│   │   ├── notification.model.ts
│   │   └── processed-event.model.ts
│   │
│   ├── routes/
│   │   ├── event.routes.ts
│   │   ├── notification.routes.ts
│   │   └── rule.routes.ts
│   │
│   ├── services/
│   │   ├── channels/
│   │   │   ├── channel-dispatcher.service.ts
│   │   │   ├── email.channel.ts
│   │   │   ├── in-app.channel.ts
│   │   │   └── notification-channel.ts
│   │   │
│   │   ├── notifications/
│   │   │   └── event-processing.service.ts
│   │   │
│   │   └── rules/
│   │       └── rule-engine.service.ts
│   │
│   └── types/
│       └── notification.ts
│
└── package.json
```

---

## Frontend Structure

```text
frontend/
└── src/
    └── app/
        ├── core/
        │   └── services/
        │       └── api.ts
        │
        ├── features/
        │   ├── dashboard/
        │   ├── rules/
        │   ├── events/
        │   └── notifications/
        │
        └── shared/
```

---

## Tech Stack

### Frontend

* Angular
* TypeScript
* SCSS
* Angular Router
* Angular HttpClient

### Backend

* Node.js
* Express
* TypeScript
* Mongoose
* MongoDB

### Email

* EmailJS

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database
* EmailJS — Email delivery

---

## API Endpoints

### Rules

#### Get all rules

```http
GET /api/rules
```

#### Get a rule

```http
GET /api/rules/:id
```

#### Create a rule

```http
POST /api/rules
```

#### Update a rule

```http
PUT /api/rules/:id
```

#### Toggle a rule

```http
PATCH /api/rules/:id/toggle
```

#### Delete a rule

```http
DELETE /api/rules/:id
```

---

### Events

#### Trigger an event

```http
POST /api/events
```

Example:

```json
{
  "eventId": "order-123",
  "eventType": "ORDER_CREATED",
  "data": {
    "orderValue": 14000
  }
}
```

The backend evaluates the event against enabled rules and generates notifications for matching rules.

---

### Notifications

#### Get notification history

```http
GET /api/notifications
```

---

## Environment Variables

### Backend

Create a `.env` file inside the backend directory:

```env
PORT=5005

MONGODB_URI=your_mongodb_connection_string

EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PRIVATE_KEY=your_emailjs_private_key
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```


The EmailJS private key should be treated as a secret and configured through the deployment platform's environment variable settings.

---

### Frontend

Configure the backend API URL in the Angular environment configuration.

Example:

```env
apiUrl=https://your-backend-url/api
```

For production deployment, the frontend should point to the deployed backend rather than `localhost`.

---

## Local Development

### 1. Clone the repository

```bash
git clone <repository-url>
cd configurable-notification-system
```

---

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5005
```

---

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The Angular development server will provide the local frontend URL.

---

## Testing the Notification Workflow

### Step 1 — Create a rule

Create a rule such as:

```text
Name: High Value Orders

Event Type:
ORDER_CREATED

Condition:
orderValue > 10000

Recipient:
Sales Manager

Channels:
EMAIL
IN_APP
```

### Step 2 — Trigger an event

Trigger an event with:

```json
{
  "eventId": "order-001",
  "eventType": "ORDER_CREATED",
  "data": {
    "orderValue": 14000
  }
}
```

### Step 3 — Rule evaluation

The rule engine checks:

```text
14000 > 10000
```

The condition matches.

### Step 4 — Notification generation

The system generates notifications for the configured channels.

For two channels:

```text
EMAIL
IN_APP
```

two notification records are generated.

### Step 5 — Verify

The result can be verified in:

* Dashboard KPIs
* Recent notifications
* Notification history
* Email inbox

---

## Important Design Decisions

### 1. Configurable Rules Instead of Hard-Coded Conditions

Notification logic is represented as database rules rather than being hard-coded into controllers.

This makes the system easier to extend and allows different notification workflows to be configured without changing application logic.

---

### 2. Separate Rule Engine

Rule evaluation is isolated inside the rule-engine service.

This keeps event processing independent from the details of condition evaluation.

It also makes the rule engine easier to test and extend with additional operators.

---

### 3. Channel Abstraction

Notification channels implement a common interface.

Conceptually:

```text
NotificationChannel
        │
        ├── EmailChannel
        │
        └── InAppChannel
```

The dispatcher selects the appropriate implementation based on the notification channel.

This allows additional channels such as SMS, Slack, or push notifications to be added later.

---

### 4. Persist Notification History

Notifications are stored in MongoDB rather than being represented only in the frontend.

This ensures that:

* Dashboard KPIs represent actual backend data
* Notification history survives page refreshes
* Delivery status can be tracked
* The frontend does not rely on hard-coded notification data

---

### 5. EmailJS Instead of SMTP

SMTP was initially considered for email delivery.

However, deployment environments can introduce SMTP authentication, networking, or provider-specific restrictions.

EmailJS was selected as the email delivery mechanism because it provides a simpler API-based integration suitable for the deployed application.

The backend uses the EmailJS API with the configured private key for server-side API access.

---

### 6. Dashboard Data Comes From the API

The dashboard does not maintain fixed KPI values.

On initialization it retrieves:

```text
Rules
Notifications
```

from the backend and calculates:

```text
Active Rules
Notifications
Sent
Failed
```

from the returned database records.

This ensures that deleting all rules and notifications from MongoDB immediately results in:

```text
Active Rules: 0
Notifications: 0
Sent: 0
Failed: 0
```

---

## Error Handling

The backend handles failures at the notification-channel level.

For example, if email delivery fails:

```text
Event
  ↓
Rule matches
  ↓
Notification created
  ↓
Email delivery fails
  ↓
Notification status = FAILED
```

The failure is logged without preventing other configured channels from being processed.

This means an email failure does not necessarily prevent an in-app notification from being delivered.

---

## Testing

The backend uses **Jest** with **ts-jest** for automated unit testing.

### Test coverage

The current test suite covers the notification rule engine, including:

* `EQUALS`
* `NOT_EQUALS`
* `GREATER_THAN`
* `GREATER_THAN_OR_EQUAL`
* `LESS_THAN`
* `LESS_THAN_OR_EQUAL`
* `CONTAINS`
* Missing event fields
* Unsupported operators
* Multiple conditions
* Failed conditions
* Rules with no conditions

### Test results

The current test suite contains **13 tests**, all of which are passing.

```bash
npm test
```

Result:

```text
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

### Build verification

The backend TypeScript compilation has also been verified successfully:

```bash
npm run build
```

The production TypeScript build completes without errors.

### Future test coverage

Before taking the system to production, additional integration tests would be added for the complete notification workflow, including:

```text
Event
  ↓
Rule matching
  ↓
Matching rule
  ↓
Notification generation
  ↓
EMAIL + IN_APP
```

This would verify that a single matching event creates the expected number of notifications and that non-matching events create no notifications.


---

## UX Considerations

The dashboard includes:

* Real-time API-backed KPI values
* Loading state while data is being retrieved
* Empty state when there are no notifications
* Recent notification activity
* Quick actions for creating rules and triggering events
* Responsive layout for smaller screens

The dashboard intentionally displays zero values when the database contains no records instead of showing placeholder/demo data.

---

## Future Improvements

Potential extensions include:

* SMS notifications
* Slack notifications
* Push notifications
* More rule operators
* Complex nested conditions
* Notification retry mechanisms
* Scheduled notifications
* User authentication and role-based access
* Pagination for notification history
* Notification filtering
* Analytics and delivery-rate charts
* Background job processing with a queue such as Redis/BullMQ
* WebSocket-based real-time dashboard updates
* Audit logs for rule changes

---

## Project Goal

The primary goal of this project is to demonstrate a scalable approach to building a configurable notification system where:

```text
Events
   ↓
Rules
   ↓
Rule Evaluation
   ↓
Notifications
   ↓
Channels
   ↓
Delivery Status
   ↓
Dashboard
```

The architecture keeps these responsibilities separated, making the system easier to maintain, test, and extend.

---
