import {Ollama} from "@langchain/community/llms/ollama";
import {loadQAStuffChain, RetrievalQAChain} from "langchain/chains";
import {HNSWLib} from "langchain/vectorstores/hnswlib";
import { connect, Cluster } from "couchbase";
import {
    CouchbaseVectorStore,
    CouchbaseVectorStoreArgs,
  } from "@langchain/community/vectorstores/couchbase";
import { getEmbeddings } from "../utils/embeddings";
import { load } from "@tensorflow-models/universal-sentence-encoder";

// import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
// // import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
// import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
// import { createRetrievalChain } from "langchain/chains/retrieval";
// import { HttpResponseOutputParser } from "langchain/output_parsers";
// import { data } from "cheerio/lib/api/attributes";


class Ai {
    llm: Ollama;
    database: Cluster;
    chain: RetrievalQAChain;

    constructor() {
        this.llm = new Ollama({
            baseUrl: process.env.OLLAMA_URL ?? 'http://localhost:11434',
            model: process.env.MODEL ?? 'llama2'
        })
        // this.database = database
        // this.chain = new RetrievalQAChain({
        //     combineDocumentsChain: loadQAStuffChain(this.llm),
        //     retriever: this.database.asRetriever(),
        //     inputKey: 'question'
        // });
    }

    public ask(question: string, handleToken?: (token: string) => (void | Promise<void>)) {
        return this.chain.invoke({ question }, {callbacks: [{
            handleLLMNewToken: handleToken
        }]});
    }

    public async connect(){
        const connectionString = process.env.DB_CONN_STR;
        const databaseUsername = process.env.DB_USERNAME;
        const databasePassword = process.env.DB_PASSWORD;

        if (!databaseUsername) {
            throw new Error(
              "Please define the DB_USERNAME environment variable inside .env"
            );
          }
        
          if (!databasePassword) {
            throw new Error(
              "Please define the DB_PASSWORD environment variable inside .env"
            );
          }
        
          if (!connectionString) {
            throw new Error(
              "Please define the DB_CONN_STR environment variable inside .env"
            );
          }

        const cluster = await connect(connectionString, {
            username: databaseUsername,
            password: databasePassword,
            configProfile: "wanDevelopment",
          });


          this.database = cluster; 
          
          return cluster;
    }

    public async createRetrieval(){
        const cluster = await this.connect();
        const bucketName = process.env.DB_BUCKET || "";
        const scopeName = process.env.DB_SCOPE || "";
        const collectionName = process.env.DB_COLLECTION || "";
        const indexName = process.env.INDEX_NAME || "";
        const textKey = "text";
        const embeddingKey = "embedding";
        const scopedIndex = true;

        const couchbaseConfig: CouchbaseVectorStoreArgs = {
            cluster,
            bucketName,
            scopeName,
            collectionName,
            indexName,
            textKey,
            embeddingKey,
            scopedIndex,
          };

          const couchbaseVectorStore = await CouchbaseVectorStore.initialize(
            await getEmbeddings(),
            couchbaseConfig
          );


        // this.database = database
        this.chain = new RetrievalQAChain({
            combineDocumentsChain: loadQAStuffChain(this.llm),
            retriever: couchbaseVectorStore.asRetriever(),
            inputKey: 'question'
        });

        return this.chain

    }

}

export const loadAi = () => new Ai();