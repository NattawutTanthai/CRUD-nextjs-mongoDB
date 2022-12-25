import clientPromise from '../../lib/mongodb';

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const db = client.db("posts");
        const posts = await db.collection("posts").insertOne(req.body);
        res.json(posts);
    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
}