import { MongoClient, ObjectId } from 'mongodb';

const uri =
    'mongodb+srv://demcleany:tayTFurGjkJUuWq6@cluster0.3zzd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient( uri );

// Define interfaces for User and Post
interface User
{
    _id: ObjectId;
    name: string;
    email: string;
    age: number;
}

interface Post
{
    _id: ObjectId;
    authorId: ObjectId;
    title: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const seedDatabase = async (): Promise<void> =>
{
    try {
        await client.connect();
        const db = client.db( 'myDatabase' );
        const usersCollection = db.collection<User>( 'users' );
        const postsCollection = db.collection<Post>( 'posts' );

        // Dummy users
        const users: User[] = [
            { _id: new ObjectId(), name: 'Alice', email: 'alice@example.com', age: 25 },
            { _id: new ObjectId(), name: 'Bob', email: 'bob@example.com', age: 30 },
            { _id: new ObjectId(), name: 'Charlie', email: 'charlie@example.com', age: 35 },
            { _id: new ObjectId(), name: 'David', email: 'david@example.com', age: 40 },
            { _id: new ObjectId(), name: 'Eve', email: 'eve@example.com', age: 45 },
        ];

        // Insert users into the database
        await usersCollection.insertMany( users );

        // Generate 2-3 posts per user
        const posts: Post[] = [];
        users.forEach( ( user ) =>
        {
            for ( let i = 0; i < Math.floor( Math.random() * 2 ) + 2; i++ ) {
                posts.push( {
                    _id: new ObjectId(),
                    authorId: user._id,
                    title: `Post ${i + 1} by ${user.name}`,
                    content: `This is the content of post ${i + 1} by ${user.name}.`,
                    status: 'published',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } );
            }
        } );

        // Insert posts into the database
        await postsCollection.insertMany( posts );

        console.log( 'Database seeded successfully!' );
    } catch ( error ) {
        console.error( 'Error seeding database:', error );
    } finally {
        await client.close();
    }
};

seedDatabase();
