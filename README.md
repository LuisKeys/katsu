# KATSU (Knowledge Acquisition & Thought Stream Understanding)
### Description 
KATSU is a natural language business assistant application designed to assist individuals in various business roles by providing access to information contained across multiple platforms and file libraries through simple natural language commands. It integrates key components such as open-source or proprietary LLM APIs for natural language processing, database access, a documents datalake, and a Slack application for user interaction.

### Abstract
KATSU serves as a sophisticated tool for businesses, facilitating streamlined access to critical information and resources. By leveraging natural language processing capabilities, users can effortlessly query and retrieve relevant data from diverse sources, including databases and document repositories. The integration with Slack further enhances user convenience, enabling seamless interaction and quick access to insights and knowledge.

### Technology Stack
- Node.js
- PostgreSQL
### Key Components
- Natural Language Processing API: KATSU utilizes advanced natural language processing capabilities to understand and interpret user queries effectively.

- Database Access: The application integrates with databases to retrieve structured data and insights relevant to user queries.

- Documents Datalake: KATSU leverages a documents datalake to access and analyze unstructured data such as text documents, presentations, and spreadsheets.

- Slack Application: The Slack integration enables users to interact with KATSU directly within the Slack workspace, providing a seamless experience for accessing information and insights.

### Installation
Clone the repository: \
```git clone https://github.com/yourusername/katsu.git``` 

Navigate to the project directory:
```cd katsu```

Install dependencies:
```npm install```

### Usage
Configure the necessary APIs and integrations within the application. \
Start the Node.js server: \
```npm start``` \
Interact with KATSU via the configured interface (e.g., Slack) by issuing natural language commands. \
For the particular cxase of Slack use the following slach command: \
```/katsu ``` 

### Katsu tables:
- prompts_history
- help
- members

### Contributors
Luis Paradela

### License
This project is licensed under the MIT License.