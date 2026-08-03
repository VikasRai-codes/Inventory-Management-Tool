# Inventory Management Tool

An Inventory Management System built using **Node.js, Express.js, PostgreSQL, EJS, and Apache Kafka**.

The system manages product purchases and sales using **FIFO (First-In, First-Out)** inventory costing. Kafka is used to process inventory events such as purchases and sales.

---

## Technologies Used

* Node.js
* Express.js
* EJS
* PostgreSQL
* Apache Kafka
* KafkaJS
* FIFO Inventory Costing

---

# Kafka Integration
The system uses Kafka to process inventory events.
The Kafka topic used by the application is: inventory-events
Example purchase event:

json
{
    "product_id": "PRD001",
    "event_type": "purchase",
    "quantity": 50,
    "unit_price": 100.0,
    "timestamp": "2026-08-03T10:00:00Z"
}

Example sale event:

json
{
    "product_id": "PRD001",
    "event_type": "sale",
    "quantity": 10,
    "timestamp": "2026-08-03T11:00:00Z"
}

# How to Run the Project Locally
## 1. Clone the Repository
git clone https://github.com/VikasRai-codes/Inventory-Management-Tool.git
Move into the project directory:
## 2. Install Dependencies
## 3. Configure Environment Variables

Create a `.env` file in the project root.

Example:
PORT=3000
DATABASE_URL=your_postgresql_connection_string
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC=inventory-events
SESSION_SECRET=your_session_secret

Replace the values with your local configuration.

# Running Kafka Locally

Make sure Apache Kafka is installed and running on your system.

The Kafka broker should be available at: localhost: 9092

## 1. Create Kafka Topic
Create the required topic:


# Run the Complete Application

Start the backend: node app.js
Start the Kafka Consumer if it is a separate service:
Open your web browser and navigate to:
http://localhost:<port>/
This will take you to the application's home page.

# Project Workflow

Purchase
   ↓
Kafka Producer
   ↓
inventory-events
   ↓
Kafka Consumer
   ↓
Create Inventory Batch
   ↓
PostgreSQL


Sale
   ↓
Kafka Producer
   ↓
inventory-events
   ↓
Kafka Consumer
   ↓
Find Oldest Inventory Batch
   ↓
Apply FIFO Logic
   ↓
Calculate Cost
   ↓
Save Sale Transaction
   ↓
Update Remaining Inventory


---

## Notes

* The `inventory-events` Kafka topic must be available before publishing events.
* Purchase events create inventory batches.
* Sale events consume inventory using FIFO logic.
* The oldest inventory batch is always consumed first.
* PostgreSQL stores products, inventory batches, and sales transactions.
* Kafka handles asynchronous inventory event processing.
