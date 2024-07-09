# c3fest-workshop

## Setup Instructions:

### Setting up Couchbase Connection:
1. **Clone the Repository:** 
   - Clone the Couchbase-Ollama repository to your local machine.

2. **Install Dependencies:**
   - Run `npm install` to install all project dependencies.

3. **Environment Variables:**
   - Create a `.env` file based on the `.env.example` provided.
   - Define the following environment variables in the `.env` file:
     - `DB_CONN_STR`: Connection string for Couchbase.
     - `DB_USERNAME`: Username for Couchbase.
     - `DB_PASSWORD`: Password for Couchbase.
     - `DB_BUCKET`: Name of the Couchbase bucket.
     - `DB_SCOPE`: Name of the Couchbase scope.
     - `DB_COLLECTION`: Name of the Couchbase collection.
     - `INDEX_NAME`: Name of the index in Couchbase.

4. **Set Ollama API URL:**
   - Set the Ollama API URL in the `.env` file.
     ```
     OLLAMA_URL=http://localhost:11434
     ```

5. **Feed Documents to the Vector DB:**
   - Run `npm run feed` to scan all PDF files in the documents directory and create a database directory.

6. **Ask the AI Some Questions:**
   - Use the `query.ts` script to ask questions to the AI model.
     ```
     npm run query "How many people work at Mercadona?"
     ```

7. **Run the Project:**
   - Start the project by running the necessary scripts and commands.

## Technologies Used:
- Node.js
- Couchbase
- Hugging Face Transformers
- Langchain Community
- TypeScript

## Usage Instructions:
- The project allows users to interact with a database of documents and query the AI model for answers to their questions.
- Refer to the specific scripts and commands mentioned in the project for different functionalities.

## Dependencies:
- dotenv
- couchbase
- @langchain/community
- @xenova/transformers
- hnswlib-node
- langchain
- pdf-parse

## How to Contribute:
- If you wish to contribute to the project, feel free to fork the repository, make your changes, and submit a pull request for review.

---

This README provides a comprehensive guide on setting up the Couchbase connection, defining environment variables, and running the project. It also outlines the project's description, technologies used, usage instructions, and how to contribute. Feel free to reach out for any further assistance or clarification.
