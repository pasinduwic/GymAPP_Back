import { MongoClient } from "mongodb";

// Replace with your MongoDB Atlas connection string
const uri =
  "mongodb+srv://1st.wtff6.mongodb.net/GymManagementSystem?retryWrites=true&w=majority";

async function copyCollection() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();

    // Select the source and target databases
    const sourceDb = client.db("GymManagementSystem");
    const targetDb = client.db("GymManagementSystemQA");

    // Select the collections from each database
    const sourceCollection = sourceDb.collection("payments");
    const targetCollection = targetDb.collection("payments");

    // Fetch all documents from the source collection
    const documents = await sourceCollection.find().toArray();

    // Insert the documents into the target collection
    await targetCollection.insertMany(documents);

    console.log("Collection copied successfully");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

copyCollection().catch(console.error);
