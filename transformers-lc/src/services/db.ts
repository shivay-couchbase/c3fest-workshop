// import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";

import {loadAllDocuments, splitDocuments} from "../utils/documents";
// import {DB_PATH} from "../constants";
import {getEmbeddings} from "../utils/embeddings";
import { connect, Cluster } from "couchbase";
import {
    CouchbaseVectorStore,
    CouchbaseVectorStoreArgs,
  } from "@langchain/community/vectorstores/couchbase";

// export async function loadDatabase() {
//     return HNSWLib.load(DB_PATH, await getEmbeddings()).catch(() => {
//         console.error('ORAQLO: Error loading database, please feed the beast again!')
//         process.exit(1)
//     })
// }

async function couchbaseConnect(){
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

export async function generateDatabase() {

    const cluster = await couchbaseConnect();
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

        //   const couchbaseVectorStore = await CouchbaseVectorStore.initialize(
        //     await getEmbeddings(),
        //     couchbaseConfig
        //   );

    const documents = await loadAllDocuments()
    const processedDocuments = await splitDocuments(documents)
    const db = await CouchbaseVectorStore.fromDocuments(processedDocuments, await getEmbeddings(), couchbaseConfig)
    // await db.save()
    return db
}